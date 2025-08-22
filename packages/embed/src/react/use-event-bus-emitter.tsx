import { useEffect, useRef } from "react";

import type { ResizeHeightEventData } from "~/browser/types";
import { RESIZE_HEIGHT_EVENT_DATA_TYPE } from "~/browser/resize-height-event";

export function useEventBusEmitter() {
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

      const event: ResizeHeightEventData = {
        type: RESIZE_HEIGHT_EVENT_DATA_TYPE,
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
}
