import { CalendarSync } from "lucide-react";

import type { InputProps } from "./input";
import { Button } from "./button";
import { FormDescription } from "./form-description";
import { FormControl, FormItem, FormLabel } from "./form-item";
import { FormMessage } from "./form-message";
import { FrequenceToggle } from "./frequence-toggle";
import { Input } from "./input";
import { Label } from "./label";

export interface NumberFrequcenceInputFieldProps
  extends Omit<NumberFrequenceInputProps, "onChange" | "onValueChange"> {
  label?: string;
  description?: string;
  errorMessage?: string;
  onChange?: (value: number) => void;
}

export function NumberFrequenceInputField({
  label,
  description,
  errorMessage,
  onChange,
  ...props
}: NumberInputFieldProps) {
  return (
    <FormItem>
      {label && (
        <FormLabel>
          <Label>{label}</Label>
        </FormLabel>
      )}
      <NumberFrequenceInput {...props} onValueChange={onChange} />
      {description && <FormDescription>{description}</FormDescription>}
      {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
    </FormItem>
  );
}

type NumberFrequenceInputProps = NumberInputProps;

export function NumberFrequenceInput({
  onValueChange,
  ...props
}: NumberFrequenceInputProps) {
  return (
    <FrequenceToggle
      value={props.value ?? 0}
      children={({ value, toAnnuelle, label, toggleFrequence }) => (
        <div className="flex [&>*:first-child]:rounded-r-none [&>*:first-child]:border-r-0 [&>*:last-child]:rounded-l-none">
          <FormControl>
            <NumberInput
              {...props}
              onValueChange={(value) => onValueChange?.(toAnnuelle(value))}
              value={value}
            />
          </FormControl>
          <Button variant="outline" onClick={toggleFrequence}>
            <span className="font-normal text-muted-foreground">{label}</span>
            <CalendarSync />
          </Button>
        </div>
      )}
    />
  );
}

export interface NumberInputFieldProps
  extends Omit<NumberInputProps, "onChange" | "onValueChange"> {
  label?: string;
  description?: string;
  errorMessage?: string;
  onChange?: (value: number) => void;
}

export function NumberInputField({
  label,
  description,
  errorMessage,
  onChange,
  ...props
}: NumberInputFieldProps) {
  return (
    <FormItem>
      {label && (
        <FormLabel>
          <Label>{label}</Label>
        </FormLabel>
      )}
      <FormControl>
        <NumberInput {...props} onValueChange={onChange} />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
    </FormItem>
  );
}

interface NumberInputProps extends InputProps {
  onValueChange?: (value: number) => void;
  value?: number;
}

export function NumberInput({
  onChange,
  onValueChange,
  ...props
}: NumberInputProps) {
  return (
    <Input
      {...props}
      type="number"
      onChange={(event) => {
        onChange?.(event);
        onValueChange?.(Number(event.target.value));
      }}
    />
  );
}
