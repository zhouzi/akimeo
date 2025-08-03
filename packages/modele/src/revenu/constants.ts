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
