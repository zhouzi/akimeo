import type { Foyer } from "@akimeo/modele/foyer/types";
import donneesReglementaires from "@akimeo/donnees-reglementaires";
import { calculerRevenuNetImposable } from "@akimeo/fiscal/ir/calculer-revenu-net-imposable";
import { isFoyerCouple, SITUATION_FAMILIALE } from "@akimeo/modele";

export interface SituationImpot {
  "impôt . méthode de calcul": "'barème standard'";
  "impôt . foyer fiscal . enfants à charge": number;
  "impôt . foyer fiscal . situation de famille":
    | "'célibataire'"
    | "'couple'"
    | "'veuf'";
  "impôt . foyer fiscal . revenu imposable . autres revenus imposables": number;
}

export function createSituationImpot(foyer: Foyer): SituationImpot {
  return {
    "impôt . méthode de calcul": "'barème standard'",
    "impôt . foyer fiscal . enfants à charge": foyer.enfants.length,
    "impôt . foyer fiscal . situation de famille": isFoyerCouple(foyer)
      ? "'couple'"
      : foyer.situationFamiliale === SITUATION_FAMILIALE.veuf.value
        ? "'veuf'"
        : "'célibataire'",
    "impôt . foyer fiscal . revenu imposable . autres revenus imposables":
      calculerRevenuNetImposable(foyer) /
      (1 -
        donneesReglementaires.impot_revenu.calcul_revenus_imposables.deductions
          .abatpro.taux),
  };
}
