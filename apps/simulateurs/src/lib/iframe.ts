// Ce script est utilisé pour imbriquer un simulateur sur un site tiers
// Il ne faut rien importer ici, pour le garder le plus léger possible
// À l'exception du fichier de constants

import type { ResizeEvent } from "./iframe.constants";
import { RESIZE_EVENT_TYPE } from "./iframe.constants";

declare global {
  interface Window {
    createAkimeoEmbed?: typeof createAkimeoEmbed;
  }
}

const classes = {
  container: "akimeo-simulateur",
  containerLoading: "akimeo-simulateur--loading",
  containerLoaded: "akimeo-simulateur--loaded",
  spinner: "akimeo-spinner",
};

function injectStyles() {
  const style = window.document.createElement("style");

  style.innerHTML = `.${classes.container} {
  position: relative;
  display: block;
  width: 100%;
  overflow: hidden;
}
.${classes.container} > iframe {
  position: relative;
  z-index: 0;
  opacity: 0;
  transform: translateY(20px);
}
.${classes.containerLoading} > iframe {
  transition-duration: 300ms;
  transition-timing-function: ease-out;
  transition-property: opacity, transform, height;
}
.${classes.containerLoaded} > iframe {
  opacity: 1;
  transform: translateY(0);
}
@keyframes akimeo-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.${classes.spinner} {
  pointer-events: none;
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: akimeo-spin linear 1400ms infinite;
  transition-duration: 600ms;
  transition-timing-function: ease-out;
  transition-property: opacity;
}
.${classes.containerLoaded} .${classes.spinner} {
  opacity: 0;
}`;

  window.document.head.appendChild(style);
}

function isResizeEvent(
  event: MessageEvent<unknown>,
): event is MessageEvent<ResizeEvent> {
  return (
    typeof event.data === "object" &&
    event.data != null &&
    "type" in event.data &&
    event.data.type === RESIZE_EVENT_TYPE &&
    "payload" in event.data &&
    typeof event.data.payload === "object" &&
    event.data.payload != null &&
    "height" in event.data.payload &&
    typeof event.data.payload.height === "number" &&
    "scrollIntoView" in event.data.payload &&
    typeof event.data.payload.scrollIntoView === "boolean"
  );
}

function listenToResizeEvents() {
  window.addEventListener(
    "message",
    (event: MessageEvent<Record<string, unknown>>) => {
      if (isResizeEvent(event)) {
        window.document
          .querySelectorAll(`.${classes.container} iframe`)
          .forEach((iframe) => {
            if (!(iframe instanceof HTMLIFrameElement)) {
              return;
            }

            if (iframe.contentWindow !== event.source) {
              return;
            }

            iframe.style.height = `${Math.ceil(event.data.payload.height)}px`;

            if (event.data.payload.scrollIntoView) {
              const top = iframe.getBoundingClientRect().top;

              if (top < 100) {
                window.scroll({
                  top: Math.max(0, top + window.scrollY - 100),
                  behavior: "smooth",
                });
              }
            }

            const container = iframe.parentElement;

            if (
              container &&
              !container.classList.contains(classes.containerLoaded)
            ) {
              container.classList.add(classes.containerLoaded);

              setTimeout(() => {
                container.classList.remove(classes.containerLoading);
              }, 1000);
            }
          });
      }
    },
  );
}

function createAkimeoEmbed(container: HTMLElement, simulateurPath: string) {
  container.classList.add(classes.container, classes.containerLoading);

  const spinner = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  spinner.setAttribute("width", "24");
  spinner.setAttribute("height", "24");
  spinner.setAttribute("fill", "none");
  spinner.setAttribute("stroke", "currentColor");
  spinner.setAttribute("stroke-width", "2");
  spinner.setAttribute("stroke-linecap", "round");
  spinner.setAttribute("stroke-linejoin", "round");

  spinner.innerHTML = `<path d="M12 2v4M16.2 7.8l2.9-2.9M18 12h4M16.2 16.2l2.9 2.9M12 18v4M4.9 19.1l2.9-2.9M2 12h4M4.9 4.9l2.9 2.9"/>`;

  spinner.classList.add(classes.spinner);
  container.appendChild(spinner);

  const iframe = document.createElement("iframe");
  iframe.style.display = "block";
  iframe.style.width = "100%";
  iframe.style.height = "400px";
  iframe.style.border = "none";
  iframe.style.overflow = "hidden";
  iframe.setAttribute("scrolling", "no");

  iframe.setAttribute("src", new URL(simulateurPath, origin).toString());

  container.appendChild(iframe);
}

if (window.createAkimeoEmbed == null) {
  injectStyles();
  listenToResizeEvents();
  window.createAkimeoEmbed = createAkimeoEmbed;
}

const script = window.document.currentScript;

if (!script || !(script instanceof HTMLScriptElement)) {
  throw new Error(
    `Impossible de récupérer les attributs du script d'intégration d'un simulateur Akimeo.`,
  );
}

const origin = new URL(script.src).origin;

if (script.dataset.simulateur) {
  const container = window.document.createElement("div");

  if (script.parentElement?.tagName === "HEAD") {
    window.document.body.appendChild(container);
  } else {
    script.before(container);
  }

  createAkimeoEmbed(container, script.dataset.simulateur);
} else {
  const onLoaded = () => {
    window.document
      .querySelectorAll("[data-simulateur]")
      .forEach((container) => {
        if (
          container.tagName.toLowerCase() === "script" ||
          !(container instanceof HTMLElement) ||
          typeof container.dataset.simulateur !== "string"
        ) {
          return;
        }
        createAkimeoEmbed(container, container.dataset.simulateur);
      });
  };

  if (window.document.readyState === "complete") {
    onLoaded();
  } else {
    window.document.addEventListener("readystatechange", () => {
      if (window.document.readyState === "complete") {
        onLoaded();
      }
    });
  }
}
