import {
  createFormHook,
  createFormHookContexts,
  useStore,
} from "@tanstack/react-form";

import type { CheckboxFieldProps } from "./checkbox";
import type {
  NumberFrequenceInputFieldProps,
  NumberInputFieldProps,
} from "./number-input";
import type { SelectFieldProps } from "./select";
import type { SliderFieldProps } from "./slider";
import type { SwitchFieldProps } from "./switch";
import { CheckboxField } from "./checkbox";
import { NumberFrequenceInputField, NumberInputField } from "./number-input";
import { SelectField } from "./select";
import { SliderField } from "./slider";
import { SwitchField } from "./switch";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

function useFieldProps<TData>() {
  const field = useFieldContext<TData>();

  const { isTouched, errors } = useStore(field.store, (state) => ({
    isTouched: state.meta.isTouched,
    errors: state.meta.errors as Error[],
  }));
  const isSubmitted = field.form.state.isSubmitted;
  const isDirty = isSubmitted || isTouched;
  const errorMessage =
    isDirty && errors.length > 0
      ? errors.map((error) => error.message).join(" ")
      : undefined;

  return {
    onChange: field.handleChange,
    onBlur: field.handleBlur,
    value: field.state.value,
    errorMessage: errorMessage,
  };
}

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    SliderField: <T extends number | number[]>(props: SliderFieldProps<T>) => {
      const fieldProps = useFieldProps<T>();
      return <SliderField {...fieldProps} {...props} />;
    },
    SwitchField: (props: SwitchFieldProps) => {
      const fieldProps = useFieldProps<boolean>();
      return <SwitchField {...fieldProps} {...props} />;
    },
    SelectField: <T extends string>(props: SelectFieldProps<T>) => {
      const fieldProps = useFieldProps<T>();
      return <SelectField {...fieldProps} {...props} />;
    },
    NumberInputField: (props: NumberInputFieldProps) => {
      const fieldProps = useFieldProps<number>();
      return <NumberInputField {...fieldProps} {...props} />;
    },
    NumberFrequenceInputField: (props: NumberFrequenceInputFieldProps) => {
      const fieldProps = useFieldProps<number>();
      return <NumberFrequenceInputField {...fieldProps} {...props} />;
    },
    CheckboxField: (props: CheckboxFieldProps) => {
      const fieldProps = useFieldProps<boolean>();
      return <CheckboxField {...fieldProps} {...props} />;
    },
  },
  formComponents: {},
  fieldContext,
  formContext,
});
