export const CONTRAT_POSTE = {
  cdi: {
    label: "CDI",
    value: "cdi" as const,
  },
  cdd: {
    label: "CDD",
    value: "cdd" as const,
  },
  apprentissage: {
    label: "Apprentissage",
    value: "apprentissage" as const,
  },
  professionnalisation: {
    label: "Professionnalisation",
    value: "professionnalisation" as const,
  },
  stage: {
    label: "Stage",
    value: "stage" as const,
  },
};
export const CONTRAT_POSTE_OPTIONS = Object.values(CONTRAT_POSTE);
