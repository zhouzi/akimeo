const JOURS_PAR_MOIS = 30;
const JOURS_PAR_AN = JOURS_PAR_MOIS * 12;

export function computeAmortissementLineaire(
  dateDebut: Date,
  montant: number,
  dureeAnnees: number,
) {
  const montantDeduitAnnuellement = montant / dureeAnnees;

  const joursEcoulesPremiereAnnee =
    dateDebut.getMonth() * JOURS_PAR_MOIS +
    Math.max(Math.min(dateDebut.getDate() - 1, JOURS_PAR_MOIS), 0);
  const joursDutilisationPremiereAnnee =
    JOURS_PAR_AN - joursEcoulesPremiereAnnee;

  return Array.from({
    length:
      joursDutilisationPremiereAnnee < JOURS_PAR_AN
        ? dureeAnnees + 1
        : dureeAnnees,
  }).reduce<number[]>((acc, _, index) => {
    const montantDeduit = acc.reduce(
      (sum, precedentMontantDeduit) => sum + precedentMontantDeduit,
      0,
    );
    const montantRestant = montant - montantDeduit;

    const joursDutilisation =
      index === 0 ? joursDutilisationPremiereAnnee : JOURS_PAR_AN;

    acc.push(
      Math.min(
        (montantDeduitAnnuellement / JOURS_PAR_AN) * joursDutilisation,
        montantRestant,
      ),
    );

    return acc;
  }, []);
}
