import type { Foyer } from "@akimeo/modele/foyer/types";
import { calculerRevenuNetImposable } from "@akimeo/fiscal/ir/calculer-revenu-net-imposable";
import { SITUATION_FAMILIALE } from "@akimeo/modele/foyer/constants";
import { isFoyerCouple } from "@akimeo/modele/foyer/helpers";

export function createSituationImpot(foyer: Foyer) {
  return {
    "impôt . méthode de calcul": "'barème standard'",
    "impôt . foyer fiscal . enfants à charge": foyer.enfants.length,
    "impôt . foyer fiscal . situation de famille": isFoyerCouple(foyer)
      ? "'couple'"
      : foyer.situationFamiliale === SITUATION_FAMILIALE.veuf.value
        ? "'veuf'"
        : "'célibataire'",
    "impôt . foyer fiscal . revenu imposable . autres revenus imposables":
      calculerRevenuNetImposable(foyer),
  };
}
