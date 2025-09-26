import donneesReglementaires from "@akimeo/donnees-reglementaires";

export const PLAFOND_TAUX_REDUIT_IS =
  donneesReglementaires.taxation_societes.impot_societe
    .seuil_superieur_benefices_taux_reduit;

export const TAUX_REDUIT_IS =
  donneesReglementaires.taxation_societes.impot_societe.taux_reduit;

export const TAUX_NORMAL_IS =
  donneesReglementaires.taxation_societes.impot_societe.taux_normal;
