import z from "zod";

export const NATURE_REVENU = {
  salaire: {
    label: "Salaire",
    value: "salaire" as const,
  },
  remuneration: {
    label: "Rémunération",
    value: "remuneration" as const,
  },
  pensionRetraite: {
    label: "Pension retraite",
    value: "pension-retraite" as const,
  },
  autre: {
    label: "Autre",
    value: "autre" as const,
  },
  bnc: {
    label: "BNC",
    value: "bnc" as const,
  },
  microBNC: {
    label: "Micro BNC",
    value: "micro-bnc" as const,
  },
  bic: {
    label: "BIC",
    value: "bic" as const,
  },
  microBICServices: {
    label: "Micro BIC (services)",
    value: "micro-bic-services" as const,
  },
  microBICMarchandises: {
    label: "Micro BIC (marchandises)",
    value: "micro-bic-marchandises" as const,
  },
  foncier: {
    label: "Foncier",
    value: "foncier" as const,
  },
  microFoncier: {
    label: "Micro foncier",
    value: "micro-foncier" as const,
  },
  rcm: {
    label: "Revenus des capitaux mobiliers",
    value: "rcm" as const,
  },
};
export const NATURE_REVENU_OPTIONS = Object.values(NATURE_REVENU);

export interface Revenu {
  nature:
    | typeof NATURE_REVENU.salaire.value
    | typeof NATURE_REVENU.remuneration.value
    | typeof NATURE_REVENU.pensionRetraite.value
    | typeof NATURE_REVENU.autre.value
    | typeof NATURE_REVENU.bnc.value
    | typeof NATURE_REVENU.microBNC.value
    | typeof NATURE_REVENU.bic.value
    | typeof NATURE_REVENU.microBICServices.value
    | typeof NATURE_REVENU.microBICMarchandises.value
    | typeof NATURE_REVENU.foncier.value
    | typeof NATURE_REVENU.microFoncier.value
    | typeof NATURE_REVENU.rcm.value;
  montantAnnuel: number;
}

export const revenuSchema = z.object({
  nature: z.enum([
    NATURE_REVENU.salaire.value,
    NATURE_REVENU.remuneration.value,
    NATURE_REVENU.pensionRetraite.value,
    NATURE_REVENU.autre.value,
    NATURE_REVENU.bnc.value,
    NATURE_REVENU.microBNC.value,
    NATURE_REVENU.bic.value,
    NATURE_REVENU.microBICServices.value,
    NATURE_REVENU.microBICMarchandises.value,
    NATURE_REVENU.foncier.value,
    NATURE_REVENU.microFoncier.value,
    NATURE_REVENU.rcm.value,
  ]),
  montantAnnuel: z.number(),
}) satisfies z.ZodType<Revenu>;

export function isNatureRevenuMicroEntreprise(nature: Revenu["nature"]) {
  return (
    nature === NATURE_REVENU.microBICMarchandises.value ||
    nature === NATURE_REVENU.microBICServices.value ||
    nature === NATURE_REVENU.microBNC.value
  );
}
