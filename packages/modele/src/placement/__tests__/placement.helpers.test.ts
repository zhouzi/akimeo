import { describe, expect, it } from "vitest";

import { ENVELOPPE_PLACEMENT } from "../constants";
import { creerPlacement, projeterPlacement } from "../helpers";

describe("projeterPlacement", () => {
  it("should add versements annuels", () => {
    expect(
      projeterPlacement(
        creerPlacement({
          enveloppe: ENVELOPPE_PLACEMENT.pea.value,
          versementsAnnuels: 1000,
        }),
      ).valeur.versements,
    ).toBe(1000);
  });

  it("should add versements annuels to existing versements", () => {
    expect(
      projeterPlacement(
        creerPlacement({
          enveloppe: ENVELOPPE_PLACEMENT.pea.value,
          valeur: {
            versements: 1000,
          },
          versementsAnnuels: 1000,
        }),
      ).valeur.versements,
    ).toBe(2000);
  });

  it("should not exceed plafond", () => {
    expect(
      projeterPlacement(
        creerPlacement({
          enveloppe: ENVELOPPE_PLACEMENT.pea.value,
          versementsAnnuels: 10000000,
        }),
      ).valeur.versements,
    ).toBe(ENVELOPPE_PLACEMENT.pea.plafond);
  });

  it("should not limit versements on PER", () => {
    expect(
      projeterPlacement(
        creerPlacement({
          enveloppe: ENVELOPPE_PLACEMENT.per.value,
          versementsAnnuels: 10000000,
        }),
      ).valeur.versements,
    ).toBe(10000000);
  });

  it("should add plus value from existing versements", () => {
    expect(
      projeterPlacement(
        creerPlacement({
          enveloppe: ENVELOPPE_PLACEMENT.pea.value,
          valeur: { versements: 1000 },
          rendementAnnuel: 0.1,
        }),
      ).valeur.plusValue,
    ).toBe(100);
  });

  it("should add plus value to existing plus value", () => {
    expect(
      projeterPlacement(
        creerPlacement({
          enveloppe: ENVELOPPE_PLACEMENT.pea.value,
          valeur: { versements: 1000, plusValue: 100 },
          rendementAnnuel: 0.1,
        }),
      ).valeur.plusValue,
    ).toBe(210);
  });

  it("should add plus value before versements", () => {
    expect(
      projeterPlacement(
        creerPlacement({
          enveloppe: ENVELOPPE_PLACEMENT.pea.value,
          valeur: { versements: 1000, plusValue: 0 },
          rendementAnnuel: 0.1,
          versementsAnnuels: 1000,
        }),
      ).valeur,
    ).toEqual({
      versements: 2000,
      plusValue: 100,
    });
  });

  it("should subtract retraits annuels", () => {
    expect(
      projeterPlacement(
        creerPlacement({
          enveloppe: ENVELOPPE_PLACEMENT.pea.value,
          valeur: { versements: 1000 },
          retraitsAnnuels: 100,
        }),
      ).valeur.versements,
    ).toBe(900);
  });

  it("should not subtract retraits annuels beyond 0", () => {
    expect(
      projeterPlacement(
        creerPlacement({
          enveloppe: ENVELOPPE_PLACEMENT.pea.value,
          valeur: { versements: 0 },
          retraitsAnnuels: 100,
        }),
      ).valeur.versements,
    ).toBe(0);
  });

  it("should take retraits annuels from versements and plus value", () => {
    expect(
      projeterPlacement(
        creerPlacement({
          enveloppe: ENVELOPPE_PLACEMENT.pea.value,
          valeur: { versements: 900, plusValue: 100 },
          retraitsAnnuels: 100,
        }),
      ).valeur,
    ).toEqual({
      versements: 810,
      plusValue: 90,
    });
  });
});
