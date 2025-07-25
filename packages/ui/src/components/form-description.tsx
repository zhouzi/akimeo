import { cn } from "~/lib/utils";

// TODO: il manque l'id pour le aria-describedby du FormControl
//       ce qui nécessite de recevoir l'id du FormDescription depuis FormItem
export function FormDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="form-description"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}
