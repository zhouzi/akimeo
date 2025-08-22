import type { ComponentProps } from "react";
import { useCallback, useState } from "react";

import type { UseEventBusListenerCallback } from "./use-event-bus-listener";
import { IFRAME_ATTRIBUTES } from "~/browser/iframe-attributes";
import { useEventBusListener } from "./use-event-bus-listener";

const { style: initialStyle, ...attributes } = IFRAME_ATTRIBUTES;

interface AkimeoIframeProps extends ComponentProps<"iframe"> {
  path: string;
  origin?: string;
}

export function AkimeoIframe({
  path,
  origin = "https://simulateurs.akimeo.xyz",
  ...props
}: AkimeoIframeProps) {
  const [style, setStyle] = useState(initialStyle);

  const callback = useCallback<UseEventBusListenerCallback>(
    (data) =>
      setStyle((current) => ({
        ...current,
        height: `${Math.ceil(data.payload.height)}px`,
      })),
    [],
  );
  const iframeRef = useEventBusListener(callback);

  return (
    <iframe
      ref={iframeRef}
      {...attributes}
      {...props}
      style={{ ...style, ...props.style }}
      src={new URL(path, origin).toString()}
    />
  );
}
