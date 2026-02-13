export const FORMAT_EUROS_OPTIONS = {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
} satisfies Intl.NumberFormatOptions;

export function formatEuros(value: number, options?: Intl.NumberFormatOptions) {
  return value.toLocaleString("fr-FR", {
    ...FORMAT_EUROS_OPTIONS,
    ...options,
  });
}
