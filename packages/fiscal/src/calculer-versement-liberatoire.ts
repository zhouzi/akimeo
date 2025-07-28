import type { Foyer } from "@akimeo/modele";
import donneesReglementaires from "@akimeo/donnees-reglementaires";
import {
  isFoyerCouple,
  isNatureRevenuMicroEntreprise,
  NATURE_REVENU,
} from "@akimeo/modele";

import { dedupeRevenus } from "./calculer-ir-du";

export function calculerVersementLiberatoire(foyer: Foyer) {
  return dedupeRevenus([
    ...(foyer.declarant1.versementLiberatoire ? foyer.declarant1.revenus : []),
    ...(isFoyerCouple(foyer) && foyer.declarant2.versementLiberatoire
      ? foyer.declarant2.revenus
      : []),
  ]).reduce((acc, revenu) => {
    if (isNatureRevenuMicroEntreprise(revenu.nature)) {
      switch (revenu.nature) {
        case NATURE_REVENU.microBICMarchandises.value:
          return (
            acc +
            Math.round(
              revenu.montantAnnuel *
                donneesReglementaires.impot_revenu.calcul_revenus_imposables
                  .rpns.microsocial.vente,
            )
          );
        case NATURE_REVENU.microBICServices.value:
          return (
            acc +
            Math.round(
              revenu.montantAnnuel *
                donneesReglementaires.impot_revenu.calcul_revenus_imposables
                  .rpns.microsocial.servi,
            )
          );
        case NATURE_REVENU.microBNC.value:
          return (
            acc +
            Math.round(
              revenu.montantAnnuel *
                donneesReglementaires.impot_revenu.calcul_revenus_imposables
                  .rpns.microsocial.bnc,
            )
          );
      }
    }
    return acc;
  }, 0);
}
