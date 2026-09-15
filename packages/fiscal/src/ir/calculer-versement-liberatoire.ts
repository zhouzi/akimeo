import type { Foyer } from "@akimeo/modele/foyer/types";
import donneesReglementaires from "@akimeo/donnees-reglementaires";
import { isFoyerCouple } from "@akimeo/modele/foyer/helpers";
import { NATURE_REVENU } from "@akimeo/modele/revenu/constants";
import { isNatureRevenuMicroEntreprise } from "@akimeo/modele/revenu/helpers";

import { dedupeRevenus } from "./dedupe-revenus";

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
