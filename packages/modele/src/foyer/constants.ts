export const SITUATION_FAMILIALE = {
  celibataire: {
    label: "Célibataire",
    value: "celibataire" as const,
  },
  divorce: {
    label: "Divorcé",
    value: "divorce" as const,
  },
  veuf: {
    label: "Veuf",
    value: "veuf" as const,
  },
  concubinage: {
    label: "Concubinage",
    value: "concubinage" as const,
  },
  marie: {
    label: "Marié",
    value: "marie" as const,
  },
  pacse: {
    label: "Pacsé",
    value: "pacse" as const,
  },
};
export const SITUATION_FAMILIALE_OPTIONS = Object.values(SITUATION_FAMILIALE);

export const IMPOSITION_RCM = {
  bareme: {
    label: "Barème progressif",
    value: "bareme" as const,
  },
  pfu: {
    label: "Prélèvement forfaitaire unique",
    value: "pfu" as const,
  },
};
