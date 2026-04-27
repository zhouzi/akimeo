import {
  creerAdulte,
  creerEnfant,
  NATURE_REVENU,
  SITUATION_FAMILIALE,
} from "@akimeo/modele";
import { creerSAS } from "@akimeo/modele/entreprise/helpers";
import { creerFoyer } from "@akimeo/modele/foyer/helpers";
import { beforeAll, describe, expect, it } from "vitest";

import type { EngineAS } from "~/modele-as/create-engine-as";
import { computeSAS } from "~/compute-sas";
import { createEngineAS } from "~/modele-as/create-engine-as";
import { cartesian } from "./helpers";

describe("computeSAS", () => {
  let engine: EngineAS;

  beforeAll(() => {
    engine = createEngineAS();
  });

  it.each(
    cartesian({
      input: [
        { remunerationTotale: 0 },
        { remunerationTotale: 60_000 },
        { remunerationTotale: 120_000 },
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
      ({ input, acre, situationFamiliale, enfants, revenusAdditionnels }) => ({
        description: [
          typeof input.remunerationTotale === "number"
            ? `rémunération totale ${input.remunerationTotale}`
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
        sas: creerSAS({
          acre: acre,
        }),
        input: input,
      }),
    ),
  )("#%$", ({ description, foyer, sas, input }) => {
    expect(
      computeSAS(engine, foyer, sas, input, { cotisations: true, ir: true }),
    ).toMatchSnapshot(description);
  });
});
