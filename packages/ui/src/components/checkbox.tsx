import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { FormDescription } from "./form-description";
import { FormControl, FormItem, FormLabel } from "./form-item";
import { FormMessage } from "./form-message";
import { Label } from "./label";

export interface CheckboxFieldProps
  extends Omit<CheckboxProps, "value" | "onChange"> {
  label?: string;
  description?: string;
  errorMessage?: string;
  onChange?: (value: boolean) => void;
  value?: boolean;
}

export function CheckboxField({
  label,
  description,
  errorMessage,
  onChange,
  value,
  ...props
}: CheckboxFieldProps) {
  return (
    <FormItem className="flex items-center">
      <FormControl>
        <Checkbox {...props} onCheckedChange={onChange} checked={value} />
      </FormControl>
      <div className="grid gap-2">
        {label && (
          <FormLabel>
            <Label>{label}</Label>
          </FormLabel>
        )}
        {description && <FormDescription>{description}</FormDescription>}
        {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
      </div>
    </FormItem>
  );
}

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root>;

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[state=checked]:bg-primary",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
