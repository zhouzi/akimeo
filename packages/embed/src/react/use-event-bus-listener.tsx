import { useEffect, useLayoutEffect, useRef } from "react";

import type { ResizeHeightEventData } from "~/browser/types";
import { isResizeHeightEvent } from "~/browser/resize-height-event";

export type UseEventBusListenerCallback = (
  resizeHeightEventData: ResizeHeightEventData,
) => void;

export function useEventBusListener(callback: UseEventBusListenerCallback) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const latestCallbackRef = useRef(callback);

  useLayoutEffect(() => {
    latestCallbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const onMessage = (event: MessageEvent<Record<string, unknown>>) => {
      if (!isResizeHeightEvent(event)) {
        return;
      }

      if (iframeRef.current == null) {
        return;
      }

      if (iframeRef.current.contentWindow !== event.source) {
        return;
      }

      latestCallbackRef.current(event.data);
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return iframeRef;
}
