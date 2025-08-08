import type { Adulte, Don, Foyer } from "@akimeo/modele";
import {
  calculerContributionPlacement,
  ENVELOPPE_PLACEMENT,
  IMPOSITION_RCM,
  isFoyerCouple,
  isNatureRevenuMicroEntreprise,
  NATURE_DON,
  NATURE_REVENU,
  SCOLARTIE_ENFANT,
  SITUATION_FAMILIALE,
} from "@akimeo/modele";
import { differenceInYears } from "date-fns/differenceInYears";

import { calculerRemunerationAnnuelleDeductibleEmploiADomicile } from "./calculer-remuneration-annuelle-deductible-emploi-a-domicile";
import { dedupeRevenus } from "./dedupe-revenus";

type CaseARemplir =
  | {
      type: "fill";
      selector: string;
      value: number;
    }
  | {
      type: "check";
      selector: string;
    };

function listerCasesARemplir(foyer: Foyer) {
  const casesARemplir = {
    p03: [] as CaseARemplir[],
    p04: [] as CaseARemplir[],
    p05: [] as CaseARemplir[],
    p06: [] as CaseARemplir[],
    p07: [] as CaseARemplir[],
    p08: [] as CaseARemplir[],
    p09: [] as CaseARemplir[],
    p10: [] as CaseARemplir[],
    p11: [] as CaseARemplir[],
    p12: [] as CaseARemplir[],
    p13: [] as CaseARemplir[],
    p14: [] as CaseARemplir[],
    p15: [] as CaseARemplir[],
    p16: [] as CaseARemplir[],
    p17: [] as CaseARemplir[],
    p18: [] as CaseARemplir[],
  };

  const declarants = [
    foyer.declarant1,
    ...(isFoyerCouple(foyer) ? [foyer.declarant2] : []),
  ] as [Adulte] | [Adulte, Adulte];

  // p03

  for (let i = 0; i < declarants.length; i++) {
    for (const revenu of dedupeRevenus(declarants[i]!.revenus)) {
      switch (revenu.nature) {
        case NATURE_REVENU.salaire.value:
          casesARemplir.p03.push({
            type: "fill",
            selector: ["#B1AJ", "#B1BJ"][i]!,
            value: revenu.montantAnnuel,
          });
          break;
        case NATURE_REVENU.remuneration.value:
          casesARemplir.p03.push({
            type: "fill",
            selector: ["#B1GB", "#B1HB"][i]!,
            value: revenu.montantAnnuel,
          });
          break;
      }
    }
  }

  // p04

  for (let i = 0; i < declarants.length; i++) {
    for (const revenu of dedupeRevenus(declarants[i]!.revenus)) {
      switch (revenu.nature) {
        case NATURE_REVENU.pensionRetraite.value:
          casesARemplir.p04.push({
            type: "fill",
            selector: ["#B1AS", "#B1BS"][i]!,
            value: revenu.montantAnnuel,
          });
          break;
      }
    }
  }

  // p05

  // p06

  for (const revenu of dedupeRevenus(
    declarants.flatMap((declarant) => declarant.revenus),
  )) {
    switch (revenu.nature) {
      case NATURE_REVENU.rcm.value:
        casesARemplir.p06.push({
          type: "fill",
          selector: "#B2DC",
          value: revenu.montantAnnuel,
        });
        break;
    }
  }

  if (foyer.impositionRCM === IMPOSITION_RCM.bareme.value) {
    casesARemplir.p06.push({ type: "check", selector: "#B2OP" });
  }

  // p07

  // p08

  for (const revenu of dedupeRevenus(
    declarants.flatMap((declarant) => declarant.revenus),
  )) {
    switch (revenu.nature) {
      case NATURE_REVENU.microFoncier.value:
        casesARemplir.p08.push({
          type: "fill",
          selector: "#B4BE",
          value: revenu.montantAnnuel,
        });
        break;
      case NATURE_REVENU.foncier.value:
        casesARemplir.p08.push({
          type: "fill",
          selector: revenu.montantAnnuel >= 0 ? "#B4BA" : "#B4EA",
          value: Math.abs(revenu.montantAnnuel),
        });
        break;
    }
  }

  // p09

  for (let i = 0; i < declarants.length; i++) {
    const declarant = declarants[i]!;

    if (!declarant.versementLiberatoire) {
      continue;
    }

    for (const revenu of dedupeRevenus(declarant.revenus)) {
      if (!isNatureRevenuMicroEntreprise(revenu.nature)) {
        continue;
      }

      switch (revenu.nature) {
        case NATURE_REVENU.microBICMarchandises.value:
          casesARemplir.p09.push({
            type: "fill",
            selector: ["#B5TA", "#B5UA"][i]!,
            value: revenu.montantAnnuel,
          });
          break;
        case NATURE_REVENU.microBICServices.value:
          casesARemplir.p09.push({
            type: "fill",
            selector: ["#B5TB", "#B5UB"][i]!,
            value: revenu.montantAnnuel,
          });
          break;
        case NATURE_REVENU.microBNC.value:
          casesARemplir.p09.push({
            type: "fill",
            selector: ["#B5TE", "#B5UE"][i]!,
            value: revenu.montantAnnuel,
          });
          break;
      }
    }
  }

  // p10

  // p11

  for (let i = 0; i < declarants.length; i++) {
    const declarant = declarants[i]!;

    if (declarant.versementLiberatoire) {
      continue;
    }

    for (const revenu of dedupeRevenus(declarant.revenus)) {
      if (!isNatureRevenuMicroEntreprise(revenu.nature)) {
        continue;
      }

      switch (revenu.nature) {
        case NATURE_REVENU.microBICMarchandises.value:
          casesARemplir.p11.push({
            type: "fill",
            selector: ["#B5KO", "#B5LO"][i]!,
            value: revenu.montantAnnuel,
          });
          break;
        case NATURE_REVENU.microBICServices.value:
          casesARemplir.p11.push({
            type: "fill",
            selector: ["#B5KP", "#B5LP"][i]!,
            value: revenu.montantAnnuel,
          });
          break;
      }
    }
  }

  // p12

  // p13

  for (let i = 0; i < declarants.length; i++) {
    const declarant = declarants[i]!;

    if (declarant.versementLiberatoire) {
      continue;
    }

    for (const revenu of dedupeRevenus(declarant.revenus)) {
      if (!isNatureRevenuMicroEntreprise(revenu.nature)) {
        continue;
      }

      switch (revenu.nature) {
        case NATURE_REVENU.microBNC.value:
          casesARemplir.p13.push({
            type: "fill",
            selector: ["#B5HQ", "#B5IQ"][i]!,
            value: revenu.montantAnnuel,
          });
          break;
      }
    }
  }

  // p14

  // p15

  // p16

  for (let i = 0; i < declarants.length; i++) {
    const versementAnnuelPER = declarants[i]!.placements.reduce(
      (acc, placement) =>
        placement.enveloppe === ENVELOPPE_PLACEMENT.per.value
          ? acc + calculerContributionPlacement(placement).versements
          : acc,
      0,
    );

    if (versementAnnuelPER > 0) {
      casesARemplir.p16.push({
        type: "fill",
        selector: ["#B6RS", "#B6RT"][i]!,
        value: versementAnnuelPER,
      });

      const plafondDeduction = versementAnnuelPER;
      casesARemplir.p16.push({
        type: "fill",
        selector: ["#BAPS", "#BAPT"][i]!,
        value: plafondDeduction,
      });
    }
  }

  // p17

  const enfantsScolarises = foyer.enfants.reduce(
    (acc, enfant) => {
      if (enfant.scolarite) {
        acc[enfant.scolarite] += 1;
      }

      return acc;
    },
    {
      [SCOLARTIE_ENFANT.collegien.value]: 0,
      [SCOLARTIE_ENFANT.lyceen.value]: 0,
      [SCOLARTIE_ENFANT.etudiant.value]: 0,
    },
  );

  if (enfantsScolarises[SCOLARTIE_ENFANT.collegien.value] > 0) {
    casesARemplir.p17.push({
      type: "fill",
      selector: "#B7EA",
      value: enfantsScolarises[SCOLARTIE_ENFANT.collegien.value],
    });
  }

  if (enfantsScolarises[SCOLARTIE_ENFANT.lyceen.value] > 0) {
    casesARemplir.p17.push({
      type: "fill",
      selector: "#B7EC",
      value: enfantsScolarises[SCOLARTIE_ENFANT.lyceen.value],
    });
  }

  if (enfantsScolarises[SCOLARTIE_ENFANT.etudiant.value] > 0) {
    casesARemplir.p17.push({
      type: "fill",
      selector: "#B7EF",
      value: enfantsScolarises[SCOLARTIE_ENFANT.etudiant.value],
    });
  }

  const enfantsAvecFraisDeGarde = foyer.enfants.filter(
    (enfant) =>
      typeof enfant.fraisDeGarde === "number" &&
      differenceInYears(new Date(), enfant.dateNaissance) <= 6,
  );
  for (let i = 0; i < Math.min(enfantsAvecFraisDeGarde.length, 3); i++) {
    casesARemplir.p17.push({
      type: "fill",
      selector: ["#B7GA", "#B7GB", "#B7GC"][i]!,
      value: enfantsAvecFraisDeGarde[i]!.fraisDeGarde!,
    });
  }

  const donsGroupes = declarants
    .flatMap((declarant) => declarant.dons)
    .reduce(
      (acc, don) => {
        acc[don.nature] =
          // FIXME: un bon type permettrait de ne pas avoir à désactiver les règles
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          (acc[don.nature] ?? 0) + don.montantAnnuel;
        return acc;
      },
      {} as Record<Don["nature"], number>,
    );
  for (const [nature, montantAnnuel] of Object.entries(donsGroupes)) {
    if (montantAnnuel > 0) {
      switch (nature) {
        case NATURE_DON.personnesEnDifficulte.value:
          casesARemplir.p17.push({
            type: "fill",
            selector: "#B7UD",
            value: montantAnnuel,
          });
          break;
        case NATURE_DON.utilitePublique.value:
          casesARemplir.p17.push({
            type: "fill",
            selector: "#B7UF",
            value: montantAnnuel,
          });
          break;
        case NATURE_DON.partisPolitiques.value:
          casesARemplir.p17.push({
            type: "fill",
            selector: "#B7UH",
            value: montantAnnuel,
          });
          break;
      }
    }
  }

  const remunerationAnnuelleDeductibleEmploiADomicile =
    calculerRemunerationAnnuelleDeductibleEmploiADomicile(foyer);
  if (remunerationAnnuelleDeductibleEmploiADomicile > 0) {
    casesARemplir.p17.push({
      type: "fill",
      selector: "#B7DB",
      value: remunerationAnnuelleDeductibleEmploiADomicile,
    });
  }

  // p18

  return casesARemplir;
}

