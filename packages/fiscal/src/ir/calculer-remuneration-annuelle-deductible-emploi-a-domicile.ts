import type { EmploiADomicile, Foyer } from "@akimeo/modele";
import donneesReglementaires from "@akimeo/donnees-reglementaires";
import {
  TYPE_EMPLOI_A_DOMICILE,
  TYPE_EMPLOI_A_DOMICILE_OPTIONS,
} from "@akimeo/modele";

// https://simulateur-ir-ifi.impots.gouv.fr/calcul_impot/2025/aides/reductions.htm#DF
export function calculerRemunerationAnnuelleDeductibleEmploiADomicile(
  foyer: Foyer,
) {
  const emploisADomicileGroupes = foyer.emploisADomicile.reduce(
    (acc, emploiADomicile) =>
      Object.assign(acc, {
        [emploiADomicile.type]:
          acc[emploiADomicile.type] + emploiADomicile.remunerationAnnuelle,
      }),
    TYPE_EMPLOI_A_DOMICILE_OPTIONS.reduce(
      (acc, option) => Object.assign(acc, { [option.value]: 0 }),
      {},
    ) as Record<EmploiADomicile["type"], number>,
  );

  const remunerationAnnuelleMenageDeductible =
    emploisADomicileGroupes[TYPE_EMPLOI_A_DOMICILE.menage.value];
  const remunerationAnnuellePetitBricolageDeductible = Math.min(
    500,
    emploisADomicileGroupes[TYPE_EMPLOI_A_DOMICILE.petitBricolage.value],
  );
  const remunerationAnnuelleJardinageDeductible = Math.min(
    5000,
    emploisADomicileGroupes[TYPE_EMPLOI_A_DOMICILE.petitBricolage.value],
  );
  const remunerationAnnuelleInformatiqueDeductible = Math.min(
    3000,
    emploisADomicileGroupes[TYPE_EMPLOI_A_DOMICILE.petitBricolage.value],
  );

  const remunerationAnnuelleDeductible =
    remunerationAnnuelleMenageDeductible +
    remunerationAnnuellePetitBricolageDeductible +
    remunerationAnnuelleJardinageDeductible +
    remunerationAnnuelleInformatiqueDeductible;

  const plafond = Math.min(
    donneesReglementaires.impot_revenu.credits_impots.emploi_salarie_domicile
      .plafond +
      foyer.enfants.length *
        donneesReglementaires.impot_revenu.credits_impots
          .emploi_salarie_domicile.increment_plafond,
    donneesReglementaires.impot_revenu.credits_impots.emploi_salarie_domicile
      .plafond_maximum,
  );

  return Math.min(plafond, remunerationAnnuelleDeductible);
}
