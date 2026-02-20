export const FORMAT_ANNEE_OPTIONS = {
  style: "unit",
  unit: "year",
} satisfies Intl.NumberFormatOptions;

export function formatAnnee(value: number, options?: Intl.NumberFormatOptions) {
  return value.toLocaleString("fr-FR", {
    ...FORMAT_ANNEE_OPTIONS,
    ...options,
  });
}
