import donneesReglementaires from "@akimeo/donnees-reglementaires";

export function calculerPrelevementsSociaux(montant: number) {
  return [
    donneesReglementaires.taxation_capital.prelevements_sociaux.csg.taux_global
      .produits_de_placement,
    donneesReglementaires.prelevements_sociaux.contributions_sociales.crds,
    donneesReglementaires.taxation_capital.prelevements_sociaux
      .prelevements_solidarite.produits_de_placement,
  ].reduce((acc, taux) => acc + montant * taux, 0);
}

export function calculerPFU(montant: number) {
  return (
    calculerPrelevementsSociaux(montant) +
    montant *
      donneesReglementaires.taxation_capital.prelevement_forfaitaire.partir_2018
        .taux_prelevement_forfaitaire_rev_capital_eligibles_pfu_interets_dividendes_etc
  );
}
