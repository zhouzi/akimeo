import type { ButtonProps as RACButtonProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import { composeRenderProps, Button as RACButton } from "react-aria-components";
import { tv } from "tailwind-variants";

import { focusRing } from "../lib/utils";

export const buttonStyles = tv({
  extend: focusRing,
  base: "border text-sm rounded-md outline-0 inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap border-transparent font-normal [&_svg]:size-4 [&_svg]:shrink-0",
  variants: {
    variant: {
      ghost:
        "bg-transparent text-foreground hover:bg-primary/5 [&_svg]:text-primary",
      outline:
        "border-border shadow-sm hover:bg-primary/5 [&_svg]:text-primary",
      primary: "bg-primary text-primary-foreground",
    },
    size: {
      sm: "px-2 py-1",
      md: "h-10 px-3 py-2",
      icon: "size-6 p-0",
    },
    isDisabled: {
      true: "pointer-events-none opacity-50",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export interface ButtonProps
  extends RACButtonProps,
    VariantProps<typeof buttonStyles> {}

export function Button(props: ButtonProps) {
  return (
    <RACButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        buttonStyles({
          ...renderProps,
          variant: props.variant,
          size: props.size,
          className,
        }),
      )}
    />
  );
}
