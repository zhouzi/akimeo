import {
  creerAdulte,
  creerEnfant,
  NATURE_REVENU,
  SITUATION_FAMILIALE,
} from "@akimeo/modele";
import { creerFoyer } from "@akimeo/modele/foyer/helpers";
import { CONTRAT_POSTE } from "@akimeo/modele/poste/constants";
import { creerAnyPoste } from "@akimeo/modele/poste/helpers";
import { beforeAll, describe, expect, it } from "vitest";

import type { EngineSocial } from "~/modele-social/create-engine-social";
import { computeSalarie } from "~/compute-salarie";
import { createEngineSocial } from "~/modele-social/create-engine-social";
import { cartesian } from "./helpers";

describe("computeSalarie", () => {
  let engine: EngineSocial;

  beforeAll(() => {
    engine = createEngineSocial();
  });

  it.each(
    cartesian({
      contrat: [
        CONTRAT_POSTE.cdi,
        CONTRAT_POSTE.cdd,
        CONTRAT_POSTE.apprentissage,
        CONTRAT_POSTE.professionnalisation,
        CONTRAT_POSTE.stage,
      ],
      input: [
        { salaireBrut: 0 },
        { salaireBrut: 24_000 },
        { salaireBrut: 60_000 },
        { remunerationNetAvantImpot: 0 },
        { remunerationNetAvantImpot: 30_000 },
      ],
      situationFamiliale: [
        SITUATION_FAMILIALE.celibataire,
        SITUATION_FAMILIALE.marie,
      ],
      enfants: [0, 1],
      revenusAdditionnels: [0, 40_000],
    }).map(
      ({
        contrat,
        input,
        situationFamiliale,
        enfants,
        revenusAdditionnels,
      }) => ({
        description: [
          contrat.label,
          "salaireBrut" in input
            ? `salaire brut ${input.salaireBrut}`
            : `rémunération nette ${input.remunerationNetAvantImpot}`,
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
        salarie: creerAnyPoste({ contrat: contrat.value }),
        input: input,
      }),
    ),
  )("#%$", ({ description, foyer, salarie, input }) => {
    expect(
      computeSalarie(engine, foyer, salarie, input, {
        coutTotalEmployer: true,
      }),
    ).toMatchSnapshot(description);
  });
});
