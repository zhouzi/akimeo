import type Engine from "publicodes";
import type { Entries } from "type-fest";
import type { Filter } from "type-fest/source/except";
import { calculerIR } from "@akimeo/fiscal";
import { Foyer, NATURE_REVENU } from "@akimeo/modele";
import { SAS } from "@akimeo/modele/entreprise/types";

import {
  computeRegimeGeneral,
  RegimeGeneralOutput,
} from "./compute-regime-general";
import { createSituationAcre, SituationAcre } from "./create-situation-acre";
import { createSituationImpot, SituationImpot } from "./create-situation-impot";
import { evaluateEngine } from "./evaluate-engine";
import { setEngineSituation } from "./set-engine-situation";

interface SASInputRemunerationTotale {
  remunerationTotale: number;
}
function isSASInputRemunerationTotale(
  input: SASInput,
): input is SASInputRemunerationTotale {
  return (
    typeof (input as SASInputRemunerationTotale).remunerationTotale === "number"
  );
}

interface SASInputRemunerationNetAvantImpot {
  remunerationNetAvantImpot: number;
}
function isSASInputRemunerationNetAvantImpot(
  input: SASInput,
): input is SASInputRemunerationNetAvantImpot {
  return (
    typeof (input as SASInputRemunerationNetAvantImpot)
      .remunerationNetAvantImpot === "number"
  );
}

type SASInput = SASInputRemunerationTotale | SASInputRemunerationNetAvantImpot;

type SituationSASInput =
  | {
      "dirigeant . rémunération . totale": number;
    }
  | {
      "salarié . rémunération . net . à payer avant impôt": number;
    };

function createSituationSASInput(input: SASInput): SituationSASInput {
  switch (true) {
    case isSASInputRemunerationTotale(input):
      return {
        "dirigeant . rémunération . totale": input.remunerationTotale,
      };
    case isSASInputRemunerationNetAvantImpot(input):
    default:
      return {
        "salarié . rémunération . net . à payer avant impôt":
          input.remunerationNetAvantImpot,
      };
  }
}

type SituationSARL = SituationImpot &
  SituationAcre &
  SituationSASInput & {
    "entreprise . catégorie juridique": "'SAS'";
    "entreprise . date de création": string;
  };

function createSituationSAS(
  foyer: Foyer,
  sas: SAS,
  input: SASInput,
): SituationSARL {
  return {
    ...createSituationImpot(foyer),
    ...createSituationAcre(sas),
    ...createSituationSASInput(input),
    "entreprise . catégorie juridique": "'SAS'",
    "entreprise . date de création": `01/01/${new Date().getFullYear()}`,
  };
}

type SASOutput = RegimeGeneralOutput &
  Partial<{
    cotisations: true;
    ir: true;
    remunerationNetAvantImpot: true;
    remunerationTotale: true;
  }>;

export function computeSAS<Output extends SASOutput>(
  engine: Engine,
  foyer: Foyer,
  sas: SAS,
  input: SASInput,
  output: Output,
) {
  setEngineSituation(engine, {
    ...createSituationSAS(foyer, sas, input),
  });
  return (Object.entries(output) as Entries<typeof output>).reduce(
    (acc, [key]) => {
      switch (key) {
        case "cotisations":
          return Object.assign(acc, {
            [key]: evaluateEngine(engine, "salarié . cotisations"),
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
                    nature: NATURE_REVENU.salaire.value,
                    montantAnnuel: evaluateEngine(
                      engine,
                      "dirigeant . rémunération . net . imposable",
                    ),
                  },
                ],
              },
            }),
          });
        case "remunerationNetAvantImpot":
          return Object.assign(acc, {
            [key]: evaluateEngine(
              engine,
              "salarié . rémunération . net . à payer avant impôt",
            ),
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
            computeRegimeGeneral(engine, { [key]: true }),
          );
      }
    },
    {} as Record<
      Filter<keyof Output, Filter<keyof Output, keyof SASOutput>>,
      number
    >,
  );
}
