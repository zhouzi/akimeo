import donneesReglementaires from "@akimeo/donnees-reglementaires";

export const TAUX_TVA = {
  normal: {
    label: "Normal",
    value: donneesReglementaires.taxation_indirecte.tva.taux_normal,
  },
  intermediaire: {
    label: "Intermédiaire",
    value: donneesReglementaires.taxation_indirecte.tva.taux_intermediaire,
  },
  reduit: {
    label: "Réduit",
    value: donneesReglementaires.taxation_indirecte.tva.taux_reduit,
  },
  superReduit: {
    label: "Super réduit",
    value:
      donneesReglementaires.taxation_indirecte.tva
        .taux_particulier_super_reduit,
  },
  nonApplicable: {
    label: "Non applicable",
    value: 0,
  },
};
export const TAUX_TVA_OPTIONS = Object.values(TAUX_TVA);
