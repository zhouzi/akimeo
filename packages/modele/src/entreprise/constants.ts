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

export const NATURE_ACTIVITE_ENTREPRISE = {
  commercialeMarchandises: {
    label: "Commerciale - Marchandises",
    value: "commerciale-marchandises" as const,
  },
  commercialeServices: {
    label: "Commerciale - Services",
    value: "commerciale-services" as const,
  },
  commerciale: {
    label: "Commerciale",
    value: "commerciale" as const,
  },
  artisanale: {
    label: "Artisanale",
    value: "artisanale" as const,
  },
  liberale: {
    label: "Libérale",
    value: "liberale" as const,
  },
  agricole: {
    label: "Agricole",
    value: "agricole" as const,
  },
};
export const NATURE_ACTIVITE_ENTREPRISE_OPTIONS = Object.values(
  NATURE_ACTIVITE_ENTREPRISE,
);
