import type { AKIMEO_EMBED_RESIZE_HEIGHT_TYPE } from "./constants";

declare global {
  interface Window {
    createAkimeoEmbed?: CreateAkimeoEmbed;
  }
}

export interface AkimeoEmbedResizeHeight {
  type: typeof AKIMEO_EMBED_RESIZE_HEIGHT_TYPE;
  payload: {
    height: number;
    scrollIntoView: boolean;
  };
}

export type CreateAkimeoEmbed = (container: HTMLElement, path: string) => void;
