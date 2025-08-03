import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "~/lib/utils";

export const linkVariants = cva("text-primary", {
  variants: {
    variant: {
      default: "underline-offset-4 hover:underline",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function Link({
  className,
  variant,
  asChild = false,
  ...props
}: ComponentProps<"a"> &
  VariantProps<typeof linkVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="link"
      className={cn(linkVariants({ variant, className }))}
      {...props}
    />
  );
}
