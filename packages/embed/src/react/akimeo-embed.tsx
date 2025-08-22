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
    const container = containerRef.current;

    if (container == null) {
      return;
    }

    container.replaceChildren();

    if (!window.createAkimeoEmbed) {
      // FIXME: the script might be loaded twice
      //        we need to queue the commands while it's loading
      //        and not inject the script if there's already a queue
      const script = window.document.createElement("script");

      script.addEventListener(
        "load",
        () => {
          setTimeout(() => {
            window.createAkimeoEmbed!(container, path, origin);
          }, 0);
        },
        { once: true },
      );

      script.src = new URL("/iframe.js", scriptOrigin).toString();

      window.document.body.appendChild(script);
      return;
    }

    window.createAkimeoEmbed(container, path, origin);
  }, [path, origin, scriptOrigin]);

  return <div {...props} ref={containerRef} />;
}
