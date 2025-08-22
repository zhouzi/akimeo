import type { ResizeHeightEventData } from "./types";

export const RESIZE_HEIGHT_EVENT_DATA_TYPE = "akimeo:resize-height";

export function isResizeHeightEvent(
  event: MessageEvent<unknown>,
): event is MessageEvent<ResizeHeightEventData> {
  return (
    typeof event.data === "object" &&
    event.data != null &&
    "type" in event.data &&
    event.data.type === RESIZE_HEIGHT_EVENT_DATA_TYPE &&
    "payload" in event.data &&
    typeof event.data.payload === "object" &&
    event.data.payload != null &&
    "height" in event.data.payload &&
    typeof event.data.payload.height === "number" &&
    "scrollIntoView" in event.data.payload &&
    typeof event.data.payload.scrollIntoView === "boolean"
  );
}
