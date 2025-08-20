import { useEffect, useRef } from "react";

import type { AkimeoEmbedResizeHeight } from "./types";
import { AKIMEO_EMBED_RESIZE_HEIGHT_TYPE } from "./constants";

export function useAkimeoEmbedBus() {
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

      const event: AkimeoEmbedResizeHeight = {
        type: AKIMEO_EMBED_RESIZE_HEIGHT_TYPE,
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
