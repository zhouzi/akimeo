import { describe, expect, it } from "vitest";

import {
  calculerPFU,
  calculerPrelevementsSociaux,
} from "~/ir/calculer-pfu";

describe("calculerPFU", () => {
  it.each([
    {
      description: "retourne 0 pour un montant nul",
      montant: 0,
      expectedPrelevementsSociaux: 0,
      expectedPFU: 0,
    },
    {
      description: "calcule les prélèvements sociaux et le PFU pour 1 000€",
      montant: 1000,
      expectedPrelevementsSociaux: 186,
      expectedPFU: 314,
    },
    {
      description: "calcule les prélèvements sociaux et le PFU pour 5 000€",
      montant: 5000,
      expectedPrelevementsSociaux: 930,
      expectedPFU: 1570,
    },
  ])(
    "$description",
    ({ montant, expectedPrelevementsSociaux, expectedPFU }) => {
      expect(calculerPrelevementsSociaux(montant)).toBeCloseTo(
        expectedPrelevementsSociaux,
        10,
      );

      expect(calculerPFU(montant)).toBeCloseTo(expectedPFU, 10);
    },
  );
});
