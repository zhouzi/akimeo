import type { Foyer } from "@akimeo/modele";
import donneesReglementaires from "@akimeo/donnees-reglementaires";
import { isFoyerCouple, SITUATION_FAMILIALE } from "@akimeo/modele";

export function calculerPartsFiscales(foyer: Foyer) {
  let parts =
    donneesReglementaires.impot_revenu.calcul_impot_revenu.plaf_qf
      .quotient_familial.cas_general.conj;

  if (isFoyerCouple(foyer)) {
    parts +=
      donneesReglementaires.impot_revenu.calcul_impot_revenu.plaf_qf
        .quotient_familial.cas_general.conj;
  }

  for (let i = 0; i < foyer.enfants.length; i++) {
    if (i === 0) {
      parts +=
        donneesReglementaires.impot_revenu.calcul_impot_revenu.plaf_qf
          .quotient_familial.cas_general.enf1;

      if (foyer.situationFamiliale === SITUATION_FAMILIALE.veuf.value) {
        parts +=
          donneesReglementaires.impot_revenu.calcul_impot_revenu.plaf_qf
            .quotient_familial.cas_general.veuf;
      }
    }

    if (i === 1) {
      parts +=
        donneesReglementaires.impot_revenu.calcul_impot_revenu.plaf_qf
          .quotient_familial.cas_general.enf2;
    }

    if (i > 1) {
      parts +=
        donneesReglementaires.impot_revenu.calcul_impot_revenu.plaf_qf
          .quotient_familial.cas_general.enf3_et_sup;
    }
  }

  return parts;
}