export interface DriverRemplisseur {
  click(selector: string): Promise<void>;
  fill(selector: string, value: string | number): Promise<void>;
  getValue(selector: string): Promise<string | null>;
  isVisible(selector: string): Promise<boolean>;
}

function parseNumberValue(value: string | null) {
  return value == null ? null : Number(value.replace(/\s+/, ""));
}

export async function remplirSimulateur(
  driver: DriverRemplisseur,
  foyer: Foyer,
) {
  const casesARemplir = listerCasesARemplir(foyer);

  // p01

  switch (foyer.situationFamiliale) {
    case SITUATION_FAMILIALE.marie.value:
      await driver.click("#pre_situation_familleM");
      break;
    case SITUATION_FAMILIALE.pacse.value:
      await driver.click("#pre_situation_familleO");
      break;
    case SITUATION_FAMILIALE.celibataire.value:
    case SITUATION_FAMILIALE.concubinage.value:
      await driver.click("#pre_situation_familleC");
      break;
    case SITUATION_FAMILIALE.divorce.value:
      await driver.click("#pre_situation_familleD");
      break;
    case SITUATION_FAMILIALE.veuf.value:
      await driver.click("#pre_situation_familleV");
      break;
    default:
      throw new Error(
        // @ts-expect-error garde-fou pour gérer tous les cas
        `Cas non géré : "${foyer.situationFamiliale}"`,
      );
  }

  await driver.fill("#B0DA", foyer.declarant1.dateNaissance.getFullYear());

  if (isFoyerCouple(foyer)) {
    await driver.fill("#B0DB", foyer.declarant2.dateNaissance.getFullYear());
  }

  await driver.fill("#B0CF", foyer.enfants.length);

  for (let i = 0; i < Math.min(foyer.enfants.length, 6); i++) {
    const enfant = foyer.enfants[i]!;
    await driver.fill(`#B0F${i}`, enfant.dateNaissance.getFullYear());
  }

  await driver.click(".suite1");

  // p02

  if (casesARemplir.p03.length > 0) {
    await driver.click("#revenu1");
  }

  if (casesARemplir.p04.length > 0) {
    await driver.click("#revenu2");
  }

  if (casesARemplir.p06.length > 0) {
    await driver.click("#revenu4");
  }

  if (casesARemplir.p08.length > 0) {
    await driver.click("#revenu6");
  }

  if (casesARemplir.p09.length > 0) {
    await driver.click("#revenu14");
  }

  if (casesARemplir.p11.length > 0) {
    await driver.click("#revenu9");
  }

  if (casesARemplir.p13.length > 0) {
    await driver.click("#revenu11");
  }

  if (casesARemplir.p16.length > 0) {
    await driver.click("#charge1");
  }

  if (casesARemplir.p17.length > 0) {
    await driver.click("#charge2");
  }

  await driver.click(".suite2");

  for (const key of [
    "p03",
    "p04",
    "p05",
    "p06",
    "p07",
    "p08",
    "p09",
    "p10",
    "p11",
    "p12",
    "p13",
    "p14",
    "p15",
    "p16",
    "p17",
    "p18",
  ] as const) {
    const selector = `#${key}`;
    if (await driver.isVisible(selector)) {
      for (const caseARemplir of casesARemplir[key]) {
        switch (caseARemplir.type) {
          case "fill":
            await driver.fill(caseARemplir.selector, caseARemplir.value);
            break;
          case "check":
            await driver.click(caseARemplir.selector);
            break;
        }
      }
      await driver.click(`${selector} a[class*="suite"]`);
    }
  }

  // pagePas

  await driver.click(".suitePAS");

  // p19

  await driver.click(".suite19");

  // résultat

  const ir =
    parseNumberValue(await driver.getValue(`[name="IINETIR"]`)) ??
    parseNumberValue(await driver.getValue(`[name="IRESTIR"]`))!;
  const ps = parseNumberValue(await driver.getValue(`[name="NAPCRP"]`));

  return { ir, ps };
}
