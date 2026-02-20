import { describe, expect, it } from "vitest";

import { computeAmortissementLineaire } from "~/compute-amortissement-lineaire";

describe("computeAmortissementLineaire", () => {
  it.each([
    {
      description: "1er janvier, 5 ans, 10 000€ - année complète",
      dateDebut: new Date(2025, 0, 1),
      montant: 10000,
      duree: 5,
      expected: [2000, 2000, 2000, 2000, 2000],
    },
    {
      description: "1er janvier, 3 ans, 12 000€ - année complète",
      dateDebut: new Date(2025, 0, 1),
      montant: 12000,
      duree: 3,
      expected: [4000, 4000, 4000],
    },
    {
      description: "15 janvier, 5 ans, 12 000€ - prorata 346/360",
      dateDebut: new Date(2025, 0, 15),
      montant: 12000,
      duree: 5,
      expected: [2306.666666666667, 2400, 2400, 2400, 2400, 93.33333333333212],
    },
    {
      description: "15 juillet, 5 ans, 12 000€ - prorata 166/360",
      dateDebut: new Date(2025, 6, 15),
      montant: 12000,
      duree: 5,
      expected: [
        1106.6666666666667, 2400, 2400, 2400, 2400, 1293.3333333333321,
      ],
    },
    {
      description: "16 janvier, 5 ans, 12 000€ - prorata 345/360",
      dateDebut: new Date(2025, 0, 16),
      montant: 12000,
      duree: 5,
      expected: [2300, 2400, 2400, 2400, 2400, 100],
    },
    {
      description: "20 mars, 5 ans, 12 000€ - prorata 281/360",
      dateDebut: new Date(2025, 2, 20),
      montant: 12000,
      duree: 5,
      expected: [1873.3333333333335, 2400, 2400, 2400, 2400, 526.6666666666661],
    },
    {
      description: "31 décembre, 5 ans, 12 000€ - prorata 0/360",
      dateDebut: new Date(2025, 11, 31),
      montant: 12000,
      duree: 5,
      expected: [0, 2400, 2400, 2400, 2400, 2400],
    },
    {
      description: "1er avril, 7 ans, 50 000€",
      dateDebut: new Date(2025, 3, 1),
      montant: 50000,
      duree: 7,
      expected: [
        5357.142857142857, 7142.857142857143, 7142.857142857143,
        7142.857142857143, 7142.857142857143, 7142.857142857143,
        7142.857142857143, 1785.7142857142753,
      ],
    },
  ])("$description", ({ dateDebut, montant, duree, expected }) => {
    expect(computeAmortissementLineaire(dateDebut, montant, duree)).toEqual(
      expected,
    );
  });
});
