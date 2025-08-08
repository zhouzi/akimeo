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
import { subYears } from "date-fns";
import playwright from "playwright";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import type { DriverRemplisseur } from "~/ir/remplir-simulateur";
import { calculerIRDu } from "~/ir/calculer-ir-du";
import { remplirSimulateur } from "~/ir/remplir-simulateur";

const HEADLESS = JSON.parse(process.env.HEADLESS ?? "true") as boolean;
const HEADFULL_TIMEOUT_BETWEEN_INTERACTIONS = 5000;

describe("calculerIRDu", () => {
  let browser: playwright.Browser;
  let page: playwright.Page;
  let driver: DriverRemplisseur;

  beforeAll(async () => {
    browser = await playwright.chromium.launch({ headless: HEADLESS });

    const context = await browser.newContext();
    page = await context.newPage();

    driver = {
      async click(selector) {
        await (await page.$(selector))!.click();
        if (!HEADLESS) {
          await page.waitForTimeout(HEADFULL_TIMEOUT_BETWEEN_INTERACTIONS);
        }
      },
      async fill(selector, value) {
        await (await page.$(selector))!.fill(String(value));
        if (!HEADLESS) {
          await page.waitForTimeout(HEADFULL_TIMEOUT_BETWEEN_INTERACTIONS);
        }
      },
      async getValue(selector) {
        return (await page.$(selector))?.inputValue() ?? null;
      },
      async isVisible(selector) {
        return (await page.$(selector))!.isVisible();
      },
    };
  });

  beforeEach(async () => {
    await page.goto(
      "https://simulateur-ir-ifi.impots.gouv.fr/calcul_impot/2025/complet/",
    );
  });

  afterAll(async () => {
    await browser.close();
  });

  it.each([
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
            plafond: 0,
          }),
        ],
      },
    }),
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

    // veuf cette année
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

    // divorcé cette année
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

    // Frais de garde d'enfants
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
  ])(
    "scénario %$",
    async (foyer) => {
      const expected = await remplirSimulateur(driver, foyer);
      const actual = { ir: calculerIRDu(foyer) };

      expect(actual.ir).toBeOneOf([
        expected.ir - 1,
        expected.ir,
        expected.ir + 1,
      ]);
    },
    HEADLESS
      ? undefined
      : {
          timeout: HEADFULL_TIMEOUT_BETWEEN_INTERACTIONS * 50,
        },
  );
});
