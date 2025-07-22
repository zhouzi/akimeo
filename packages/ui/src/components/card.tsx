import type { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card(props: CardProps) {
  return (
    <article
      {...props}
      className={twMerge(
        "overflow-hidden rounded-lg border shadow-md",
        props.className,
      )}
    />
  );
}

export function CardHeader(props: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={twMerge("p-6", props.className)} />;
}

export function CardTitle(props: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      {...props}
      className={twMerge(
        "font-heading scroll-m-20 text-2xl font-semibold tracking-tight",
        props.className,
      )}
    />
  );
}

export function CardDescription(props: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={twMerge("", props.className)} />;
}

export function CardContent(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={twMerge(
        "space-y-4 p-6 [&:not(:first-child)]:pt-0",
        props.className,
      )}
    />
  );
}

export function CardFooter(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={twMerge(
        "bg-border/40 flex items-center gap-2 p-2 text-sm",
        props.className,
      )}
    />
  );
}
