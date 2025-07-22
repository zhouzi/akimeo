import type {
  TextFieldProps as AriaTextFieldProps,
  ValidationResult,
} from "react-aria-components";
import { TextField as AriaTextField } from "react-aria-components";
import { tv } from "tailwind-variants";

import { composeTailwindRenderProps, focusRing } from "../lib/utils";
import { Description } from "./description";
import { FieldError } from "./field-error";
import { fieldBorderStyles } from "./field-group";
import { Input } from "./input";
import { Label } from "./label";

const inputStyles = tv({
  extend: focusRing,
  base: "border-2 rounded-md",
  variants: {
    isFocused: fieldBorderStyles.variants.isFocusWithin,
    isInvalid: fieldBorderStyles.variants.isInvalid,
    isDisabled: fieldBorderStyles.variants.isDisabled,
  },
});

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function TextField({
  label,
  description,
  errorMessage,
  ...props
}: TextFieldProps) {
  return (
    <AriaTextField
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-1",
      )}
    >
      {label && <Label>{label}</Label>}
      <Input className={inputStyles} />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
