export const FORMAT_EUROS_OPTIONS = {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
} satisfies Intl.NumberFormatOptions;

export function formatEuros(euros: number, options?: Intl.NumberFormatOptions) {
  return euros.toLocaleString("fr-FR", {
    ...FORMAT_EUROS_OPTIONS,
    ...options,
  });
}

export const FORMAT_PERCENTAGE_OPTIONS: Intl.NumberFormatOptions = {
  style: "percent",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
};

export function formatPercentage(
  percentage: number,
  options?: Intl.NumberFormatOptions,
) {
  return percentage.toLocaleString("fr-FR", {
    ...FORMAT_PERCENTAGE_OPTIONS,
    ...options,
  });
}
