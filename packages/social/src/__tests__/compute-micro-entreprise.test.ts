import {
  creerAdulte,
  creerEnfant,
  NATURE_REVENU,
  SITUATION_FAMILIALE,
} from "@akimeo/modele";
import { NATURE_ACTIVITE_ENTREPRISE } from "@akimeo/modele/entreprise/constants";
import { creerMicroEntreprise } from "@akimeo/modele/entreprise/helpers";
import { creerFoyer } from "@akimeo/modele/foyer/helpers";
import { beforeAll, describe, expect, it } from "vitest";

import type { EngineSocial } from "~/modele-social/create-engine-social";
import { computeMicroEntreprise } from "~/compute-micro-entreprise";
import { createEngineSocial } from "~/modele-social/create-engine-social";
import { cartesian } from "./helpers";

describe("computeMicroEntreprise", () => {
  let engine: EngineSocial;

  beforeAll(() => {
    engine = createEngineSocial();
  });

  it.each(
    cartesian({
      activite: [
        NATURE_ACTIVITE_ENTREPRISE.liberale,
        NATURE_ACTIVITE_ENTREPRISE.commercialeMarchandises,
        NATURE_ACTIVITE_ENTREPRISE.commercialeServices,
        NATURE_ACTIVITE_ENTREPRISE.artisanale,
      ],
      input: [
        { chiffreAffaires: 0 },
        { chiffreAffaires: 30_000 },
        { chiffreAffaires: 80_000 },
      ],
      acre: [true, false],
      versementLiberatoire: [true, false],
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
        versementLiberatoire,
        situationFamiliale,
        enfants,
        revenusAdditionnels,
      }) => ({
        description: [
          activite.label,
          `chiffre d'affaires ${input.chiffreAffaires}`,
          acre ? "avec Acre" : "sans Acre",
          versementLiberatoire
            ? "avec versement libératoire"
            : "sans versement libératoire",
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
        microEntreprise: creerMicroEntreprise({
          natureActivite: activite.value,
          acre: acre,
          versementLiberatoire: versementLiberatoire,
        }),
        input: input,
      }),
    ),
  )("#%$", ({ description, foyer, microEntreprise, input }) => {
    expect(
      computeMicroEntreprise(engine, foyer, microEntreprise, input, {
        cotisations: true,
        ir: true,
      }),
    ).toMatchSnapshot(description);
  });
});
