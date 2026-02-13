export const FORMAT_PERCENTAGE_OPTIONS: Intl.NumberFormatOptions = {
  style: "percent",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
};

export function formatPercentage(
  value: number,
  options?: Intl.NumberFormatOptions,
) {
  return value.toLocaleString("fr-FR", {
    ...FORMAT_PERCENTAGE_OPTIONS,
    ...options,
  });
}
