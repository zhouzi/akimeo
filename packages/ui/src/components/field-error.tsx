import type { FieldErrorProps } from "react-aria-components";
import { FieldError as RACFieldError } from "react-aria-components";

import { composeTailwindRenderProps } from "../lib/utils";

export function FieldError(props: FieldErrorProps) {
  return (
    <RACFieldError
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "text-sm text-red-600 forced-colors:text-[Mark]",
      )}
    />
  );
}
