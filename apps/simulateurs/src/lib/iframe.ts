import type { CreateAkimeoEmbed } from "@akimeo/embed/browser/types";
import type { Entries } from "type-fest";
import { IFRAME_ATTRIBUTES } from "@akimeo/embed/browser/iframe-attributes";
import { isResizeHeightEvent } from "@akimeo/embed/browser/resize-height-event";

declare global {
  interface Window {
    createAkimeoEmbed?: CreateAkimeoEmbed;
  }
}

const script = window.document.currentScript;

if (!script || !(script instanceof HTMLScriptElement)) {
  throw new Error(
    `Impossible de récupérer les attributs du script d'intégration d'un simulateur Akimeo.`,
  );
}

const classes = {
  container: "akimeo-simulateur",
  containerLoading: "akimeo-simulateur--loading",
  containerLoaded: "akimeo-simulateur--loaded",
  spinner: "akimeo-spinner",
};

const injectStyles = function injectStyles() {
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
};

const listenToResizeEvents = function listenToResizeEvents() {
  window.addEventListener(
    "message",
    (event: MessageEvent<Record<string, unknown>>) => {
      if (!isResizeHeightEvent(event)) {
        return;
      }

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
            const offset = 100;
            const { top, bottom } = iframe.getBoundingClientRect();

            if (bottom < 0 + offset) {
              window.scrollTo({
                top: window.scrollY + bottom - window.innerHeight + offset,
                behavior: "smooth",
              });
            } else if (top > window.innerHeight - offset) {
              window.scrollTo({
                top: window.scrollY + top - offset,
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
    },
  );
};

const createAkimeoEmbed: CreateAkimeoEmbed = function createAkimeoEmbed(
  container: HTMLElement,
  path,
  origin = script.dataset.origin ?? new URL(script.src).origin,
) {
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

  const { style, ...attributes } = IFRAME_ATTRIBUTES;

  (Object.entries(style) as Entries<typeof style>).forEach(([key, value]) => {
    iframe.style[key] = value;
  });

  (Object.entries(attributes) as Entries<typeof attributes>).forEach(
    ([key, value]) => {
      iframe.setAttribute(key, value);
    },
  );

  const currentUrl = new URL(window.location.href);
  const url = new URL(path, origin);

  currentUrl.searchParams.forEach((value, key) => {
    if (!url.searchParams.has(key)) {
      url.searchParams.set(key, value);
    }
  });

  iframe.setAttribute("src", url.toString());

  container.appendChild(iframe);
};

if (window.createAkimeoEmbed == null) {
  injectStyles();
  listenToResizeEvents();
  window.createAkimeoEmbed = createAkimeoEmbed;
}

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

        createAkimeoEmbed(
          container,
          container.dataset.simulateur,
          container.dataset.origin,
        );
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
