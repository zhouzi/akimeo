import {
  creerAdulte,
  creerEnfant,
  NATURE_REVENU,
  SITUATION_FAMILIALE,
} from "@akimeo/modele";
import { NATURE_ACTIVITE_ENTREPRISE } from "@akimeo/modele/entreprise/constants";
import { creerSARL } from "@akimeo/modele/entreprise/helpers";
import { creerFoyer } from "@akimeo/modele/foyer/helpers";
import { beforeAll, describe, expect, it } from "vitest";

import type { EngineTI } from "../modele-ti/create-engine-ti";
import { computeSARL } from "~/compute-sarl";
import { createEngineTI } from "../modele-ti/create-engine-ti";
import { cartesian } from "./helpers";

describe("computeSARL", () => {
  let engine: EngineTI;

  beforeAll(() => {
    engine = createEngineTI();
  });

  it.each(
    cartesian({
      activite: [
        NATURE_ACTIVITE_ENTREPRISE.liberale,
        NATURE_ACTIVITE_ENTREPRISE.commerciale,
        NATURE_ACTIVITE_ENTREPRISE.artisanale,
      ],
      input: [
        { chiffreAffaires: 0 },
        { chiffreAffaires: 60_000 },
        { chiffreAffaires: 120_000 },
        { remunerationNetteAvantImpot: 0 },
        { remunerationNetteAvantImpot: 40_000 },
      ],
      acre: [true, false],
      situationFamiliale: [
        SITUATION_FAMILIALE.celibataire,
        SITUATION_FAMILIALE.marie,
      ],
      enfants: [0, 1],
      revenusAdditionnels: [0, 40_000],
    }).map(
      ({
        activite,
        input,
        acre,
        situationFamiliale,
        enfants,
        revenusAdditionnels,
      }) => ({
        description: [
          activite.label,
          typeof input.chiffreAffaires === "number"
            ? `rémunération totale ${input.chiffreAffaires}`
            : `rémunération nette ${input.remunerationNetteAvantImpot}`,
          acre ? "avec Acre" : "sans Acre",
          situationFamiliale.label,
          enfants > 0 ? `${enfants} enfant(s)` : "sans enfant",
          revenusAdditionnels > 0
            ? `revenus additionnels ${revenusAdditionnels}`
            : "sans revenu additionnel",
        ].join(", "),
        foyer: creerFoyer({
          situationFamiliale: situationFamiliale.value,
          declarant1: creerAdulte({
            revenus:
              revenusAdditionnels > 0
                ? [
                    {
                      nature: NATURE_REVENU.autre.value,
                      montantAnnuel: revenusAdditionnels,
                    },
                  ]
                : [],
          }),
          enfants: Array.from({ length: enfants }).map(() => creerEnfant({})),
        }),
        sarl: creerSARL({
          natureActivite: activite.value,
          acre: acre,
        }),
        input: input,
      }),
    ),
  )("#%$", ({ description, foyer, sarl, input }) => {
    expect(
      computeSARL(engine, foyer, sarl, input, { cotisations: true, ir: true }),
    ).toMatchSnapshot(description);
  });
});
