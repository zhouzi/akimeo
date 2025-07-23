import type { Foyer } from "@akimeo/modele";
import donneesReglementaires from "@akimeo/donnees-reglementaires";
import { isRevenuMicroEntreprise, NATURE_REVENU } from "@akimeo/modele";

import { dedupeRevenus, getRevenus } from "./calculer-ir";

export function calculerVersementLiberatoire(foyer: Foyer) {
  return dedupeRevenus(getRevenus(foyer)).reduce((acc, revenu) => {
    if (isRevenuMicroEntreprise(revenu) && revenu.versementLiberatoire) {
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
