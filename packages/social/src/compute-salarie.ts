import type { Foyer } from "@akimeo/modele/foyer/types";
import type { AnyPoste } from "@akimeo/modele/poste/types";
import type Engine from "publicodes";
import type { Entries } from "type-fest";
import type { Filter } from "type-fest/source/except";
import { CONTRAT_POSTE } from "@akimeo/modele/poste/constants";

import type { RegimeGeneralOutput } from "./compute-regime-general";
import type { SituationImpot } from "./create-situation-impot";
import { computeRegimeGeneral } from "./compute-regime-general";
import { createSituationImpot } from "./create-situation-impot";
import { evaluateEngine } from "./evaluate-engine";
import { setEngineSituation } from "./set-engine-situation";

interface SalarieInputSalaireBrut {
  salaireBrut: number;
}
function isSalarieInputSalaireBrut(
  input: SalarieInput,
): input is SalarieInputSalaireBrut {
  return typeof (input as SalarieInputSalaireBrut).salaireBrut === "number";
}

interface SalarieInputRemunerationNetAvantImpot {
  remunerationNetAvantImpot: number;
}
function isSalarieInputRemunerationNetAvantImpot(
  input: SalarieInput,
): input is SalarieInputRemunerationNetAvantImpot {
  return (
    typeof (input as SalarieInputRemunerationNetAvantImpot)
      .remunerationNetAvantImpot === "number"
  );
}

export type SalarieInput =
  | SalarieInputSalaireBrut
  | SalarieInputRemunerationNetAvantImpot;

type SituationSalarieInput =
  | {
      "salarié . contrat . salaire brut": number;
    }
  | {
      "salarié . rémunération . net . à payer avant impôt": number;
    };

function createSituationSalarieInput(
  input: SalarieInput,
): SituationSalarieInput {
  switch (true) {
    case isSalarieInputSalaireBrut(input):
      return {
        "salarié . contrat . salaire brut": input.salaireBrut,
      };
    case isSalarieInputRemunerationNetAvantImpot(input):
    default:
      return {
        "salarié . rémunération . net . à payer avant impôt":
          input.remunerationNetAvantImpot,
      };
  }
}

function getContratFromPosteContrat(salarie: AnyPoste) {
  switch (salarie.contrat) {
    case CONTRAT_POSTE.cdi.value:
      return "'CDI'";
    case CONTRAT_POSTE.cdd.value:
      return "'CDD'";
    case CONTRAT_POSTE.apprentissage.value:
      return "'apprentissage'";
    case CONTRAT_POSTE.professionnalisation.value:
      return "'professionnalisation'";
    case CONTRAT_POSTE.stage.value:
      return "'stage'";
  }
}

type SituationSalarie = SituationImpot &
  SituationSalarieInput & {
    "salarié . convention collective": "'droit commun'";
    dirigeant: "non";
    "salarié . activité partielle": "non";
    "salarié . contrat":
      | "'CDI'"
      | "'CDD'"
      | "'apprentissage'"
      | "'professionnalisation'"
      | "'stage'";
    "salarié . contrat . temps de travail . temps partiel": "non";
    "salarié . contrat . statut cadre": "non";
  };

function createSituationSalarie(
  foyer: Foyer,
  salarie: AnyPoste,
  input: SalarieInput,
): SituationSalarie {
  return {
    ...createSituationImpot(foyer),
    ...createSituationSalarieInput(input),
    "salarié . convention collective": "'droit commun'",
    dirigeant: "non",
    "salarié . activité partielle": "non",
    "salarié . contrat": getContratFromPosteContrat(salarie),
    "salarié . contrat . temps de travail . temps partiel": "non",
    "salarié . contrat . statut cadre": "non",
  };
}

export type SalarieOutput = RegimeGeneralOutput &
  Partial<{
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
    ...createSituationSalarie(foyer, salarie, input),
  });
  return (Object.entries(output) as Entries<typeof output>).reduce(
    (acc, [key]) => {
      switch (key) {
        case "coutTotalEmployer":
          return Object.assign(acc, {
            [key]: evaluateEngine(engine, "salarié . coût total employeur"),
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
      Filter<keyof Output, Filter<keyof Output, keyof SalarieOutput>>,
      number
    >,
  );
}
