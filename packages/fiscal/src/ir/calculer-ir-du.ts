import type { Foyer, Revenu } from "@akimeo/modele";
import donneesReglementaires from "@akimeo/donnees-reglementaires";
import {
  IMPOSITION_RCM,
  isFoyerCouple,
  isNatureRevenuMicroEntreprise,
  NATURE_DON,
  NATURE_REVENU,
  SCOLARTIE_ENFANT,
  SITUATION_FAMILIALE,
} from "@akimeo/modele";
import { differenceInYears } from "date-fns/differenceInYears";

import { calculerPartsFiscales } from "./calculer-parts-fiscales";
import { calculerRemunerationAnnuelleDeductibleEmploiADomicile } from "./calculer-remuneration-annuelle-deductible-emploi-a-domicile";
import { calculerRevenuNetImposable } from "./calculer-revenu-net-imposable";
import { dedupeRevenus } from "./dedupe-revenus";
import { getRevenus } from "./get-revenus";
import { trancherRevenus } from "./trancher-revenus";

function calculerImpotBrut(foyer: Foyer, qf: boolean) {
  return trancherRevenus(foyer, qf).reduce(
    (acc, tranche) => acc + tranche.impotBrut,
    0,
  );
}

function withoutRevenusMicroEntreprise(revenus: Revenu[]) {
  return revenus.filter(
    (revenu) => !isNatureRevenuMicroEntreprise(revenu.nature),
  );
}

function getDons(foyer: Foyer) {
  return [
    ...foyer.declarant1.dons,
    ...(isFoyerCouple(foyer) ? foyer.declarant2.dons : []),
  ];
}

