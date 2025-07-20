import { useEffect, useRef } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { I18nProvider } from "react-aria-components";

export const Route = createRootRoute({
  component: () => {
    const interactedRef = useRef(false);

    useEffect(() => {
      let timeoutId;

      const onInteract = () => {
        clearTimeout(timeoutId);
        interactedRef.current = true;

        setTimeout(() => {
          interactedRef.current = false;
        }, 500);
      };

      window.document.addEventListener("mouseup", onInteract);

      return () => {
        clearTimeout(timeoutId);
        window.document.removeEventListener("mouseup", onInteract);
      };
    }, []);

    useEffect(() => {
      const observer = new ResizeObserver(([entry]) => {
        if (entry == null) {
          return;
        }

        const event = {
          type: "akimeo:resize-height",
          payload: {
            height: entry.contentRect.height,
            scrollIntoView: interactedRef.current,
          },
        };

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        window.parent?.postMessage(event, "*");
      });

      observer.observe(window.document.body);

      return () => observer.disconnect();
    }, []);

    return (
      <I18nProvider locale="fr-FR">
        <Outlet />
      </I18nProvider>
    );
  },
});
