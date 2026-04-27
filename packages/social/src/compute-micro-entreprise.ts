import type { Foyer } from "@akimeo/modele";
import type { MicroEntreprise } from "@akimeo/modele/entreprise/types";
import type Engine from "publicodes";
import type { Entries } from "type-fest";
import type { Filter } from "type-fest/source/except";
import { calculerIR } from "@akimeo/fiscal";
import { NATURE_ACTIVITE_ENTREPRISE } from "@akimeo/modele/entreprise/constants";
import { creerRevenuEntreprise } from "@akimeo/modele/entreprise/helpers";

import { evaluateEngine } from "./helpers/evaluate-engine";
import { setEngineSituation } from "./helpers/set-engine-situation";
import { createSituationImpot } from "./modele-social/create-situation-modele-social";

type SituationActivite =
  | {
      "entreprise . activité . nature": "'commerciale'";
      "entreprise . activités . service ou vente": "'vente'";
    }
  | {
      "entreprise . activité . nature": "'commerciale'";
      "entreprise . activités . service ou vente": "'service'";
    }
  | {
      "entreprise . activité . nature": "'libérale'";
      "entreprise . activité . nature . libérale . réglementée": "oui" | "non";
    }
  | {
      "entreprise . activité . nature": "'artisanale'";
    };

function createSituationActivite(
  microEntreprise: MicroEntreprise,
): SituationActivite {
  switch (microEntreprise.natureActivite) {
    case NATURE_ACTIVITE_ENTREPRISE.commercialeMarchandises.value:
      return {
        "entreprise . activité . nature": "'commerciale'",
        "entreprise . activités . service ou vente": "'vente'",
      };
    case NATURE_ACTIVITE_ENTREPRISE.commercialeServices.value:
      return {
        "entreprise . activité . nature": "'commerciale'",
        "entreprise . activités . service ou vente": "'service'",
      };
    case NATURE_ACTIVITE_ENTREPRISE.liberale.value:
      return {
        "entreprise . activité . nature": "'libérale'",
        "entreprise . activité . nature . libérale . réglementée": "non",
      };
    case NATURE_ACTIVITE_ENTREPRISE.artisanale.value:
      return {
        "entreprise . activité . nature": "'artisanale'",
      };
  }
}

interface SituationInput {
  "dirigeant . auto-entrepreneur . chiffre d'affaires": number;
}

function createSituationMicroEntrepriseInput(
  input: MicroEntrepriseInput,
): SituationInput {
  return {
    "dirigeant . auto-entrepreneur . chiffre d'affaires": input.chiffreAffaires,
  };
}

export interface MicroEntrepriseInput {
  chiffreAffaires: number;
}

export type MicroEntrepriseOutput = Partial<{
  cotisations: true;
  revenuNetAvantImpot: true;
  ir: true;
}>;

export function computeMicroEntreprise<Output extends MicroEntrepriseOutput>(
  engine: Engine,
  foyer: Foyer,
  microEntreprise: MicroEntreprise,
  input: MicroEntrepriseInput,
  output: Output,
) {
  setEngineSituation(engine, {
    ...createSituationImpot(foyer),
    ...createSituationActivite(microEntreprise),
    ...createSituationMicroEntrepriseInput(input),
    "dirigeant . auto-entrepreneur . impôt . versement libératoire":
      microEntreprise.versementLiberatoire ? "oui" : "non",
    "dirigeant . exonérations . ACRE": microEntreprise.acre ? "oui" : "non",
    "entreprise . date de création": `01/01/${new Date().getFullYear()}`,
    "entreprise . catégorie juridique": "'EI'",
    "entreprise . catégorie juridique . EI . auto-entrepreneur": "oui",
    "dirigeant . auto-entrepreneur": "oui",
  });
  return (Object.entries(output) as Entries<typeof output>).reduce(
    (acc, [key]) => {
      switch (key) {
        case "cotisations":
          return Object.assign(acc, {
            [key]: evaluateEngine(
              engine,
              "dirigeant . auto-entrepreneur . cotisations et contributions",
            ),
          });
        case "revenuNetAvantImpot":
          return Object.assign(acc, {
            [key]: evaluateEngine(
              engine,
              "dirigeant . auto-entrepreneur . revenu net",
            ),
          });
        case "ir":
          return Object.assign(acc, {
            [key]: calculerIR({
              ...foyer,
              declarant1: {
                ...foyer.declarant1,
                revenus: [
                  ...foyer.declarant1.revenus,
                  creerRevenuEntreprise(
                    microEntreprise,
                    evaluateEngine(
                      engine,
                      "dirigeant . rémunération . net . imposable",
                    ),
                  ),
                ],
              },
            }),
          });
      }
    },
    {} as Record<
      Filter<keyof Output, Filter<keyof Output, keyof MicroEntrepriseOutput>>,
      number
    >,
  );
}
