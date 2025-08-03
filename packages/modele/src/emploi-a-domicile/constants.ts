export const TYPE_EMPLOI_A_DOMICILE = {
  menage: {
    label: "Ménage",
    value: "menage" as const,
  },
  petitBricolage: {
    label: "Petit bricolage",
    value: "petit-bricolage" as const,
  },
  assistanceInformatique: {
    label: "Assistance informatique",
    value: "assistance-informatique" as const,
  },
  jardinage: {
    label: "Jardinage",
    value: "jardinage" as const,
  },
};
export const TYPE_EMPLOI_A_DOMICILE_OPTIONS = Object.values(
  TYPE_EMPLOI_A_DOMICILE,
);
