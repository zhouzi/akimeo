import type { Foyer } from "@akimeo/modele";
import type { SAS } from "@akimeo/modele/entreprise/types";
import { calculerRevenuNetImposable } from "@akimeo/fiscal/ir/calculer-revenu-net-imposable";
import { isFoyerCouple, SITUATION_FAMILIALE } from "@akimeo/modele";

function createSituationImpot(foyer: Foyer) {
  return {
    "impôt . méthode de calcul": "'barème standard'",
    "impôt . foyer fiscal . enfants à charge": `${foyer.enfants.length} enfant`,
    "impôt . foyer fiscal . situation de famille": isFoyerCouple(foyer)
      ? "'couple'"
      : foyer.situationFamiliale === SITUATION_FAMILIALE.veuf.value
        ? "'veuf'"
        : "'célibataire'",
    "impôt . foyer fiscal . autres revenus imposables":
      calculerRevenuNetImposable(foyer),
  };
}

type SituationInput =
  | {
      "assimilé salarié . rémunération . totale": number;
    }
  | {
      "assimilé salarié . rémunération . nette . à payer avant impôt": number;
    };

function createSituationInput(input: ASInput): SituationInput {
  switch (true) {
    case "remunerationTotale" in input:
      return {
        "assimilé salarié . rémunération . totale": input.remunerationTotale,
      };
    case "remunerationNetteAvantImpot" in input:
    default:
      return {
        "assimilé salarié . rémunération . nette . à payer avant impôt":
          input.remunerationNetteAvantImpot,
      };
  }
}

export type ASInput =
  | {
      remunerationTotale: number;
    }
  | {
      remunerationNetteAvantImpot: number;
    };

export function createSituationAS(
  foyer: Foyer,
  entreprise: SAS,
  input: ASInput,
) {
  return {
    ...createSituationImpot(foyer),
    ...createSituationInput(input),
    "entreprise . date de création": `01/01/${new Date().getFullYear()}`,
    "assimilé salarié . exonérations . Acre": entreprise.acre ? "oui" : "non",
  };
}
