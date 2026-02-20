import donneesReglementaires from "@akimeo/donnees-reglementaires";

const BAREME_IS = [
  {
    threshold: 0,
    rate: donneesReglementaires.taxation_societes.impot_societe.taux_reduit,
  },
  {
    threshold:
      donneesReglementaires.taxation_societes.impot_societe
        .seuil_superieur_benefices_taux_reduit,
    rate: donneesReglementaires.taxation_societes.impot_societe.taux_normal,
  },
];

export function computeIS(benefice: number) {
  return BAREME_IS.map((tranche, index, tranches) => {
    const trancheSuivante = tranches[index + 1];

    const min = tranche.threshold;
    const max = trancheSuivante?.threshold ?? Infinity;

    const montantImposableMax = max - min;
    const beneficeImposableRestant = Math.max(0, benefice - min);

    const montantImpose = Math.min(
      beneficeImposableRestant,
      montantImposableMax,
    );

    const impot = montantImpose * tranche.rate;

    return {
      ...tranche,
      montantImpose,
      montantImposableMax,
      impot,
    };
  });
}
