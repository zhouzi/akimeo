import type Engine from "publicodes";
import type { Entries } from "type-fest";
import type { Filter } from "type-fest/source/except";
import { calculerIR } from "@akimeo/fiscal";
import { Foyer, NATURE_REVENU } from "@akimeo/modele";
import { Sarl } from "@akimeo/modele/entreprise/types";

import { computeTNS, TNSOutput } from "./compute-tns";
import { createSituationAcre, SituationAcre } from "./create-situation-acre";
import { createSituationImpot, SituationImpot } from "./create-situation-impot";
import { evaluateEngine } from "./evaluate-engine";
import { setEngineSituation } from "./set-engine-situation";

interface SARLInputRemunerationTotale {
  remunerationTotale: number;
}
function isSARLInputRemunerationTotale(
  input: SARLInput,
): input is SARLInputRemunerationTotale {
  return (
    typeof (input as SARLInputRemunerationTotale).remunerationTotale ===
    "number"
  );
}

interface SARLInputRemunerationNetAvantImpot {
  remunerationNetAvantImpot: number;
}
function isSARLInputRemunerationNetAvantImpot(
  input: SARLInput,
): input is SARLInputRemunerationNetAvantImpot {
  return (
    typeof (input as SARLInputRemunerationNetAvantImpot)
      .remunerationNetAvantImpot === "number"
  );
}

type SARLInput =
  | SARLInputRemunerationTotale
  | SARLInputRemunerationNetAvantImpot;

type SituationSARLInput =
  | {
      "dirigeant . rémunération . totale": number;
    }
  | {
      "dirigeant . rémunération . net": number;
    };

function createSituationSARLInput(input: SARLInput): SituationSARLInput {
  switch (true) {
    case isSARLInputRemunerationTotale(input):
      return {
        "dirigeant . rémunération . totale": input.remunerationTotale,
      };
    case isSARLInputRemunerationNetAvantImpot(input):
    default:
      return {
        "dirigeant . rémunération . net": input.remunerationNetAvantImpot,
      };
  }
}

type SituationSARL = SituationImpot &
  SituationAcre &
  SituationSARLInput & {
    "entreprise . imposition": "'IS'";
    "entreprise . activité . nature": "'libérale'";
    "entreprise . associés": "'unique'";
    "entreprise . catégorie juridique": "'SARL'";
    "entreprise . date de création": string;
  };

function createSituationSARL(
  foyer: Foyer,
  sarl: Sarl,
  input: SARLInput,
): SituationSARL {
  return {
    ...createSituationImpot(foyer),
    ...createSituationAcre(sarl),
    ...createSituationSARLInput(input),
    "entreprise . imposition": "'IS'",
    "entreprise . activité . nature": "'libérale'",
    "entreprise . associés": "'unique'",
    "entreprise . catégorie juridique": "'SARL'",
    "entreprise . date de création": `01/01/${new Date().getFullYear()}`,
  };
}

type SARLOutput = TNSOutput &
  Partial<{
    cotisations: true;
    ir: true;
    remunerationNetAvantImpot: true;
    remunerationTotale: true;
  }>;

export function computeSARL<Output extends SARLOutput>(
  engine: Engine,
  foyer: Foyer,
  sarl: Sarl,
  input: SARLInput,
  output: Output,
) {
  setEngineSituation(engine, {
    ...createSituationSARL(foyer, sarl, input),
  });
  return (Object.entries(output) as Entries<typeof output>).reduce(
    (acc, [key]) => {
      switch (key) {
        case "cotisations":
          return Object.assign(acc, {
            [key]: evaluateEngine(
              engine,
              "dirigeant . indépendant . cotisations et contributions",
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
                  {
                    nature: NATURE_REVENU.remuneration.value,
                    montantAnnuel: evaluateEngine(
                      engine,
                      "impôt . revenu imposable",
                    ),
                  },
                ],
              },
            }),
          });
        case "remunerationNetAvantImpot":
          return Object.assign(acc, {
            [key]: evaluateEngine(engine, "dirigeant . rémunération . net"),
          });
        case "remunerationTotale":
          return Object.assign(acc, {
            [key]: evaluateEngine(engine, "dirigeant . rémunération . totale"),
          });
        case "trimestresRetraite":
        case "cotisationsRetraite":
        case "retraiteBase":
        case "retraiteComplementaire":
          return Object.assign(
            acc,
            computeTNS(engine, {
              [key]: true,
            }),
          );
      }
    },
    {} as Record<
      Filter<keyof Output, Filter<keyof Output, keyof SARLOutput>>,
      number
    >,
  );
}
