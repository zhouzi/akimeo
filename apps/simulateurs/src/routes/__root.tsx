import { useEffect, useRef } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import Plausible from "plausible-tracker";

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

    useEffect(() => {
      const { hostname } = window.location;

      if (hostname.includes("localhost")) {
        return;
      }

      const plausible = Plausible({
        domain: hostname,
        apiHost: "https://stats.gabin.app",
      });

      plausible.enableAutoPageviews();

      // This should not be necessary, but there's a bug in plausible-tracker
      // https://github.com/plausible/plausible-tracker/issues/71
      window.plausible = plausible.trackEvent;
    }, []);

    return <Outlet />;
  },
});
