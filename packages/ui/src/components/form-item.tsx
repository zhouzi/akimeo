import { createContext, useContext, useId } from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "~/lib/utils";

interface FormItemContextValue {
  id: string;
}

const FormItemContext = createContext<FormItemContextValue>({ id: "" });

export function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

// TODO: il manque le aria-describedby quand un FormDescription et/ou un FormMessage est présent
//       ce qui nécessite de recevoir l'erreur et l'id du FormDescription depuis FormItem
// TODO: il manque la coloration du texte/aria-invalid lorsqu'il y a une erreur
//       ce qui nécessite de recevoir l'erreur depuis FormItem
export function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { id } = useContext(FormItemContext);

  return <Slot data-slot="form-control" id={id} {...props} />;
}

// TODO: il manque la coloration du texte lorsqu'il y a une erreur
//       ce qui nécessite de recevoir l'erreur depuis FormItem
export function FormLabel({ ...props }: React.ComponentProps<"label">) {
  const { id } = useContext(FormItemContext);

  return <Slot data-slot="form-label" htmlFor={id} {...props} {...props} />;
}
