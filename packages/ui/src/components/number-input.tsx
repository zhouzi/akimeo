import type { ComponentProps } from "react";
import { NumberField as BaseUINumberField } from "@base-ui-components/react/number-field";
import { CalendarSync, MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "./button";
import { FormDescription } from "./form-description";
import { FormControl, FormItem, FormLabel } from "./form-item";
import { FormMessage } from "./form-message";
import { FrequenceToggle } from "./frequence-toggle";
import { inputVariants } from "./input";
import { Label } from "./label";

export interface NumberFrequenceInputFieldProps
  extends NumberFrequenceInputProps {
  label?: string;
  description?: string;
  errorMessage?: string;
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
  step,
  min,
  max,
  ...props
}: NumberFrequenceInputProps) {
  return (
    <FrequenceToggle
      value={props.value ?? 0}
      children={({ value, serialize, deserialize, label, toggleFrequence }) => (
        <div className="flex [&>*:first-child]:flex-1 [&>*:first-child>*>*:last-child>*]:rounded-r-none [&>*:first-child>*>*:last-child>*]:border-r-0 [&>*:last-child]:rounded-l-none">
          <FormControl>
            <NumberInput
              {...props}
              onValueChange={(value) => onValueChange?.(deserialize(value))}
              value={value}
              min={min == null ? min : serialize(min, 10)}
              max={max == null ? max : serialize(max, 10)}
              step={step == null ? step : serialize(step, 10)}
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

export interface NumberInputFieldProps extends NumberInputProps {
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

interface NumberInputProps
  extends Omit<ComponentProps<typeof BaseUINumberField.Root>, "onValueChange"> {
  onValueChange?: (value: number) => void;
  placeholder?: string;
}

export function NumberInput({
  onValueChange,
  placeholder,
  ...props
}: NumberInputProps) {
  return (
    <BaseUINumberField.Root
      locale="fr"
      {...props}
      onValueChange={(value) => {
        if (typeof value === "number") {
          onValueChange?.(value);
        }
      }}
    >
      <BaseUINumberField.Group className="flex [&>*:first-child]:rounded-r-none [&>*:first-child]:border-r-0">
        <BaseUINumberField.Input
          className={inputVariants()}
          placeholder={placeholder}
        />
        <div className="grid [&>*]:h-auto [&>*]:rounded-l-none [&>*]:px-1! [&>*]:py-1! [&>*:first-child]:rounded-b-none [&>*:first-child]:border-b-0 [&>*:last-child]:rounded-t-none [&>*>svg]:size-2!">
          <Button variant="outline" asChild>
            <BaseUINumberField.Increment>
              <PlusIcon />
            </BaseUINumberField.Increment>
          </Button>
          <Button variant="outline" asChild>
            <BaseUINumberField.Decrement>
              <MinusIcon />
            </BaseUINumberField.Decrement>
          </Button>
        </div>
      </BaseUINumberField.Group>
    </BaseUINumberField.Root>
  );
}
