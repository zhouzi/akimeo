import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "~/lib/utils";
import { FormDescription } from "./form-description";
import { FormControl, FormItem, FormLabel } from "./form-item";
import { FormMessage } from "./form-message";
import { Label } from "./label";

export interface SliderFieldProps
  extends Omit<SliderProps, "onChange" | "onValueChange"> {
  label?: string;
  description?: string;
  errorMessage?: string;
  onChange?: SliderProps["onValueChange"];
  formatValue?: (value: number) => React.ReactNode;
}

export function SliderField({
  label,
  description,
  errorMessage,
  onChange,
  value,
  formatValue = (value) => value,
  ...props
}: SliderFieldProps) {
  return (
    <FormItem>
      <div className="flex items-center justify-between gap-2">
        {label && (
          <FormLabel>
            <Label>{label}</Label>
          </FormLabel>
        )}
        <p className="text-sm">{value?.map(formatValue)}</p>
      </div>
      <FormControl>
        <Slider {...props} onValueChange={onChange} value={value} />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
    </FormItem>
  );
}

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root>;

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="block size-4 shrink-0 rounded-full border border-primary bg-background shadow-sm ring-ring/50 transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
