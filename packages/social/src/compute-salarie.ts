import type { Foyer } from "@akimeo/modele/foyer/types";
import type { AnyPoste } from "@akimeo/modele/poste/types";
import type Engine from "publicodes";
import type { Entries } from "type-fest";
import type { Filter } from "type-fest/source/except";
import { CONTRAT_POSTE } from "@akimeo/modele/poste/constants";

import { evaluateEngine } from "./helpers/evaluate-engine";
import { setEngineSituation } from "./helpers/set-engine-situation";
import { createSituationImpot } from "./modele-social/create-situation-modele-social";

type SituationInput =
  | {
      "salarié . contrat . salaire brut": number;
    }
  | {
      "salarié . rémunération . net . à payer avant impôt": number;
    };

function createSituationInput(input: SalarieInput): SituationInput {
  switch (true) {
    case "salaireBrut" in input:
      return {
        "salarié . contrat . salaire brut": input.salaireBrut,
      };
    case "remunerationNetAvantImpot" in input:
    default:
      return {
        "salarié . rémunération . net . à payer avant impôt":
          input.remunerationNetAvantImpot,
      };
  }
}

function createSituationContrat(salarie: AnyPoste) {
  switch (salarie.contrat) {
    case CONTRAT_POSTE.cdi.value:
      return {
        "salarié . contrat": "'CDI'",
      };
    case CONTRAT_POSTE.cdd.value:
      return {
        "salarié . contrat": "'CDD'",
      };
    case CONTRAT_POSTE.apprentissage.value:
      return {
        "salarié . contrat": "'apprentissage'",
      };
    case CONTRAT_POSTE.professionnalisation.value:
      return {
        "salarié . contrat": "'professionnalisation'",
      };
    case CONTRAT_POSTE.stage.value:
      return {
        "salarié . contrat": "'stage'",
      };
  }
}

export type SalarieInput =
  | {
      salaireBrut: number;
    }
  | {
      remunerationNetAvantImpot: number;
    };

export type SalarieOutput = Partial<{
  coutTotalEmployer: true;
}>;

export function computeSalarie<Output extends SalarieOutput>(
  engine: Engine,
  foyer: Foyer,
  salarie: AnyPoste,
  input: SalarieInput,
  output: Output,
) {
  setEngineSituation(engine, {
    ...createSituationImpot(foyer),
    ...createSituationInput(input),
    ...createSituationContrat(salarie),
    "salarié . convention collective": "'droit commun'",
    dirigeant: "non",
    "salarié . activité partielle": "non",
    "salarié . contrat . temps de travail . temps partiel": "non",
    "salarié . contrat . statut cadre": "non",
  });
  return (Object.entries(output) as Entries<typeof output>).reduce(
    (acc, [key]) => {
      switch (key) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        case "coutTotalEmployer":
          return Object.assign(acc, {
            [key]: evaluateEngine(engine, "salarié . coût total employeur"),
          });
      }
    },
    {} as Record<
      Filter<keyof Output, Filter<keyof Output, keyof SalarieOutput>>,
      number
    >,
  );
}
