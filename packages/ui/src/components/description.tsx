import type { TextProps } from "react-aria-components";
import { Text } from "react-aria-components";
import { twMerge } from "tailwind-merge";

export function Description(props: TextProps) {
  return (
    <Text
      {...props}
      slot="description"
      className={twMerge("text-sm text-gray-600", props.className)}
    />
  );
}
