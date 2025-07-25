import { cn } from "~/lib/utils";

// TODO: il manque l'id pour le aria-describedby du FormControl
//       ce qui nécessite de recevoir l'id du FormMessage depuis FormItem
export function FormMessage({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="form-message"
      className={cn("text-sm text-destructive", className)}
      {...props}
    />
  );
}
