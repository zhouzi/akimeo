import type { Foyer } from "@akimeo/modele";
import { calculerRevenuNetImposable } from "@akimeo/fiscal/ir/calculer-revenu-net-imposable";
import { isFoyerCouple, SITUATION_FAMILIALE } from "@akimeo/modele";

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
