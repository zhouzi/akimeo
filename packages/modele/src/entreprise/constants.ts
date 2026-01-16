export const STATUT_ENTREPRISE = {
  microEntreprise: {
    label: "Micro-Entreprise",
    value: "micro-entreprise" as const,
  },
  sarl: {
    label: "SARL",
    value: "sarl" as const,
  },
};
export const STATUT_ENTREPRISE_OPTIONS = Object.values(STATUT_ENTREPRISE);
