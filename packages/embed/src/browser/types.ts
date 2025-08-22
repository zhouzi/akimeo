import type { RESIZE_HEIGHT_EVENT_DATA_TYPE } from "./resize-height-event";

declare global {
  interface Window {
    createAkimeoEmbed?: CreateAkimeoEmbed;
  }
}

export interface ResizeHeightEventData {
  type: typeof RESIZE_HEIGHT_EVENT_DATA_TYPE;
  payload: {
    height: number;
    scrollIntoView: boolean;
  };
}

export type CreateAkimeoEmbed = (
  container: HTMLElement,
  path: string,
  origin?: string,
) => void;
