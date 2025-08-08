export default {
  impot_revenu: {
    calcul_impot_revenu: {
      recouvrement: {
        /**
         * @description Montant minimum de mise en recouvrement de l'impôt sur le revenu (IR) avant l'imputation des crédits d'impôts
         * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_impot_revenu/recouvrement/min_avant_credits_impots.yaml Source}
         */
        min_avant_credits_impots: 61,
      },
      plaf_qf: {
        decote: {
          /**
           * @description Plafond de la décote de l'impôt sur le revenu (IR) pour les contribuables célibataires, divorcés ou veufs
           * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_impot_revenu/plaf_qf/decote/seuil_celib.yaml Source}
           */
          seuil_celib: 889,

          /**
           * @description Taux de la décote de l'impôt sur le revenu
           * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_impot_revenu/plaf_qf/decote/taux.yaml Source}
           */
          taux: 0.4525,

          /**
           * @description Plafond de la décote de l'impôt sur le revenu (IR) pour les contribuables en couple à imposition commune
           * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_impot_revenu/plaf_qf/decote/seuil_couple.yaml Source}
           */
          seuil_couple: 1470,
        },
        quotient_familial: {
          cas_general: {
            /**
             * @description Part supplémentaire de quotient familial (IR) pour le conjoint d'un couple marié ou pacsé
             * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_impot_revenu/plaf_qf/quotient_familial/cas_general/conj.yaml Source}
             */
            conj: 1,

            /**
             * @description Part supplémentaire de quotient familial (IR) pour le premier enfant à charge
             * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_impot_revenu/plaf_qf/quotient_familial/cas_general/enf1.yaml Source}
             */
            enf1: 0.5,

            /**
             * @description Part supplémentaire de quotient familial (IR) pour le deuxième enfant à charge
             * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_impot_revenu/plaf_qf/quotient_familial/cas_general/enf2.yaml Source}
             */
            enf2: 0.5,

            /**
             * @description Part supplémentaire de quotient familial (IR) à partir du troisième enfant à charge inclus
             * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_impot_revenu/plaf_qf/quotient_familial/cas_general/enf3_et_sup.yaml Source}
             */
            enf3_et_sup: 1,

            /**
             * @description Part supplémentaire de quotient familial (IR) pour une personne veuve ayant des personnes à charge
             * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_impot_revenu/plaf_qf/quotient_familial/cas_general/veuf.yaml Source}
             */
            veuf: 1,
          },
        },
        plafond_avantages_procures_par_demi_part: {
          /**
           * @description Plafond de l'avantage en impôt par demi-part supplémentaire attribuée en raison d'une personne à charge (cas général)
           * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_impot_revenu/plaf_qf/plafond_avantages_procures_par_demi_part/general.yaml Source}
           */
          general: 1791,

          /**
           * @description Réduction d'impôt complémentaire pour les veufs ayant des enfants à charge, si le plafond général de leur demi-part supplémentaire a été atteint.
           * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_impot_revenu/plaf_qf/plafond_avantages_procures_par_demi_part/reduc_postplafond_veuf.yaml Source}
           */
          reduc_postplafond_veuf: 1993,
        },
      },
      pv: {
        pea: {
          /**
           * @description Plafond des versements sur le PEA
           * {@link https://www.service-public.fr/particuliers/vosdroits/F2385 Source}
           */
          plafond: 150000,
        },
      },
    },
    calcul_reductions_impots: {
      enfants_scolarises: {
        /**
         * @description Montant de la réduction d'impôts sur le revenu (IR) par enfant à charge suivant une formation d'enseignement supérieur (case 7EF)
         * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_reductions_impots/enfants_scolarises/universite.yaml Source}
         */
        universite: 183,

        /**
         * @description Montant de la réduction d'impôts sur le revenu (IR) par enfant à charge fréquentant un lycée d'enseignement général et technologique ou un lycée professionnel (case 7EC)
         * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_reductions_impots/enfants_scolarises/lycee.yaml Source}
         */
        lycee: 153,

        /**
         * @description Montant de la réduction d'impôts sur le revenu (IR) par enfant à charge fréquentant un collège (case 7EA)
         * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_reductions_impots/enfants_scolarises/college.yaml Source}
         */
        college: 61,
      },
      dons: {
        dons_coluche: {
          /**
           * @description Plafond des versements ouvrant droit à la réduction d'impôt sur le revenu (IR) au titre des dons faits aux organismes d'aide aux personnes en difficulté ("Dons Coluche")
           * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_reductions_impots/dons/dons_coluche/plafond.yaml Source}
           */
          plafond: 1000,

          /**
           * @description Taux de la réduction d'impôt sur le revenu (IR) au titre des dons faits aux organismes d'aide aux personnes en difficulté ("Dons Coluche")
           * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_reductions_impots/dons/dons_coluche/taux.yaml Source}
           */
          taux: 0.75,
        },
        dons_aux_partis_politiques: {
          /**
           * @description Plafond individuel des dons consentis aux partis politiques
           * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_reductions_impots/dons/dons_aux_partis_politiques/plafond_seul.yaml Source}
           */
          plafond_seul: 7500,

          /**
           * @description Plafond par foyer fiscal des dons et cotisations versés pour le financement des partis et groupements politiques
           * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_reductions_impots/dons/dons_aux_partis_politiques/plafond_foyer.yaml Source}
           */
          plafond_foyer: 15000,
        },

        /**
         * @description Taux général de réduction d'impôt sur le revenu (IR) appliqué aux dons
         * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_reductions_impots/dons/taux_reduction.yaml Source}
         */
        taux_reduction: 0.66,

        /**
         * @description Plafond (en % du revenu imposable) des dons pris en compte pour la réduction d'impôt sur le revenu (IR)
         * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_reductions_impots/dons/plafond_dons.yaml Source}
         */
        plafond_dons: 0.2,
      },
    },
    calcul_revenus_imposables: {
      deductions: {
        abatpro: {
          /**
           * @description Montant maximum de la déduction forfaitaire pour frais professionnels
           * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_revenus_imposables/deductions/abatpro/max.yaml Source}
           */
          max: 14426,

          /**
           * @description Montant minimum (Cas général) de la déduction forfaitaire pour frais professionnels
           * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_revenus_imposables/deductions/abatpro/min.yaml Source}
           */
          min: 504,

          /**
           * @description Taux de l'abattement forfaitaire sur les salaires pour frais professionels
           * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_revenus_imposables/deductions/abatpro/taux.yaml Source}
           */
          taux: 0.1,
        },
      },
      rpns: {
        micro: {
          microentreprise: {
            regime_micro_bnc: {
              /**
               * @description Taux de l'abattement pour le régime micro BNC
               * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_revenus_imposables/rpns/micro/microentreprise/regime_micro_bnc/taux.yaml Source}
               */
              taux: 0.34,
            },
            regime_micro_bic: {
              marchandises: {
                /**
                 * @description Taux (pour les ventes de marchandises) de l'abattement sur recettes des microentreprises
                 * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_revenus_imposables/rpns/micro/microentreprise/regime_micro_bic/marchandises/taux.yaml Source}
                 */
                taux: 0.71,
              },
              services: {
                /**
                 * @description Taux (pour les prestations de services) de l'abattement sur recettes des microentreprises
                 * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_revenus_imposables/rpns/micro/microentreprise/regime_micro_bic/services/taux.yaml Source}
                 */
                taux: 0.5,
              },
            },
          },
          microfoncier: {
            /**
             * @description Taux de l'abattement pour le régime microfoncier
             * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_revenus_imposables/rpns/micro/microfoncier/taux.yaml Source}
             */
            taux: 0.3,
          },
        },
        microsocial: {
          /**
           * @description Taux du versement libératoire pour les activités de prestations et de services (régime auto-entrepreneur/micro-social)
           * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_revenus_imposables/rpns/microsocial/servi.yaml Source}
           */
          servi: 0.017,

          /**
           * @description Taux du versement libératoire pour les activités de ventes (régime auto-entrepreneur/micro-social)
           * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_revenus_imposables/rpns/microsocial/vente.yaml Source}
           */
          vente: 0.01,

          /**
           * @description Taux du versement libératoire pour les professions libérales relevant du RSI/CIPAV (bnc, régime auto-entrepreneur/micro-social)
           * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_revenus_imposables/rpns/microsocial/bnc.yaml Source}
           */
          bnc: 0.022,
        },
      },
      foncier_deduc: {
        /**
         * @description Plafond des déficits fonciers déductibles du revenu global
         * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_revenus_imposables/foncier_deduc/plafond.yaml Source}
         */
        plafond: 10700,
      },
      rvcm: {
        revenus_capitaux_mobiliers_dividendes: {
          /**
           * @description Taux de l'abattement sur les revenus de capitaux mobiliers (dividendes), uniquement en cas de choix d'imposition au barème de l'impôt sur le revenu.
           * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/calcul_revenus_imposables/rvcm/revenus_capitaux_mobiliers_dividendes/taux_abattement.yaml Source}
           */
          taux_abattement: 0.4,
        },
      },
    },
    bareme_ir_depuis_1945: {
      /**
       * @description Barème progressif (marginal) de l'impôt sur le revenu applicable aux revenus des années indiquées
       * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/bareme_ir_depuis_1945/bareme.yaml Source}
       */
      bareme: [
        {
          threshold: 0,
          rate: 0,
        },
        {
          threshold: 11497,
          rate: 0.11,
        },
        {
          threshold: 29315,
          rate: 0.3,
        },
        {
          threshold: 83823,
          rate: 0.41,
        },
        {
          threshold: 180294,
          rate: 0.45,
        },
      ],
    },
    credits_impots: {
      emploi_salarie_domicile: {
        /**
         * @description Taux du crédit d'impôt sur le revenu (IR) pour emploi d'un salarié à domicile
         * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/credits_impots/emploi_salarie_domicile/taux.yaml Source}
         */
        taux: 0.5,

        /**
         * @description Plafond des dépenses, avant majorations, prises en compte pour le calcul du crédit d'impôt sur le revenu (IR) pour emploi d'un salarié à domicile
         * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/credits_impots/emploi_salarie_domicile/plafond.yaml Source}
         */
        plafond: 12000,

        /**
         * @description Majoration du plafond des dépenses prises en compte pour le calcul du crédit d'impôt sur le revenu (IR) pour emploi d'un salarié à domicile, par enfant à charge, par membre du foyer fiscal de plus de 65 ans et par ascendant âgé de plus de 65 ans remplissant les conditions pour bénéficier de l'APA lorsque les dépenses sont engagées à son domicile
         * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/credits_impots/emploi_salarie_domicile/increment_plafond.yaml Source}
         */
        increment_plafond: 1500,

        /**
         * @description Plafond des dépenses, après majorations pour enfants à charge et personne de plus de 65 ans, prises en compte pour le calcul du crédit d'impôt sur le revenu (IR) pour emploi d'un salarié à domicile
         * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/credits_impots/emploi_salarie_domicile/plafond_maximum.yaml Source}
         */
        plafond_maximum: 15000,
      },
      gardenf: {
        /**
         * @description Taux du crédit d'impôt pour frais de garde d'enfants à charge âgés de moins de six ans
         * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/credits_impots/gardenf/taux.yaml Source}
         */
        taux: 0.5,

        /**
         * @description Plafond des dépenses effectivement supportées pour la garde des enfants âgés de moins de six ans qu'ils ont à leur charge pour le calcul du crédit d’impôt
         * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/impot_revenu/credits_impots/gardenf/plafond.yaml Source}
         */
        plafond: 3500,
      },
    },
  },
  taxation_capital: {
    prelevement_forfaitaire: {
      partir_2018: {
        /**
         * @description Taux, au titre de l'impôt sur le revenu, du prélèvement forfaitaire unique (PFU) prélevé sur les revenus des valeurs mobilières
         * {@link https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/taxation_capital/prelevement_forfaitaire/partir_2018/taux_prelevement_forfaitaire_rev_capital_eligibles_pfu_interets_dividendes_etc.yaml Source}
         */
        taux_prelevement_forfaitaire_rev_capital_eligibles_pfu_interets_dividendes_etc: 0.128,
      },
    },
  },
} as const;