function calculerImpotDu(foyer: Foyer, qf: boolean) {
  const impotBrut = calculerImpotBrut(foyer, qf);
  const revenuNetImposable = Math.max(0, calculerRevenuNetImposable(foyer));
  const taux = revenuNetImposable > 0 ? impotBrut / revenuNetImposable : 0;
  const foyerWithoutVersementLiberatoire: Foyer = isFoyerCouple(foyer)
    ? {
        ...foyer,
        declarant1: {
          ...foyer.declarant1,
          revenus: foyer.declarant1.versementLiberatoire
            ? withoutRevenusMicroEntreprise(foyer.declarant1.revenus)
            : foyer.declarant1.revenus,
        },
        declarant2: {
          ...foyer.declarant2,
          revenus: foyer.declarant2.versementLiberatoire
            ? withoutRevenusMicroEntreprise(foyer.declarant2.revenus)
            : foyer.declarant2.revenus,
        },
      }
    : {
        ...foyer,
        declarant1: {
          ...foyer.declarant1,
          revenus: foyer.declarant1.versementLiberatoire
            ? withoutRevenusMicroEntreprise(foyer.declarant1.revenus)
            : foyer.declarant1.revenus,
        },
      };
  const revenuNetImposableSansRevenusImposes = calculerRevenuNetImposable(
    foyerWithoutVersementLiberatoire,
  );

  let impotDu = revenuNetImposableSansRevenusImposes * taux;

  if (foyer.impositionRCM === IMPOSITION_RCM.pfu.value) {
    const rcm = dedupeRevenus(getRevenus(foyer)).reduce(
      (acc, revenu) =>
        revenu.nature === NATURE_REVENU.rcm.value
          ? acc + revenu.montantAnnuel
          : acc,
      0,
    );
    impotDu +=
      rcm *
      donneesReglementaires.taxation_capital.prelevement_forfaitaire.partir_2018
        .taux_prelevement_forfaitaire_rev_capital_eligibles_pfu_interets_dividendes_etc;
  }

  if (
    impotDu > 0 &&
    impotDu <
      donneesReglementaires.impot_revenu.calcul_impot_revenu.recouvrement
        .min_avant_credits_impots
  ) {
    impotDu = 0;
  }

  if (isFoyerCouple(foyer)) {
    if (impotDu < 3249) {
      const décote =
        donneesReglementaires.impot_revenu.calcul_impot_revenu.plaf_qf.decote
          .seuil_couple -
        impotDu *
          donneesReglementaires.impot_revenu.calcul_impot_revenu.plaf_qf.decote
            .taux;
      impotDu = Math.max(0, impotDu - décote);
    }
  } else {
    if (impotDu < 1964) {
      const décote =
        donneesReglementaires.impot_revenu.calcul_impot_revenu.plaf_qf.decote
          .seuil_celib -
        impotDu *
          donneesReglementaires.impot_revenu.calcul_impot_revenu.plaf_qf.decote
            .taux;
      impotDu = Math.max(0, impotDu - décote);
    }
  }

  // Frais de garde
  // https://simulateur-ir-ifi.impots.gouv.fr/calcul_impot/2025/aides/reductions.htm#GA
  const fraisDeGardeDeductibles = foyer.enfants.reduce((acc, enfant) => {
    if (
      typeof enfant.fraisDeGarde === "number" &&
      differenceInYears(new Date(), enfant.dateNaissance) <= 6
    ) {
      return (
        acc +
        Math.min(
          enfant.fraisDeGarde,
          donneesReglementaires.impot_revenu.credits_impots.gardenf.plafond,
        )
      );
    }
    return acc;
  }, 0);
  impotDu -=
    fraisDeGardeDeductibles *
    donneesReglementaires.impot_revenu.credits_impots.gardenf.taux;

  // Dons
  // https://www.economie.gouv.fr/cedef/fiches-pratiques/les-reductions-dimpots-pour-les-dons-aux-associations
  // https://simulateur-ir-ifi.impots.gouv.fr/calcul_impot/2025/aides/reductions_s.htm#UF
  const sommesDons = getDons(foyer).reduce(
    (acc, don) => {
      switch (don.nature) {
        case NATURE_DON.partisPolitiques.value:
        case NATURE_DON.utilitePublique.value: {
          const plafond = isFoyerCouple(foyer)
            ? donneesReglementaires.impot_revenu.calcul_reductions_impots.dons
                .dons_aux_partis_politiques.plafond_foyer
            : donneesReglementaires.impot_revenu.calcul_reductions_impots.dons
                .dons_aux_partis_politiques.plafond_seul;
          const montantAnnuel = Math.min(
            plafond - acc.utilitePubliqueEtPartisPolitiques,
            don.montantAnnuel,
          );

          acc.utilitePubliqueEtPartisPolitiques += montantAnnuel;

          // L'excédent des dons qui dépassent le plafond sont automatiquement catégorisés comme "autres dons"
          acc.autresDons += don.montantAnnuel - montantAnnuel;
          break;
        }
        case NATURE_DON.personnesEnDifficulte.value: {
          const montantAnnuel = Math.min(
            donneesReglementaires.impot_revenu.calcul_reductions_impots.dons
              .dons_coluche.plafond - acc.personnesEnDifficulte,
            don.montantAnnuel,
          );

          acc.personnesEnDifficulte += montantAnnuel;

          // L'excédent des dons qui dépassent le plafond sont automatiquement catégorisés comme "autres dons"
          acc.autresDons += don.montantAnnuel - montantAnnuel;
          break;
        }
      }
      return acc;
    },
    {
      personnesEnDifficulte: 0,
      utilitePubliqueEtPartisPolitiques: 0,
      autresDons: 0,
    },
  );

  const donsPersonnesEnDifficulte = sommesDons.personnesEnDifficulte;
  const reductionDonsPersonnesEnDifficulte =
    donsPersonnesEnDifficulte *
    donneesReglementaires.impot_revenu.calcul_reductions_impots.dons
      .dons_coluche.taux;

  const plafondAutresDons =
    revenuNetImposable *
    donneesReglementaires.impot_revenu.calcul_reductions_impots.dons
      .plafond_dons;
  const autresDons = Math.min(
    plafondAutresDons,
    sommesDons.utilitePubliqueEtPartisPolitiques + sommesDons.autresDons,
  );

  const reductionAutresDons =
    autresDons *
    donneesReglementaires.impot_revenu.calcul_reductions_impots.dons
      .taux_reduction;

  const reductionDons =
    reductionDonsPersonnesEnDifficulte + reductionAutresDons;

  impotDu -= Math.min(reductionDons, Math.max(0, impotDu));

  // Emploi à domicile
  const remunerationAnnuelleDeductible =
    calculerRemunerationAnnuelleDeductibleEmploiADomicile(foyer);

  impotDu -=
    remunerationAnnuelleDeductible *
    donneesReglementaires.impot_revenu.credits_impots.emploi_salarie_domicile
      .taux;

  // Enfants scolarisés
  // https://www.service-public.fr/particuliers/vosdroits/F9/personnalisation/resultat?lang=&quest0=0&quest=
  const reductionEnfantsScolarises = foyer.enfants.reduce((acc, enfant) => {
    switch (enfant.scolarite) {
      case SCOLARTIE_ENFANT.collegien.value:
        return (
          acc +
          donneesReglementaires.impot_revenu.calcul_reductions_impots
            .enfants_scolarises.college
        );
      case SCOLARTIE_ENFANT.lyceen.value:
        return (
          acc +
          donneesReglementaires.impot_revenu.calcul_reductions_impots
            .enfants_scolarises.lycee
        );
      case SCOLARTIE_ENFANT.etudiant.value:
        return (
          acc +
          donneesReglementaires.impot_revenu.calcul_reductions_impots
            .enfants_scolarises.universite
        );
      case null:
        return acc;
    }
  }, 0);
  impotDu -= Math.min(reductionEnfantsScolarises, Math.max(0, impotDu));

  return impotDu;
}

