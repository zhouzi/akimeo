import type { Foyer } from "@akimeo/modele";
import {
  creerDon,
  creerEmploiADomicile,
  creerEnfant,
  creerFoyer,
  creerPlacement,
  ENVELOPPE_PLACEMENT,
  IMPOSITION_RCM,
  NATURE_DON,
  NATURE_REVENU,
  SCOLARTIE_ENFANT,
  SITUATION_FAMILIALE,
  TYPE_EMPLOI_A_DOMICILE,
} from "@akimeo/modele";
import { createClient } from "@akimeo/pilote-ir/client";
import { subYears } from "date-fns";
import { describe, expect, it } from "vitest";

import { calculerIRDu } from "~/ir/calculer-ir-du";
import { convertirFoyerEnAlias } from "../convertir-foyer-en-alias";

const client = createClient({
  apiKey: process.env.PILOTE_IR_API_KEY!,
});

describe("calculerIRDu", () => {
  it.sequential.each<[string, Foyer]>([
    [
      "célibataire, salaire 36k",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 36000,
            },
          ],
        },
      }),
    ],
    [
      "concubinage, salaire 36k, déclarant 2 sans revenus",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.concubinage.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 36000,
            },
          ],
        },
        declarant2: {
          revenus: [],
        },
      }),
    ],
    [
      "pacsé, salaire 36k, déclarant 2 sans revenus",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.pacse.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 36000,
            },
          ],
        },
        declarant2: {
          revenus: [],
        },
      }),
    ],
    [
      "marié, salaires 36k + 21.6k",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.marie.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 36000,
            },
          ],
        },
        declarant2: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 21600,
            },
          ],
        },
      }),
    ],
    [
      "célibataire, salaire 36k, 1 enfant non scolarisé",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 36000,
            },
          ],
        },
        enfants: [
          creerEnfant({
            scolarite: null,
          }),
        ],
      }),
    ],
    [
      "célibataire, salaire 36k, 1 enfant collégien",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 36000,
            },
          ],
        },
        enfants: [
          creerEnfant({
            scolarite: SCOLARTIE_ENFANT.collegien.value,
          }),
        ],
      }),
    ],
    [
      "célibataire, salaire 36k, PER 4560",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 36000,
            },
          ],
          placements: [
            creerPlacement({
              enveloppe: ENVELOPPE_PLACEMENT.per.value,
              versementsAnnuels: 4560,
            }),
          ],
        },
      }),
    ],
    [
      "pacsé, salaires 36k + 36k, don utilité publique 500",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.pacse.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 36000,
            },
          ],
          dons: [
            creerDon({
              nature: NATURE_DON.utilitePublique.value,
              montantAnnuel: 500,
            }),
          ],
        },
        declarant2: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 36000,
            },
          ],
        },
      }),
    ],
    [
      "célibataire, salaire 36k, don personnes en difficulté 5000",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 36000,
            },
          ],
          dons: [
            creerDon({
              nature: NATURE_DON.personnesEnDifficulte.value,
              montantAnnuel: 5000,
            }),
          ],
        },
      }),
    ],
    [
      "célibataire, salaire 150k, dons multiples (politiques + difficulté + utilité publique)",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 150000,
            },
          ],
          dons: [
            creerDon({
              nature: NATURE_DON.partisPolitiques.value,
              montantAnnuel: 50000,
            }),
            creerDon({
              nature: NATURE_DON.personnesEnDifficulte.value,
              montantAnnuel: 50000,
            }),
            creerDon({
              nature: NATURE_DON.utilitePublique.value,
              montantAnnuel: 50000,
            }),
          ],
        },
      }),
    ],
    [
      "célibataire, micro-BNC 40k",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.microBNC.value,
              montantAnnuel: 40000,
            },
          ],
        },
      }),
    ],
    [
      "célibataire, micro-BNC 40k + micro-BIC services 20k",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.microBNC.value,
              montantAnnuel: 40000,
            },
            {
              nature: NATURE_REVENU.microBICServices.value,
              montantAnnuel: 20000,
            },
          ],
        },
      }),
    ],
    [
      "célibataire, micro-BIC marchandises 100k",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.microBICMarchandises.value,
              montantAnnuel: 100000,
            },
          ],
        },
      }),
    ],
    [
      "marié, micro-BNC 60k VL + salaire 36k",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.marie.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.microBNC.value,
              montantAnnuel: 60000,
            },
          ],
          versementLiberatoire: true,
        },
        declarant2: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 36000,
            },
          ],
        },
      }),
    ],
    [
      "célibataire, micro-foncier 10k",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.microFoncier.value,
              montantAnnuel: 10000,
            },
          ],
        },
      }),
    ],
    [
      "célibataire, foncier réel 20k",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.foncier.value,
              montantAnnuel: 20000,
            },
          ],
        },
      }),
    ],
    [
      "célibataire, déficit foncier -10k",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.foncier.value,
              montantAnnuel: -10000,
            },
          ],
        },
      }),
    ],
    [
      "pacsé, micro-BNC 60k VL + micro-BIC marchandises 80k VL",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.pacse.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.microBNC.value,
              montantAnnuel: 60000,
            },
          ],
          versementLiberatoire: true,
        },
        declarant2: {
          revenus: [
            {
              nature: NATURE_REVENU.microBICMarchandises.value,
              montantAnnuel: 80000,
            },
          ],
          versementLiberatoire: true,
        },
      }),
    ],
    [
      "célibataire, salaire 36k, emploi à domicile ménage 50k",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 36000,
            },
          ],
        },
        emploisADomicile: [
          creerEmploiADomicile({
            type: TYPE_EMPLOI_A_DOMICILE.menage.value,
            remunerationAnnuelle: 50000,
          }),
        ],
      }),
    ],
    [
      "célibataire, salaire 36k, 1 enfant, emplois à domicile multiples (ménage + jardinage + informatique + bricolage)",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 36000,
            },
          ],
        },
        enfants: [creerEnfant({})],
        emploisADomicile: [
          creerEmploiADomicile({
            type: TYPE_EMPLOI_A_DOMICILE.menage.value,
            remunerationAnnuelle: 500,
          }),
          creerEmploiADomicile({
            type: TYPE_EMPLOI_A_DOMICILE.jardinage.value,
            remunerationAnnuelle: 3000,
          }),
          creerEmploiADomicile({
            type: TYPE_EMPLOI_A_DOMICILE.assistanceInformatique.value,
            remunerationAnnuelle: 200,
          }),
          creerEmploiADomicile({
            type: TYPE_EMPLOI_A_DOMICILE.petitBricolage.value,
            remunerationAnnuelle: 800,
          }),
        ],
      }),
    ],
    [
      "célibataire, RCM 40k au barème",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.rcm.value,
              montantAnnuel: 40000,
            },
          ],
        },
        impositionRCM: IMPOSITION_RCM.bareme.value,
      }),
    ],
    [
      "célibataire, salaire 36k + RCM 20k au barème",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 36000,
            },
            {
              nature: NATURE_REVENU.rcm.value,
              montantAnnuel: 20000,
            },
          ],
        },
        impositionRCM: IMPOSITION_RCM.bareme.value,
      }),
    ],
    [
      "célibataire, RCM 40k au PFU",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.rcm.value,
              montantAnnuel: 40000,
            },
          ],
        },
        impositionRCM: IMPOSITION_RCM.pfu.value,
      }),
    ],

    // veuf cette année
    [
      "veuf, salaire 80k, sans enfant",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.veuf.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 80000,
            },
          ],
        },
      }),
    ],
    [
      "veuf, salaire 80k, 1 enfant",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.veuf.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 80000,
            },
          ],
        },
        enfants: [creerEnfant({})],
      }),
    ],
    [
      "veuf, salaire 80k, 2 enfants",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.veuf.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 80000,
            },
          ],
        },
        enfants: [creerEnfant({}), creerEnfant({})],
      }),
    ],
    [
      "veuf, salaire 80k, 3 enfants",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.veuf.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 80000,
            },
          ],
        },
        enfants: [creerEnfant({}), creerEnfant({}), creerEnfant({})],
      }),
    ],

    // divorcé cette année
    [
      "divorcé, salaire 80k, sans enfant",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.divorce.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 80000,
            },
          ],
        },
        enfants: [],
      }),
    ],
    [
      "divorcé, salaire 80k, 1 enfant",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.divorce.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 80000,
            },
          ],
        },
        enfants: [creerEnfant({})],
      }),
    ],
    [
      "divorcé, salaire 80k, 2 enfants",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.divorce.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 80000,
            },
          ],
        },
        enfants: [creerEnfant({}), creerEnfant({})],
      }),
    ],
    [
      "divorcé, salaire 80k, 3 enfants",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.divorce.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 80000,
            },
          ],
        },
        enfants: [creerEnfant({}), creerEnfant({}), creerEnfant({})],
      }),
    ],

    // Frais de garde d'enfants
    [
      "célibataire, salaire 36k, 1 enfant 4 ans, frais de garde 2000",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 36000,
            },
          ],
        },
        enfants: [
          creerEnfant({
            dateNaissance: subYears(new Date(), 4),
            fraisDeGarde: 2000,
          }),
        ],
      }),
    ],
    [
      "marié, salaires 45k + 30k, 2 enfants 4 ans, frais de garde 3500 + 1500",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.marie.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 45000,
            },
          ],
        },
        declarant2: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 30000,
            },
          ],
        },
        enfants: [
          creerEnfant({
            dateNaissance: subYears(new Date(), 4),
            fraisDeGarde: 3500,
          }),
          creerEnfant({
            dateNaissance: subYears(new Date(), 4),
            fraisDeGarde: 1500,
          }),
        ],
      }),
    ],
    [
      "pacsé, salaires 60k + 40k, 1 enfant 4 ans, frais de garde 8000 (au-dessus du plafond)",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.pacse.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 60000,
            },
          ],
        },
        declarant2: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 40000,
            },
          ],
        },
        enfants: [
          creerEnfant({
            dateNaissance: subYears(new Date(), 4),
            fraisDeGarde: 8000, // Au-dessus du plafond
          }),
        ],
      }),
    ],
    [
      "célibataire, salaire 25k, 1 enfant 10 ans (trop âgé) + 1 enfant 4 ans sans frais",
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
        declarant1: {
          revenus: [
            {
              nature: NATURE_REVENU.salaire.value,
              montantAnnuel: 25000,
            },
          ],
        },
        enfants: [
          creerEnfant({
            dateNaissance: subYears(new Date(), 10), // Trop agé
            fraisDeGarde: 3500,
          }),
          creerEnfant({
            dateNaissance: subYears(new Date(), 4),
            fraisDeGarde: null, // Pas de frais de garde
          }),
        ],
      }),
    ],
  ])("%s", async (_description, foyer) => {
    const simulation = await client.createSimulation(
      convertirFoyerEnAlias(foyer),
    );
    const expected =
      simulation.resultat!.impotSurLeRevenuNet -
      simulation.resultat!.montantQuiVousSeraRembourse;
    const actual = calculerIRDu(foyer);

    expect(actual).toBeApproximatelyEqual(expected);
  });
});
