import type { InputProps } from "react-aria-components";
import { Input as RACInput } from "react-aria-components";

import { composeTailwindRenderProps } from "./utils";

export function Input(props: InputProps) {
  return (
    <RACInput
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "min-w-0 flex-1 bg-white px-2 py-1.5 text-sm text-gray-800 outline outline-0 disabled:text-gray-200 dark:bg-zinc-900 dark:text-zinc-200 dark:disabled:text-zinc-600",
      )}
    />
  );
}
