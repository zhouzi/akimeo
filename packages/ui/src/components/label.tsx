import type { LabelProps } from "react-aria-components";
import { Label as RACLabel } from "react-aria-components";
import { twMerge } from "tailwind-merge";

export function Label(props: LabelProps) {
  return (
    <RACLabel
      {...props}
      className={twMerge(
        "w-fit text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        props.className,
      )}
    />
  );
}
