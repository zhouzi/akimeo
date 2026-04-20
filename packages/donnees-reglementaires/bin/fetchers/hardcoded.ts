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
      calcul_revenus_imposables: {
        deductions: {
          abatpro: {
            max: {
              value: 14555,
              description:
                "Montant maximum de la déduction forfaitaire pour frais professionnels",
              url: "https://www.impots.gouv.fr/particulier/questions/comment-puis-je-beneficier-de-la-deduction-forfaitaire-de-10",
            },
            min: {
              value: 509,
              description:
                "Montant minimum (Cas général) de la déduction forfaitaire pour frais professionnels",
              url: "https://www.impots.gouv.fr/particulier/questions/comment-puis-je-beneficier-de-la-deduction-forfaitaire-de-10",
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
