import type { AnyEntreprise } from "@akimeo/modele/entreprise/types";

export type SituationAcre =
  | {
      "dirigeant . auto-entrepreneur . éligible à l'ACRE": "non";
    }
  | {
      "dirigeant . auto-entrepreneur . éligible à l'ACRE": "oui";
      "dirigeant . exonérations . ACRE": "oui" | "non";
    };

export function createSituationAcre(
  entreprise: Pick<AnyEntreprise, "acre">,
): SituationAcre {
  if (entreprise.acre) {
    return {
      "dirigeant . auto-entrepreneur . éligible à l'ACRE": "oui",
      "dirigeant . exonérations . ACRE": "oui",
    };
  }
  return {
    "dirigeant . auto-entrepreneur . éligible à l'ACRE": "non",
  };
}
