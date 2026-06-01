import type { Branch } from "./types";

export function fetchHarcoded() {
  const output: Branch = {
    impot_revenu: {
      calcul_impot_revenu: {
        pv: {
          pea: {
            plafond: {
              value: 150000,
              description: "Plafond des versements sur le PEA",
              url: "https://www.service-public.fr/particuliers/vosdroits/F2385",
            },
          },
        },
      },
    },
    taxation_capital: {
      epargne: {
        livret_a: {
          plafond: {
            value: 22950,
            description: "Plafond des dépôts sur un livret A",
            url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2365",
          },
        },
        ldds: {
          taux: {
            value: 0.015,
            description: "Taux de rémunération du LDDS",
            url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2368",
          },
          plafond: {
            value: 12000,
            description: "Plafond du LDDS",
            url: "https://www.service-public.gouv.fr/particuliers/vosdroits/F2368",
          },
        },
      },
    },
  };
  const warnings: string[] = [];

  return Promise.resolve({
    output,
    warnings,
  });
}
