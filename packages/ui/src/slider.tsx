import type {
  SliderTrackProps as RACSliderTrackProps,
  SliderProps,
} from "react-aria-components";
import {
  Slider as RACSlider,
  SliderTrack as RACSliderTrack,
  SliderOutput,
  SliderThumb,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { Description } from "./description";
import { Label } from "./label";
import { composeTailwindRenderProps } from "./utils";

export interface SliderFieldProps<T = number> extends SliderProps<T> {
  label?: string;
  description?: string;
  thumbLabels?: string[];
}

export function SliderField<T extends number | number[]>({
  label,
  description,
  thumbLabels,
  ...props
}: SliderFieldProps<T>) {
  return (
    <Slider
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "orientation-horizontal:grid orientation-vertical:flex grid-cols-[1fr_auto] flex-col items-center",
      )}
    >
      <Label>{label}</Label>
      <SliderOutput className="orientation-vertical:hidden text-lg leading-tight font-medium">
        {({ state }) =>
          state.values.map((_, i) => state.getThumbValueLabel(i)).join(" - ")
        }
      </SliderOutput>
      <SliderTrack thumbLabels={thumbLabels} />
      {description && <Description>{description}</Description>}
    </Slider>
  );
}

export const Slider = RACSlider;

const trackStyles = tv({
  base: "rounded-full bg-primary/20",
  variants: {
    orientation: {
      horizontal: "h-[6px] w-full",
      vertical: "ml-[50%] h-full w-[6px] -translate-x-[50%]",
    },
    isDisabled: {
      false: "",
      true: "",
    },
  },
});

const thumbStyles = tv({
  base: "group-orientation-horizontal:mt-6 group-orientation-vertical:ml-3 relative h-6 w-3 cursor-pointer rounded-sm border bg-input shadow-sm hover:border-foreground/30 hover:shadow-md",
  variants: {
    isDragging: {
      true: "",
    },
    isDisabled: {
      true: "",
    },
  },
});

export interface SliderTrackProps extends RACSliderTrackProps {
  thumbLabels?: string[];
}

export function SliderTrack({ thumbLabels, ...props }: SliderTrackProps) {
  return (
    <RACSliderTrack
      {...props}
      className="orientation-horizontal:h-6 orientation-vertical:w-6 orientation-vertical:h-64 group col-span-2 flex items-center"
    >
      {({ state, ...renderProps }) => (
        <>
          <div
            className="bg-primary absolute top-1/2 left-0 h-[6px] -translate-y-1/2 rounded-full"
            style={{ width: state.getThumbPercent(0) * 100 + "%" }}
          />
          <div className={trackStyles(renderProps)} />
          {state.values.map((_, i) => (
            <SliderThumb
              key={i}
              index={i}
              aria-label={thumbLabels?.[i]}
              className={thumbStyles}
            >
              <div className="absolute top-1/2 left-1/2 flex w-1/3 -translate-x-1/2 -translate-y-1/2 flex-col gap-1">
                <div className="bg-border h-px w-full" />
                <div className="bg-border h-px w-full" />
              </div>
            </SliderThumb>
          ))}
        </>
      )}
    </RACSliderTrack>
  );
}
