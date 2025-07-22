import type { SliderFieldProps } from "./slider";
import { SliderField } from "./slider";
import {
  createFormHook,
  createFormHookContexts,
  useStore,
} from "@tanstack/react-form";

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

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    SliderField: (props: SliderFieldProps) => {
      const fieldProps = useFieldProps<number>();
      return <SliderField {...props} {...fieldProps} />;
    },
  },
  formComponents: {},
  fieldContext,
  formContext,
});
