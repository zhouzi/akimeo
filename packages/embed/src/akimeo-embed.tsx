import type { ComponentProps } from "react";
import { useEffect, useRef } from "react";

interface AkimeoEmbedProps extends Omit<ComponentProps<"div">, "children"> {
  path: string;
  origin?: string;
  scriptOrigin?: string;
}

export function AkimeoEmbed({
  path,
  origin,
  scriptOrigin = `https://simulateurs.akimeo.xyz`,
  ...props
}: AkimeoEmbedProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current == null) {
      return;
    }

    containerRef.current.replaceChildren();

    if (!window.createAkimeoEmbed) {
      const script = window.document.createElement("script");
      script.src = new URL("/iframe.js", scriptOrigin).toString();

      window.document.body.appendChild(script);
      return;
    }

    window.createAkimeoEmbed(containerRef.current, path);
  }, [path, scriptOrigin]);

  return (
    <div
      {...props}
      ref={containerRef}
      data-origin={origin}
      data-simulateur={path}
    />
  );
}
