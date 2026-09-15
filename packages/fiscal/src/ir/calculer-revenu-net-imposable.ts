import type { Foyer } from "@akimeo/modele/foyer/types";
import donneesReglementaires from "@akimeo/donnees-reglementaires";
import { IMPOSITION_RCM } from "@akimeo/modele/foyer/constants";
import { isFoyerCouple } from "@akimeo/modele/foyer/helpers";
import { ENVELOPPE_PLACEMENT } from "@akimeo/modele/placement/constants";
import { calculerContributionPlacement } from "@akimeo/modele/placement/helpers";
import { NATURE_REVENU } from "@akimeo/modele/revenu/constants";

import { dedupeRevenus } from "./dedupe-revenus";
import { getRevenus } from "./get-revenus";

function getPlacements(foyer: Foyer) {
  return [
    ...foyer.declarant1.placements,
    ...(isFoyerCouple(foyer) ? foyer.declarant2.placements : []),
  ];
}

function calculerRevenuBrutGlobal(foyer: Foyer) {
  return dedupeRevenus(getRevenus(foyer)).reduce((acc, revenu) => {
    switch (revenu.nature) {
      case NATURE_REVENU.salaire.value:
      case NATURE_REVENU.remuneration.value:
      case NATURE_REVENU.pensionRetraite.value:
      case NATURE_REVENU.autre.value: {
        const abattementForfaitaire = Math.min(
          donneesReglementaires.impot_revenu.calcul_revenus_imposables
            .deductions.abatpro.max,
          Math.max(
            donneesReglementaires.impot_revenu.calcul_revenus_imposables
              .deductions.abatpro.min,
            revenu.montantAnnuel *
              donneesReglementaires.impot_revenu.calcul_revenus_imposables
                .deductions.abatpro.taux,
          ),
        );
        const montantImposable = Math.max(
          0,
          revenu.montantAnnuel - abattementForfaitaire,
        );
        return acc + montantImposable;
      }
      case NATURE_REVENU.microBNC.value: {
        const montantImposable =
          revenu.montantAnnuel -
          revenu.montantAnnuel *
            donneesReglementaires.impot_revenu.calcul_revenus_imposables.rpns
              .micro.microentreprise.regime_micro_bnc.taux;
        return acc + montantImposable;
      }
      case NATURE_REVENU.microBICServices.value: {
        const montantImposable =
          revenu.montantAnnuel -
          revenu.montantAnnuel *
            donneesReglementaires.impot_revenu.calcul_revenus_imposables.rpns
              .micro.microentreprise.regime_micro_bic.services.taux;
        return acc + montantImposable;
      }
      case NATURE_REVENU.microBICMarchandises.value: {
        const montantImposable =
          revenu.montantAnnuel -
          revenu.montantAnnuel *
            donneesReglementaires.impot_revenu.calcul_revenus_imposables.rpns
              .micro.microentreprise.regime_micro_bic.marchandises.taux;
        return acc + montantImposable;
      }
      case NATURE_REVENU.microFoncier.value: {
        const montantImposable =
          revenu.montantAnnuel -
          revenu.montantAnnuel *
            donneesReglementaires.impot_revenu.calcul_revenus_imposables.rpns
              .micro.microfoncier.taux;
        return acc + montantImposable;
      }
      case NATURE_REVENU.foncier.value: {
        const montantImposable =
          revenu.montantAnnuel < 0
            ? -Math.min(
                Math.abs(revenu.montantAnnuel),
                donneesReglementaires.impot_revenu.calcul_revenus_imposables
                  .foncier_deduc.plafond,
              )
            : revenu.montantAnnuel;
        return acc + montantImposable;
      }
      case NATURE_REVENU.bnc.value:
      case NATURE_REVENU.bic.value:
        return acc + revenu.montantAnnuel;
      case NATURE_REVENU.rcm.value: {
        if (foyer.impositionRCM === IMPOSITION_RCM.bareme.value) {
          const montantImposable =
            revenu.montantAnnuel -
            revenu.montantAnnuel *
              donneesReglementaires.impot_revenu.calcul_revenus_imposables.rvcm
                .revenus_capitaux_mobiliers_dividendes.taux_abattement;
          return acc + montantImposable;
        }
        return acc;
      }
      default:
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Cas non géré : ${revenu.nature}`);
    }
  }, 0);
}

function calculerRevenuNetGlobal(foyer: Foyer) {
  const revenuBrutGlobal = calculerRevenuBrutGlobal(foyer);

  let revenuNetGlobal = revenuBrutGlobal;

  revenuNetGlobal -= getPlacements(foyer).reduce(
    (acc, placement) =>
      placement.enveloppe === ENVELOPPE_PLACEMENT.per.value
        ? acc + calculerContributionPlacement(placement).versements
        : acc,
    0,
  );

  return revenuNetGlobal;
}

export function calculerRevenuNetImposable(foyer: Foyer) {
  const revenuNetGlobal = calculerRevenuNetGlobal(foyer);
  const revenuNetImposable = revenuNetGlobal;

  return revenuNetImposable;
}
