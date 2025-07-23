import { cn } from "~/lib/utils";

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
