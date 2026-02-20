import { describe, expect, it } from "vitest";

import { computeIS } from "~/is/compute-is";

describe("computeIS", () => {
  it.each([
    {
      description: "retourne 0 impôt pour un bénéfice de 0",
      benefice: 0,
      expected: [
        {
          threshold: 0,
          rate: 0.15,
          montantImpose: 0,
          montantImposableMax: 42500,
          impot: 0,
        },
        {
          threshold: 42500,
          rate: 0.25,
          montantImpose: 0,
          montantImposableMax: Infinity,
          impot: 0,
        },
      ],
    },
    {
      description:
        "applique uniquement le taux réduit (15%) pour un bénéfice inférieur au seuil",
      benefice: 30000,
      expected: [
        {
          threshold: 0,
          rate: 0.15,
          montantImpose: 30000,
          montantImposableMax: 42500,
          impot: 4500,
        },
        {
          threshold: 42500,
          rate: 0.25,
          montantImpose: 0,
          montantImposableMax: Infinity,
          impot: 0,
        },
      ],
    },
    {
      description: "applique le taux réduit sur exactement 42 500€ au seuil",
      benefice: 42500,
      expected: [
        {
          threshold: 0,
          rate: 0.15,
          montantImpose: 42500,
          montantImposableMax: 42500,
          impot: 6375,
        },
        {
          threshold: 42500,
          rate: 0.25,
          montantImpose: 0,
          montantImposableMax: Infinity,
          impot: 0,
        },
      ],
    },
    {
      description: "applique les deux taux pour un bénéfice supérieur au seuil",
      benefice: 100000,
      expected: [
        {
          threshold: 0,
          rate: 0.15,
          montantImpose: 42500,
          montantImposableMax: 42500,
          impot: 6375,
        },
        {
          threshold: 42500,
          rate: 0.25,
          montantImpose: 57500,
          montantImposableMax: Infinity,
          impot: 14375,
        },
      ],
    },
  ])("$description", ({ benefice, expected }) => {
    expect(computeIS(benefice)).toEqual(expected);
  });
});