export function calculerIRDu(foyer: Foyer) {
  const impotDu = calculerImpotDu(foyer, false);

  if (impotDu <= 0) {
    return Math.round(impotDu);
  }

  const impotDuSansEnfants = calculerImpotDu(foyer, true);

  const partsFiscalesAvecEnfants = calculerPartsFiscales(foyer);
  const partsFiscalesSansEnfants = calculerPartsFiscales({
    ...foyer,
    enfants: [],
  });
  const partsFiscalesEnfants =
    partsFiscalesAvecEnfants - partsFiscalesSansEnfants;

  const reductionParPart =
    donneesReglementaires.impot_revenu.calcul_impot_revenu.plaf_qf
      .plafond_avantages_procures_par_demi_part.general / 0.5;
  const reductionMax = reductionParPart * partsFiscalesEnfants;
  const impotDuMin = Math.max(0, impotDuSansEnfants - reductionMax);

  if (impotDuMin > impotDu) {
    let reductionSpeciale = 0;

    // https://www.impots.gouv.fr/sites/default/files/media/3_Documentation/depliants/nid_4001_gp_110.pdf#:~:text=Si%20vous%20%C3%AAtes%20veuf%20avec,1%20993%20%E2%82%AC%20est%20appliqu%C3%A9e.
    if (foyer.situationFamiliale === SITUATION_FAMILIALE.veuf.value) {
      reductionSpeciale +=
        donneesReglementaires.impot_revenu.calcul_impot_revenu.plaf_qf
          .plafond_avantages_procures_par_demi_part.reduc_postplafond_veuf;
    }

    const reductionSpecialeMax = Math.min(
      // https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051212954#:~:text=du%20pr%C3%A9sent%202.-,Cette%20r%C3%A9duction%20d%27imp%C3%B4t%20ne%20peut%20toutefois%20exc%C3%A9der%20l%27augmentation%20de%20la%20cotisation%20d%27imp%C3%B4t%20r%C3%A9sultant%20du%20plafonnement.,-3.%20Le%20montant
      impotDuMin - impotDu,
      Math.min(reductionSpeciale, impotDuMin),
    );

    return Math.round(impotDuMin - reductionSpecialeMax);
  }

  return Math.round(impotDu);
}
