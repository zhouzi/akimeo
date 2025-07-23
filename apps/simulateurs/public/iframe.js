(function () {
  if (!window.createAkimeoEmbed) {
    const style = window.document.createElement("style");
    style.innerHTML = `.akimeo-simulateur {
  position: relative;
  display: block;
  width: 100%;
  overflow: hidden;
}
.akimeo-simulateur > iframe {
  position: relative;
  z-index: 0;
  opacity: 0;
  transform: translateY(20px);
}
.akimeo-simulateur-loading > iframe {
  transition-duration: 300ms;
  transition-timing-function: ease-out;
  transition-property: opacity, transform, height;
}
.akimeo-simulateur-loaded > iframe {
  opacity: 1;
  transform: translateY(0);
}
@keyframes akimeo-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.akimeo-spinner {
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
.akimeo-simulateur-loaded .akimeo-spinner {
  opacity: 0;
}`;

    window.document.head.appendChild(style);

    window.addEventListener("message", (event) => {
      if (
        event.data.type === "akimeo:resize-height" &&
        typeof event.data.payload?.height === "number"
      ) {
        window.document
          .querySelectorAll(".akimeo-simulateur iframe")
          .forEach((iframe) => {
            if (iframe.contentWindow !== event.source) {
              return;
            }

            iframe.style.height = `${Math.ceil(event.data.payload.height)}px`;

            if (event.data.payload?.scrollIntoView) {
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
              !container.classList.contains("akimeo-simulateur-loaded")
            ) {
              container.classList.add("akimeo-simulateur-loaded");

              setTimeout(() => {
                container.classList.remove("akimeo-simulateur-loading");
              }, 1000);
            }
          });
      }
    });

    window.createAkimeoEmbed = function createAkimeoEmbed(
      container,
      simulateurPath,
    ) {
      container.classList.add("akimeo-simulateur", "akimeo-simulateur-loading");

      const spinner = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      spinner.setAttribute("width", "24");
      spinner.setAttribute("height", "24");
      spinner.setAttribute("fill", "none");
      spinner.setAttribute("stroke", "currentColor");
      spinner.setAttribute("stroke-width", "2");
      spinner.setAttribute("stroke-linecap", "round");
      spinner.setAttribute("stroke-linejoin", "round");

      spinner.innerHTML = `<path d="M12 2v4M16.2 7.8l2.9-2.9M18 12h4M16.2 16.2l2.9 2.9M12 18v4M4.9 19.1l2.9-2.9M2 12h4M4.9 4.9l2.9 2.9"/>`;

      spinner.classList.add("akimeo-spinner");
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
    };
  }

  const script = window.document.currentScript;

  if (!script) {
    throw new Error(
      `Impossible de récupérer les attributs du script d'intégration d'un simulateur Akimeo.`,
    );
  }

  const origin = new URL(script.getAttribute("src")).origin;

  if (script.dataset.simulateur) {
    const container = window.document.createElement("div");

    if (script.parentElement?.tagName === "HEAD") {
      window.document.body.appendChild(container);
    } else {
      script.before(container);
    }

    window.createAkimeoEmbed(container, script.dataset.simulateur);
  } else {
    const onLoaded = () => {
      window.document
        .querySelectorAll("[data-simulateur]")
        .forEach((container) => {
          if (container.tagName.toLowerCase() === "script") {
            return;
          }
          window.createAkimeoEmbed(container, container.dataset.simulateur);
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
})();
