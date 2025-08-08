import donneesReglementaires from "@akimeo/donnees-reglementaires";

export const ENVELOPPE_PLACEMENT = {
  per: {
    label: "PER",
    value: "per" as const,
    plafond: null,
  },
  pea: {
    label: "PEA",
    value: "pea" as const,
    plafond:
      donneesReglementaires.impot_revenu.calcul_impot_revenu.pv.pea.plafond,
  },
};
export const ENVELOPPE_PLACEMENT_OPTIONS = Object.values(ENVELOPPE_PLACEMENT);
