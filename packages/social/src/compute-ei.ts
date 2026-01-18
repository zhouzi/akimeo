import type { TNSOutput } from "@akimeo/social/compute-tns";
import type { SituationAcre } from "@akimeo/social/create-situation-acre";
import type { SituationImpot } from "@akimeo/social/create-situation-impot";
import type Engine from "publicodes";
import type { Entries } from "type-fest";
import type { Filter } from "type-fest/source/except";
import { calculerIR } from "@akimeo/fiscal";
import { Foyer, NATURE_REVENU } from "@akimeo/modele";
import { NATURE_ACTIVITE_ENTREPRISE } from "@akimeo/modele/entreprise/constants";
import { EI } from "@akimeo/modele/entreprise/types";
import { computeTNS } from "@akimeo/social/compute-tns";
import { createSituationAcre } from "@akimeo/social/create-situation-acre";
import { createSituationImpot } from "@akimeo/social/create-situation-impot";
import { evaluateEngine } from "@akimeo/social/evaluate-engine";
import { setEngineSituation } from "@akimeo/social/set-engine-situation";

type SituationActivite =
  | {
      "entreprise . activité . nature": "'libérale'";
      "entreprise . activité . nature . libérale . réglementée": "oui" | "non";
    }
  | {
      "entreprise . activité . nature": "'commerciale'";
    }
  | {
      "entreprise . activité . nature": "'artisanale'";
    };

function createSituationActivite(ei: EI): SituationActivite {
  switch (ei.natureActivite) {
    case NATURE_ACTIVITE_ENTREPRISE.liberale.value:
      return {
        "entreprise . activité . nature": "'libérale'",
        "entreprise . activité . nature . libérale . réglementée": "non",
      };
    case NATURE_ACTIVITE_ENTREPRISE.commerciale.value:
      return {
        "entreprise . activité . nature": "'commerciale'",
      };
    case NATURE_ACTIVITE_ENTREPRISE.artisanale.value:
      return {
        "entreprise . activité . nature": "'artisanale'",
      };
  }
}

interface EIInputChiffreAffaires {
  chiffreAffaires: number;
}
function isEIInputChiffreAffaires(
  input: EIInput,
): input is EIInputChiffreAffaires {
  return typeof (input as EIInputChiffreAffaires).chiffreAffaires === "number";
}

interface EIInputRemunerationNetAvantImpot {
  remunerationNetAvantImpot: number;
}
function isEIInputRemunerationNetAvantImpot(
  input: EIInput,
): input is EIInputRemunerationNetAvantImpot {
  return (
    typeof (input as EIInputRemunerationNetAvantImpot)
      .remunerationNetAvantImpot === "number"
  );
}

type EIInput = EIInputChiffreAffaires | EIInputRemunerationNetAvantImpot;

type SituationEIInput =
  | {
      "entreprise . chiffre d'affaires": number;
    }
  | {
      "dirigeant . rémunération . net": number;
    };

function createSituationEIInput(input: EIInput): SituationEIInput {
  switch (true) {
    case isEIInputChiffreAffaires(input):
      return {
        "entreprise . chiffre d'affaires": input.chiffreAffaires,
      };
    case isEIInputRemunerationNetAvantImpot(input):
    default:
      return {
        "dirigeant . rémunération . net": input.remunerationNetAvantImpot,
      };
  }
}

type SituationEI = SituationImpot &
  SituationActivite &
  SituationAcre &
  SituationEIInput & {
    "entreprise . catégorie juridique": "'EI'";
    "entreprise . imposition . régime . micro-entreprise": "non";
    "entreprise . catégorie juridique . EI . auto-entrepreneur": "non";
    "entreprise . date de création": string;
  };

function createSituationEI(foyer: Foyer, ei: EI, input: EIInput): SituationEI {
  return {
    ...createSituationImpot(foyer),
    ...createSituationActivite(ei),
    ...createSituationAcre(ei),
    ...createSituationEIInput(input),
    "entreprise . catégorie juridique": "'EI'",
    "entreprise . imposition . régime . micro-entreprise": "non",
    "entreprise . catégorie juridique . EI . auto-entrepreneur": "non",
    "entreprise . date de création": `01/01/${new Date().getFullYear()}`,
  };
}

function getNatureRevenuFromNatureActivite(ei: EI) {
  switch (ei.natureActivite) {
    case NATURE_ACTIVITE_ENTREPRISE.artisanale.value:
    case NATURE_ACTIVITE_ENTREPRISE.commerciale.value:
      return NATURE_REVENU.bic.value;

    case NATURE_ACTIVITE_ENTREPRISE.liberale.value:
    default:
      return NATURE_REVENU.bnc.value;
  }
}

type EIOutput = TNSOutput &
  Partial<{
    cotisations: true;
    ir: true;
  }>;

export function computeEI<Output extends EIOutput>(
  engine: Engine,
  foyer: Foyer,
  ei: EI,
  input: EIInput,
  output: Output,
) {
  setEngineSituation(engine, {
    ...createSituationEI(foyer, ei, input),
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
                    nature: getNatureRevenuFromNatureActivite(ei),
                    montantAnnuel: evaluateEngine(
                      engine,
                      "dirigeant . indépendant . revenu professionnel",
                    ),
                  },
                ],
              },
            }),
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
      Filter<keyof Output, Filter<keyof Output, keyof EIOutput>>,
      number
    >,
  );
}
