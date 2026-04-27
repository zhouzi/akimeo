import type { Foyer } from "@akimeo/modele";
import type { EI, Sarl } from "@akimeo/modele/entreprise/types";
import { calculerRevenuNetImposable } from "@akimeo/fiscal/ir/calculer-revenu-net-imposable";
import { isFoyerCouple, SITUATION_FAMILIALE } from "@akimeo/modele";
import { NATURE_ACTIVITE_ENTREPRISE } from "@akimeo/modele/entreprise/constants";

type SituationActivite =
  | {
      "entreprise . activité": "'artisanale'";
    }
  | {
      "entreprise . activité": "'commerciale'";
    }
  | {
      "entreprise . activité": "'libérale'";
      "entreprise . activité . libérale . réglementée": "oui" | "non";
    };

function createSituationActivite(entreprise: EI | Sarl): SituationActivite {
  switch (entreprise.natureActivite) {
    case NATURE_ACTIVITE_ENTREPRISE.artisanale.value:
      return {
        "entreprise . activité": "'artisanale'",
      };
    case NATURE_ACTIVITE_ENTREPRISE.commerciale.value:
      return {
        "entreprise . activité": "'commerciale'",
      };
    case NATURE_ACTIVITE_ENTREPRISE.liberale.value:
      return {
        "entreprise . activité": "'libérale'",
        "entreprise . activité . libérale . réglementée": "non",
      };
  }
}

type SituationInput =
  | {
      "entreprise . chiffre d'affaires": number;
    }
  | {
      "indépendant . rémunération . nette": number;
    };

function createSituationInput(input: TIInput): SituationInput {
  switch (true) {
    case "chiffreAffaires" in input:
      return {
        "entreprise . chiffre d'affaires": input.chiffreAffaires,
      };
    case "remunerationNetteAvantImpot" in input:
    default:
      return {
        "indépendant . rémunération . nette": input.remunerationNetteAvantImpot,
      };
  }
}

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

export type TIInput =
  | {
      chiffreAffaires: number;
    }
  | {
      remunerationNetteAvantImpot: number;
    };

export function createSituationTI(
  foyer: Foyer,
  entreprise: EI | Sarl,
  input: TIInput,
) {
  return {
    ...createSituationActivite(entreprise),
    ...createSituationInput(input),
    ...createSituationImpot(foyer),
    "entreprise . date de création": `01/01/${new Date().getFullYear()}`,
    "entreprise . imposition . IR . régime micro-fiscal": "non",
    "entreprise . activité . saisonnière": "non",
    "indépendant . conjoint collaborateur": "non",
    "indépendant . cotisations et contributions . cotisations . exonérations . Acre":
      entreprise.acre ? "oui" : "non",
    "indépendant . cotisations et contributions . cotisations . exonérations . invalidité":
      "non",
    "indépendant . cotisations et contributions . cotisations facultatives":
      "non",
    "indépendant . revenus de remplacement": "non",
    "indépendant . revenus étrangers": "non",
    "situation personnelle . domiciliation fiscale à l'étranger": "non",
    "situation personnelle . RSA": "non",
  };
}
