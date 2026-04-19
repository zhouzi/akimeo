import z from "zod";

export const aliasSchema = z
  .object({
    etatCivil: z
      .object({
        situationFamiliale: z.enum(["M", "O", "C", "D", "V"]),
        residence: z.enum(["M", "I", "G"]),
        anneeNaissance: z
          .object({
            declarant1: z.number(),
            declarant2: z.number(),
          })
          .partial(),
        parentIsole: z.boolean(),
        demiPartSupplementaire: z
          .object({
            celibDivorceSepVeuvage: z
              .object({
                vivaitSeulAvecEnfant: z.boolean(),
                neVivaitPasSeul: z.boolean(),
              })
              .partial(),
            invalidite: z
              .object({
                declarant: z.boolean(),
                conjoint: z.boolean(),
              })
              .partial(),
            combattantOuVictimeDeGuerre: z
              .object({
                celibataireDivorceVeuf: z.boolean(),
                mariePacse: z.boolean(),
                pensionVeuveDeGuerre: z.boolean(),
              })
              .partial(),
          })
          .partial(),
        personnesACharge: z
          .object({
            enfants: z
              .object({
                nombre: z.number(),
                anneesNaissance: z.array(z.number()).max(6),
              })
              .partial(),
            enfantsInvalides: z
              .object({
                nombre: z.number(),
                anneesNaissance: z.array(z.number()).max(3),
              })
              .partial(),
            invalidesRecueillies: z
              .object({
                nombre: z.number(),
                anneesNaissance: z.array(z.number()).max(3),
              })
              .partial(),
          })
          .partial(),
        residenceAlternee: z
          .object({
            enfants: z
              .object({
                nombre: z.number(),
                anneesNaissance: z.array(z.number()).max(6),
              })
              .partial(),
            enfantsInvalides: z
              .object({
                nombre: z.number(),
                anneesNaissance: z.array(z.number()).max(4),
              })
              .partial(),
          })
          .partial(),
        enfantsMajeursRattaches: z
          .object({
            celibatairesSansEnfant: z.number(),
            mariesPacsesChargeFamille: z.number(),
          })
          .partial(),
      })
      .partial(),
    revenus: z
      .object({
        traitementsSalaires: z
          .object({
            activite: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
            salariesParticuliersEmployeurs: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
            abattementAssMatJournalistes: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
            heuresSupExonerees: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
            pourboiresExoneres: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
            primePartageValeurExoneree: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
            majorationSeuilExoneration: z
              .object({
                declarant1: z.boolean(),
                declarant2: z.boolean(),
                pac1: z.boolean(),
                pac2: z.boolean(),
              })
              .partial(),
            autresRevenusImposables: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
            associesGerantsArt62: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
            droitsAuteurChercheurs: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
            salairesNonResidentsEtrangers: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
            autresSalairesSourceEtrangere: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
            fraisReels: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
          })
          .partial(),
        salairesExoneresTauxEffectif: z
          .object({
            totalSalaires: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
            marinsPecheurs: z
              .object({
                declarant1: z.boolean(),
                declarant2: z.boolean(),
                pac1: z.boolean(),
                pac2: z.boolean(),
              })
              .partial(),
            fraisReels: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
          })
          .partial(),
        finDePerceptionSalaires: z
          .object({
            declarant1: z.boolean(),
            declarant2: z.boolean(),
            pac1: z.boolean(),
            pac2: z.boolean(),
          })
          .partial(),
        pensionsRetraitesRentes: z
          .object({
            total: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
            retraiteCapitalTaxable7_5: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
            pensionsCapitalEpargneRetraite: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
            pensionsInvalidite: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
            pensionsAlimentaires: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
            pensionsNonResidentsEtrangers: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
            autresPensionsSourceEtrangere: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
            finDePerceptionPensions: z
              .object({
                declarant1: z.boolean(),
                declarant2: z.boolean(),
                pac1: z.boolean(),
                pac2: z.boolean(),
              })
              .partial(),
          })
          .partial(),
        pensionsExoneresTauxEffectif: z
          .object({
            total: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac1: z.number(),
                pac2: z.number(),
              })
              .partial(),
          })
          .partial(),
        rentesViageresOnereuses: z
          .object({
            casGeneral: z
              .object({
                moins50ans: z.number(),
                de50a59ans: z.number(),
                de60a69ans: z.number(),
                aPartirDe70ans: z.number(),
              })
              .partial(),
            nonResidentsSourceEtrangere: z
              .object({
                moins50ans: z.number(),
                de50a59ans: z.number(),
                de60a69ans: z.number(),
                aPartirDe70ans: z.number(),
              })
              .partial(),
          })
          .partial(),
        gainsOptionsExceptionnels: z
          .object({
            rabaisExcedentaire: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
              })
              .partial(),
            actionsGratuitesSalaires: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
              })
              .partial(),
            actionsGratuitesPostAbattement: z.number(),
            abattementDureeDetention: z.number(),
            abattement50: z.number(),
            abattementFixeDepartRetraite: z.number(),
            carriedInterest: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
              })
              .partial(),
            carriedInterestContribution30: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
              })
              .partial(),
            bspceGainExercice: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
              })
              .partial(),
            managementPackages: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
              })
              .partial(),
            indemnitePrejudiceMoral: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
              })
              .partial(),
            agentsGenerauxAssurance: z
              .object({
                salairesImposables: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                  })
                  .partial(),
                salairesExoneres: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                  })
                  .partial(),
              })
              .partial(),
            salariesImpatries: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
              })
              .partial(),
            exonereesCetRetraite: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
              })
              .partial(),
          })
          .partial(),
        exceptionnelsDifferes: z.number(),
        rcm: z
          .object({
            assuranceVie8ansPlus: z
              .object({
                avant270917: z
                  .object({
                    prelevementLiberatoire: z.number(),
                    autresProduits: z.number(),
                  })
                  .partial(),
                depuis270917: z
                  .object({
                    totalARepartir: z.number(),
                    imposables7_5: z.number(),
                    imposables12_8: z.number(),
                  })
                  .partial(),
              })
              .partial(),
            assuranceVieMoins8ans: z
              .object({
                avant270917: z
                  .object({
                    prelevementLiberatoire: z.number(),
                    autresProduits: z.number(),
                  })
                  .partial(),
                depuis270917: z.number(),
              })
              .partial(),
            avecAbattement: z
              .object({
                actionsParts: z.number(),
                dividendesTitresNonCotesPea: z.number(),
              })
              .partial(),
            sansAbattement: z
              .object({
                autresDistribues: z.number(),
                interetsRevenuFixe: z.number(),
                interetsPretsMinibons: z.number(),
                interetsObligationsPea: z.number(),
                perSortieCapital: z.number(),
                distribuesRegimePrivilegie: z.number(),
                pertesPretsMinibons: z
                  .object({
                    nMoins4: z.number(),
                    nMoins3: z.number(),
                    nMoins2: z.number(),
                    nMoins1: z.number(),
                    n: z.number(),
                  })
                  .partial(),
              })
              .partial(),
            autres: z
              .object({
                dejaPsSansCsgDeductible: z.number(),
                dejaPsAvecCsgDeductible: z.number(),
                autresDejaPsAvecCsgDeductible: z.number(),
                dejaSolidarite7_5: z.number(),
                solidariteASoumettreCsgCrds: z.number(),
                fraisDeductibles: z.number(),
                creditImpotEtranger: z.number(),
                pfnlVerse: z.number(),
                autresPrelevementLiberatoire: z.number(),
                deficitsAnterieurs: z
                  .object({
                    nMoins6: z.number(),
                    nMoins5: z.number(),
                    nMoins4: z.number(),
                    nMoins3: z.number(),
                    nMoins2: z.number(),
                    nMoins1: z.number(),
                  })
                  .partial(),
                impatriesAbattement50: z.number(),
              })
              .partial(),
            gainsCessionAssuranceVie: z
              .object({
                avant270917: z
                  .object({
                    prelevementLiberatoire: z.number(),
                    autresGains: z.number(),
                  })
                  .partial(),
                depuis270917: z
                  .object({
                    imposables7_5: z.number(),
                    imposables12_8: z.number(),
                  })
                  .partial(),
                moinsValues: z
                  .object({
                    nMoins4: z.number(),
                    nMoins3: z.number(),
                    nMoins2: z.number(),
                    nMoins1: z.number(),
                    n: z.number(),
                  })
                  .partial(),
              })
              .partial(),
            optionBareme: z.boolean(),
          })
          .partial(),
        plusValues: z
          .object({
            cessionValeursMobilieres: z
              .object({
                pvSansAbattement: z.number(),
                abattementDroitCommun: z.number(),
                moinsValue: z.number(),
              })
              .partial(),
            gainsLeveeOptionsAvant280912: z
              .object({
                taxable18: z.number(),
                taxable30: z.number(),
                taxable41: z.number(),
                optionSalaires: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                  })
                  .partial(),
                contributionSalariale10: z.number(),
              })
              .partial(),
            gainPeac: z.number(),
            bspceAvant2025: z
              .object({
                activite3ansPlus: z
                  .object({
                    attribuesAvant010118: z.number(),
                    attribuesDepuis010118: z.number(),
                    abattementRetraite: z.number(),
                  })
                  .partial(),
                activiteMoins3ans: z.number(),
              })
              .partial(),
            bspceDepuis2025: z
              .object({
                gainAvantAbattement: z.number(),
                abattementRetraite: z.number(),
              })
              .partial(),
            avantageSalarialBspceDepuis2025: z
              .object({
                moinsde3ansTaxable12_8: z.number(),
                moinsde3ansTaxable30: z.number(),
              })
              .partial(),
            gainPeaAvant5ans: z.number(),
            profitsInstrumentsFinanciers50: z.number(),
            pvAbattementRenforceRetraite: z
              .object({
                pvAvantAbattement: z.number(),
                abattementRenforce: z.number(),
                abattementFixe: z.number(),
              })
              .partial(),
            impatriesTitresEtranger: z
              .object({
                pvExonerees50: z.number(),
                mvNonImputables50: z.number(),
              })
              .partial(),
            capitalRisqueExonere: z.number(),
            pvImmobilieresNonResidents: z.number(),
            report150_0Dbis: z
              .object({
                pvReportExpire: z.number(),
                complementPrix: z.number(),
              })
              .partial(),
            report150_0Bter: z
              .object({
                pvRealisees: z
                  .object({
                    avantAbattement: z.number(),
                    apresAbattement: z.number(),
                  })
                  .partial(),
                pvReportExpire: z
                  .object({
                    du141112au311212: z
                      .object({
                        taxable24: z.number(),
                        taxable19: z.number(),
                      })
                      .partial(),
                    depuis010113: z
                      .object({
                        pvAvantAbattement2013a2016: z.number(),
                        pvAvantAbattementDepuis2017: z.number(),
                        pvImposables: z.number(),
                        irBareme: z.number(),
                        irPfu12_8: z.number(),
                        cehr: z.number(),
                      })
                      .partial(),
                  })
                  .partial(),
              })
              .partial(),
            reportOpcMonetaires: z.number(),
            actifsNumeriques: z
              .object({
                plusValue: z.number(),
                moinsValue: z.number(),
                optionBareme: z.boolean(),
              })
              .partial(),
            exitTax: z
              .object({
                avecSursis: z
                  .object({
                    ps: z.number(),
                    ir: z.number(),
                    art150_0Bter: z
                      .object({
                        irCehr: z.number(),
                        ps15_5: z.number(),
                        ps17_2: z.number(),
                      })
                      .partial(),
                  })
                  .partial(),
                sansSursis: z
                  .object({
                    ps: z.number(),
                    ir: z.number(),
                    art150_0Bter: z
                      .object({
                        irCehr: z.number(),
                        ps15_5: z.number(),
                        ps17_2: z.number(),
                      })
                      .partial(),
                  })
                  .partial(),
              })
              .partial(),
            pvDejaImposees19: z.number(),
            pvExonereeRemploi: z.number(),
          })
          .partial(),
        fonciers: z
          .object({
            micro: z
              .object({
                recettes: z.number(),
                sourceEtrangere: z.number(),
                exoneresTauxEffectif: z.number(),
              })
              .partial(),
            regimeReel: z
              .object({
                imposables: z.number(),
                sourceEtrangere: z.number(),
                exoneresTauxEffectif: z.number(),
              })
              .partial(),
            deficitFoncier: z.number(),
            deficitGlobal: z.number(),
            deficitsAnterieurs: z.number(),
            robienBorloo: z.number(),
            finPerception: z.boolean(),
          })
          .partial(),
        microVL: z
          .object({
            bic: z
              .object({
                ventesMarchandises: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                prestationsServicesMeublees: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
              })
              .partial(),
            bnc: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac: z.number(),
              })
              .partial(),
          })
          .partial(),
        bicPro: z
          .object({
            dureeExercice: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac: z.number(),
              })
              .partial(),
            cessionCessation: z
              .object({
                declarant1: z.boolean(),
                declarant2: z.boolean(),
                pac: z.boolean(),
              })
              .partial(),
            micro: z
              .object({
                exoneres: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                ventesMarchandises: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                prestationsServicesMeublees: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                pvCourtTerme: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                pvLongTerme: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                mvCourtTerme: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                mvLongTerme: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
              })
              .partial(),
            reel: z
              .object({
                exoneres: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                imposables: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                dontPvCtSubventions: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                dontMvCt: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                sourceEtrangere: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                deficits: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                pvLongTerme: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                brevets: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
              })
              .partial(),
          })
          .partial(),
        bicNonPro: z
          .object({
            dureeExercice: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac: z.number(),
              })
              .partial(),
            cessionCessation: z
              .object({
                declarant1: z.boolean(),
                declarant2: z.boolean(),
                pac: z.boolean(),
              })
              .partial(),
            micro: z
              .object({
                exoneres: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                ventesMarchandises: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                prestationsServices: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                pvCourtTerme: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                pvLongTerme: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                mvCourtTerme: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                mvLongTerme: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
              })
              .partial(),
            reel: z
              .object({
                exoneres: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                imposables: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                dontPvCtSubventions: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                dontMvCt: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                sourceEtrangere: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                deficits: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                pvLongTerme: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                brevets: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
              })
              .partial(),
            deficitsAnterieurs: z
              .object({
                nMoins6: z.number(),
                nMoins5: z.number(),
                nMoins4: z.number(),
                nMoins3: z.number(),
                nMoins2: z.number(),
                nMoins1: z.number(),
              })
              .partial(),
          })
          .partial(),
        lmnp: z
          .object({
            dureeExercice: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac: z.number(),
              })
              .partial(),
            cessionCessation: z
              .object({
                declarant1: z.boolean(),
                declarant2: z.boolean(),
                pac: z.boolean(),
              })
              .partial(),
            micro: z
              .object({
                chambresHotesMeublesClasses: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                meublesTourismeNonClasses: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                autresMeublees: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                secu: z
                  .object({
                    chambresHotesMeublesClasses: z
                      .object({
                        declarant1: z.number(),
                        declarant2: z.number(),
                        pac: z.number(),
                      })
                      .partial(),
                    meublesTourismeNonClasses: z
                      .object({
                        declarant1: z.number(),
                        declarant2: z.number(),
                        pac: z.number(),
                      })
                      .partial(),
                    autresMeublees: z
                      .object({
                        declarant1: z.number(),
                        declarant2: z.number(),
                        pac: z.number(),
                      })
                      .partial(),
                  })
                  .partial(),
              })
              .partial(),
            reel: z
              .object({
                imposables: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                sourceEtrangere: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                imposablesSecu: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                deficits: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                deficitsSecu: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
              })
              .partial(),
            deficitsAnterieurs: z
              .object({
                nMoins10: z.number(),
                nMoins9: z.number(),
                nMoins8: z.number(),
                nMoins7: z.number(),
                nMoins6: z.number(),
                nMoins5: z.number(),
                nMoins4: z.number(),
                nMoins3: z.number(),
                nMoins2: z.number(),
                nMoins1: z.number(),
              })
              .partial(),
          })
          .partial(),
        bncPro: z
          .object({
            dureeExercice: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac: z.number(),
              })
              .partial(),
            cessionCessation: z
              .object({
                declarant1: z.boolean(),
                declarant2: z.boolean(),
                pac: z.boolean(),
              })
              .partial(),
            micro: z
              .object({
                exoneres: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                imposables: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                pvCourtTerme: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                pvLongTerme: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                mvCourtTerme: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                mvLongTerme: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
              })
              .partial(),
            reel: z
              .object({
                exoneres: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                imposables: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                dontPvCt: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                dontMvCt: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                sourceEtrangere: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                deficits: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                pvLongTerme: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                produitsBrevets: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                jeunesCreateurs: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                agentsGeneraux: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                  })
                  .partial(),
              })
              .partial(),
          })
          .partial(),
        bncNonPro: z
          .object({
            dureeExercice: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac: z.number(),
              })
              .partial(),
            cessionCessation: z
              .object({
                declarant1: z.boolean(),
                declarant2: z.boolean(),
                pac: z.boolean(),
              })
              .partial(),
            micro: z
              .object({
                exoneres: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                imposables: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                pvCourtTerme: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                pvLongTerme: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                mvCourtTerme: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                mvLongTerme: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
              })
              .partial(),
            reel: z
              .object({
                exoneres: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                imposables: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                dontPvCt: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                dontMvCt: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                sourceEtrangere: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                deficits: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                pvLongTerme: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                produitsBrevets: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                produitsBrevetsSecu: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
                jeunesCreateurs: z
                  .object({
                    declarant1: z.number(),
                    declarant2: z.number(),
                    pac: z.number(),
                  })
                  .partial(),
              })
              .partial(),
            deficitsAnterieurs: z
              .object({
                nMoins6: z.number(),
                nMoins5: z.number(),
                nMoins4: z.number(),
                nMoins3: z.number(),
                nMoins2: z.number(),
                nMoins1: z.number(),
              })
              .partial(),
          })
          .partial(),
        soumisPrelevementsSociaux: z
          .object({
            revenusNets: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac: z.number(),
              })
              .partial(),
            pvLongTermeRetraite: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
              })
              .partial(),
          })
          .partial(),
      })
      .partial(),
    charges: z
      .object({
        csgDeductible: z.number(),
        pensionsAlimentaires: z
          .object({
            enfantsMajeurs: z
              .object({
                justiceAvant2006: z
                  .object({
                    enfant1: z.number(),
                    enfant2: z.number(),
                  })
                  .partial(),
                autres: z
                  .object({
                    enfant1: z.number(),
                    enfant2: z.number(),
                  })
                  .partial(),
              })
              .partial(),
            autres: z
              .object({
                justiceAvant2006: z.number(),
                montant: z.number(),
              })
              .partial(),
          })
          .partial(),
        fraisAccueilPersonneAgee: z
          .object({
            montant: z.number(),
            nombrePersonnes: z.number(),
          })
          .partial(),
        chargesFoncieresMonuments: z.number(),
        deductionsDiverses: z.number(),
        sommesAAjouterRevenuImposable: z.number(),
        epargneRetraite: z
          .object({
            cotisationsPerp: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac: z.number(),
              })
              .partial(),
            cotisationsNouveauxPer: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac: z.number(),
              })
              .partial(),
            plafondDeduction: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac: z.number(),
              })
              .partial(),
            plafondConjoint: z.boolean(),
            nouveauDomicilieFrance: z.boolean(),
            cotisationsPerDeduitesBicBncBa: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac: z.number(),
              })
              .partial(),
            autresCotisationsDeduites: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac: z.number(),
              })
              .partial(),
          })
          .partial(),
        grossesReparationsNusProprietaires: z
          .object({
            report2017: z.number(),
            report2016: z.number(),
            report2015: z.number(),
          })
          .partial(),
        deficitsGlobauxAnterieurs: z
          .object({
            nMoins6: z.number(),
            nMoins5: z.number(),
            nMoins4: z.number(),
            nMoins3: z.number(),
            nMoins2: z.number(),
            nMoins1: z.number(),
          })
          .partial(),
      })
      .partial(),
    reductionsCredits: z
      .object({
        dons: z
          .object({
            france: z
              .object({
                personnesEnDifficulte13102025: z.number(),
                personnesEnDifficulte31122025: z.number(),
                patrimoineReligieux: z.number(),
                victimesCycloneChido: z.number(),
                oeuvresUtilitePublique: z.number(),
                partisPoliques: z.number(),
                reportVersements: z
                  .object({
                    nMoins5: z.number(),
                    nMoins4: z.number(),
                    nMoins3: z.number(),
                    nMoins2: z.number(),
                    nMoins1: z.number(),
                  })
                  .partial(),
              })
              .partial(),
            europe: z
              .object({
                personnesEnDifficulte13102025: z.number(),
                personnesEnDifficulte31122025: z.number(),
                autresOrganismes: z.number(),
              })
              .partial(),
          })
          .partial(),
        cotisationsSyndicales: z
          .object({
            declarant1: z.number(),
            declarant2: z.number(),
            pac: z.number(),
          })
          .partial(),
        prestationsCompensatoires: z
          .object({
            sommesVersees: z.number(),
            sommesDecideesParJugement: z.number(),
            capitalSubstitutionRente: z.number(),
            reportSommesDecidees: z.number(),
          })
          .partial(),
        systemeChargeVehiculesElectriques: z
          .object({
            habitationPrincipale: z
              .object({
                premierSysteme: z.number(),
                secondSysteme: z.number(),
              })
              .partial(),
            habitationSecondaire: z
              .object({
                premierSysteme: z.number(),
                secondSysteme: z.number(),
              })
              .partial(),
          })
          .partial(),
        travauxPreventionRisquesTechnoLocation: z.number(),
        adaptationLogements: z
          .object({
            ileDeFrance: z.boolean(),
            rfrNMoins2: z.number(),
            rfrNMoins1: z.number(),
            depensesAnterieures: z
              .object({
                nMoins4: z.number(),
                nMoins3: z.number(),
                nMoins2: z.number(),
                nMoins1: z.number(),
              })
              .partial(),
            depenses: z.number(),
          })
          .partial(),
        travauxPPRT: z.number(),
        rentesSurvieEpargneHandicap: z.number(),
        enfantsEtudes: z
          .object({
            college: z.number(),
            lycee: z.number(),
            superieur: z.number(),
            residenceAlternee: z
              .object({
                college: z.number(),
                lycee: z.number(),
                superieur: z.number(),
              })
              .partial(),
          })
          .partial(),
        accueilPersonnesDependantes: z
          .object({
            premierePersonne: z.number(),
            deuxiemePersonne: z.number(),
          })
          .partial(),
        fraisGardeEnfants: z
          .object({
            premierEnfant: z.number(),
            deuxiemeEnfant: z.number(),
            troisiemeEnfant: z.number(),
            residenceAlternee: z
              .object({
                premierEnfant: z.number(),
                deuxiemeEnfant: z.number(),
                troisiemeEnfant: z.number(),
              })
              .partial(),
          })
          .partial(),
        servicePersonne: z
          .object({
            sommesVersees: z.number(),
            aidesPercues: z.number(),
            nombreAscendantsApa: z.number(),
            premierEmploi: z.boolean(),
            carteInvalidite: z.boolean(),
          })
          .partial(),
        mecenat: z.number(),
        souscriptionCapitalPME: z
          .object({
            versements: z
              .object({
                pme: z.number(),
                esus: z.number(),
                jeiJeuJeic: z.number(),
                jeir: z.number(),
                sfs: z.number(),
              })
              .partial(),
            reportsPmeEsus: z
              .object({
                janvMai2021: z.number(),
                janvMars2022: z.number(),
                marsDecembre2022: z.number(),
                janvMars2023: z.number(),
                marsDecembre2023: z.number(),
                pme2024: z.number(),
                esusJanvJuin2024: z.number(),
                esusJuinDecembre2024: z.number(),
              })
              .partial(),
            reportsPmeMaiDecembre2021: z.number(),
            reportsEsusMaiDecembre2021: z.number(),
            reportsSfs: z
              .object({
                nMoins4: z.number(),
                nMoins3: z.number(),
                nMoins2: z.number(),
                nMoins1: z.number(),
              })
              .partial(),
            reportReductionEsusSfs2021: z.number(),
            reportReductionPlafonnementGlobal: z
              .object({
                nMoins5: z.number(),
                nMoins4: z.number(),
                nMoins3: z.number(),
                nMoins2: z.number(),
                nMoins1: z.number(),
              })
              .partial(),
          })
          .partial(),
        fcpInnovation: z
          .object({
            versementsJanvSept: z.number(),
            versementsSeptDec: z.number(),
          })
          .partial(),
        fipCorse: z.number(),
        fipOutreMer: z.number(),
        entreprisesPresse: z
          .object({
            taux30: z.number(),
            taux50: z.number(),
          })
          .partial(),
        sofica: z
          .object({
            taux30: z.number(),
            taux36: z.number(),
            taux48: z.number(),
          })
          .partial(),
        travauxMonumentsHistoriques: z.number(),
        defenseForestsIncendie: z.number(),
        interetsEmpruntRepriseSociete: z.number(),
      })
      .partial(),
    reprisesImputationsDivers: z
      .object({
        retenueSourceFrance: z.number(),
        impotPayeEtranger: z
          .object({
            rcmEtPlusValues: z.number(),
            autresRevenus: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
                pac: z.number(),
              })
              .partial(),
          })
          .partial(),
        patrimoineExoneresCSG: z
          .object({
            regimeAssuranceMaladieEEE: z
              .object({
                declarant1: z.boolean(),
                declarant2: z.boolean(),
              })
              .partial(),
            revenusFonciers: z.number(),
            rentesViageres: z.number(),
            rcm: z.number(),
            plusValues: z.number(),
          })
          .partial(),
        contributionHautsRevenus: z.boolean(),
        creditImpotRecherche: z
          .object({
            restitutionImmediate: z.number(),
            collaborationRecherche: z.number(),
            autresEntreprises: z.number(),
          })
          .partial(),
        creditImpotFamille: z.number(),
        creditImpotIndustrieVerte: z.number(),
        reprisesReductionsCredits: z.number(),
        revenusEtrangerTauxEffectif: z.number(),
        revenuNetMondial: z.number(),
        revenusActiviteSourceEtrangere: z
          .object({
            nonSalariaux9_2: z.number(),
            salaires9_2: z.number(),
            allocationsPreretraite9_2: z.number(),
            allocationsChomage6_2: z.number(),
            allocationsChomage3_8: z.number(),
            ijMaladieMaternite6_2: z.number(),
            pensionsRetraite8_3: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
              })
              .partial(),
            pensionsRetraite6_6: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
              })
              .partial(),
            pensionsRetraite3_8: z
              .object({
                declarant1: z.number(),
                declarant2: z.number(),
              })
              .partial(),
            pensionsCapitalPFL8_3: z.number(),
            pensionsCapitalPFL6_6: z.number(),
            pensionsCapitalPFL3_8: z.number(),
          })
          .partial(),
        revenusEtrangersOuvrantCreditImpot: z.number(),
        nonDomiciliesFrance: z
          .object({
            revenusTauxMoyen: z.number(),
            impotPvSursis: z.number(),
          })
          .partial(),
        plusValuesReportImposition: z.number(),
        reductionPretTauxZeroMobilite: z.number(),
        reportReductionNMoins1: z.number(),
        creditAgricultureBiologique: z.number(),
        pretsSansInteret: z.number(),
        creditMetiersDart: z.number(),
        creditCongeAgriculteurs: z.number(),
        exploitationAgricoleHVE: z.number(),
        microVersementsLiberatoires: z.number(),
      })
      .partial(),
    avanceReductionsCredits: z.number(),
    cdhr: z
      .object({
        contrats8AnsPlus: z
          .object({
            janvFev: z.number(),
            fevDec: z.number(),
          })
          .partial(),
        contratsMoins8Ans: z
          .object({
            janvFev: z.number(),
            fevDec: z.number(),
            prelevement: z.number(),
          })
          .partial(),
        gainsCession: z
          .object({
            janvFev: z.number(),
            fevDec: z.number(),
            prelevement: z.number(),
          })
          .partial(),
        autresPrelevementLiberatoire: z
          .object({
            janvFev: z.number(),
            fevDec: z.number(),
            prelevement: z.number(),
          })
          .partial(),
        exceptionnelsTaux: z
          .object({
            montant: z.number(),
            taux: z.number(),
          })
          .partial(),
        secondsExceptionnelsTaux: z
          .object({
            montant: z.number(),
            taux: z.number(),
          })
          .partial(),
        sourceEtrangereExoneres: z.number(),
        acompte: z
          .object({
            declarant1: z.number(),
            declarant2: z.number(),
          })
          .partial(),
      })
      .partial(),
    prelevementSource: z
      .object({
        retenueSalairesPensions: z
          .object({
            declarant1: z.number(),
            declarant2: z.number(),
          })
          .partial(),
        acomptesIR: z
          .object({
            declarant1: z.number(),
            declarant2: z.number(),
          })
          .partial(),
        acomptesPS: z
          .object({
            declarant1: z.number(),
            declarant2: z.number(),
          })
          .partial(),
        regularisationsIR: z
          .object({
            declarant1: z.number(),
            declarant2: z.number(),
          })
          .partial(),
        regularisationsPS: z
          .object({
            declarant1: z.number(),
            declarant2: z.number(),
          })
          .partial(),
      })
      .partial(),
  })
  .partial();

export type Alias = z.infer<typeof aliasSchema>;
