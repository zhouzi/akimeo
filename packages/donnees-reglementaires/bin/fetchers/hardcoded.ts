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
  };
  const warnings: string[] = [];

  return Promise.resolve({
    output,
    warnings,
  });
}
