import type { Don, Foyer, Placement } from "@akimeo/modele";
import {
  ENVELOPPE_PLACEMENT,
  IMPOSITION_RCM,
  isFoyerCouple,
  isRevenuMicroEntreprise,
  NATURE_DON,
  NATURE_REVENU,
  SCOLARTIE_ENFANT,
  SITUATION_FAMILIALE,
} from "@akimeo/modele";

import {
  calculerRemunerationAnnuelleDeductibleEmploiADomicile,
  dedupeRevenus,
  getDons,
} from "./calculer-ir";

export interface Driver {
  click(selector: string): Promise<void>;
  fill(selector: string, value: string | number): Promise<void>;
  getValue(selector: string): Promise<string | null>;
  isVisible(selector: string): Promise<boolean>;
}

function sommeVersementsAnnuelsPER(placements: Placement[]) {
  return placements.reduce(
    (acc, placement) =>
      placement.enveloppe === ENVELOPPE_PLACEMENT.per.value
        ? acc + placement.versementsAnnuels
        : acc,
    0,
  );
}

export async function remplirSimulateur(driver: Driver, foyer: Foyer) {
  async function getNumberValue(selector: string) {
    const value = await driver.getValue(selector);
    return value == null ? null : Number(value.replace(/\s+/, ""));
  }

  const revenus = [
    dedupeRevenus(foyer.declarant1.revenus),
    isFoyerCouple(foyer) ? dedupeRevenus(foyer.declarant2.revenus) : [],
  ];
  const versementsAnnuelsPER = [
    sommeVersementsAnnuelsPER(foyer.declarant1.placements),
    isFoyerCouple(foyer)
      ? sommeVersementsAnnuelsPER(foyer.declarant2.placements)
      : 0,
  ];
  const dons = getDons(foyer);

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

  if (
    revenus
      .flat()
      .some((revenu) =>
        (
          [
            NATURE_REVENU.salaire.value,
            NATURE_REVENU.remuneration.value,
          ] as string[]
        ).includes(revenu.nature),
      )
  ) {
    await driver.click("#revenu1");
  }

  if (
    revenus.flat().some((revenu) => revenu.nature === NATURE_REVENU.rcm.value)
  ) {
    await driver.click("#revenu4");
  }

  if (
    revenus
      .flat()
      .some((revenu) =>
        (
          [
            NATURE_REVENU.microFoncier.value,
            NATURE_REVENU.foncier.value,
          ] as string[]
        ).includes(revenu.nature),
      )
  ) {
    await driver.click("#revenu6");
  }

  if (
    revenus
      .flat()
      .some(
        (revenu) =>
          isRevenuMicroEntreprise(revenu) && revenu.versementLiberatoire,
      )
  ) {
    await driver.click("#revenu14");
  }

  if (
    revenus
      .flat()
      .some(
        (revenu) =>
          isRevenuMicroEntreprise(revenu) &&
          !revenu.versementLiberatoire &&
          (
            [
              NATURE_REVENU.microBICMarchandises.value,
              NATURE_REVENU.microBICServices.value,
            ] as string[]
          ).includes(revenu.nature),
      )
  ) {
    await driver.click("#revenu9");
  }

  if (
    revenus
      .flat()
      .some(
        (revenu) =>
          isRevenuMicroEntreprise(revenu) &&
          !revenu.versementLiberatoire &&
          revenu.nature === NATURE_REVENU.microBNC.value,
      )
  ) {
    await driver.click("#revenu11");
  }

  if (versementsAnnuelsPER.some((versementsAnnuels) => versementsAnnuels > 0)) {
    await driver.click("#charge1");
  }

  if (
    foyer.enfants.some((enfant) => enfant.scolarite != null) ||
    dons.some((don) => don.montantAnnuel > 0) ||
    foyer.emploisADomicile.some(
      (emploiADomicile) => emploiADomicile.remunerationAnnuelle > 0,
    )
  ) {
    await driver.click("#charge2");
  }

  await driver.click(".suite2");

  // p03

  if (await driver.isVisible("#p03")) {
    for (let i = 0; i < revenus.length; i++) {
      for (const revenu of revenus[i]!) {
        switch (revenu.nature) {
          case NATURE_REVENU.salaire.value:
            await driver.fill(["#B1AJ", "#B1BJ"][i]!, revenu.montantAnnuel);
            break;
          case NATURE_REVENU.remuneration.value:
            await driver.fill(["#B1GB", "#B1HB"][i]!, revenu.montantAnnuel);
            break;
        }
      }
    }

    await driver.click(".suite3");
  }

  // p04

  if (await driver.isVisible("#p04")) {
    for (let i = 0; i < revenus.length; i++) {
      for (const revenu of revenus[i]!) {
        switch (revenu.nature) {
          case NATURE_REVENU.pensionRetraite.value:
            await driver.fill(["#B1AS", "#B1BS"][i]!, revenu.montantAnnuel);
            break;
        }
      }
    }

    await driver.click(".suite4");
  }

  // p05

  // p06

  if (await driver.isVisible("#p06")) {
    for (const revenu of dedupeRevenus(revenus.flat())) {
      switch (revenu.nature) {
        case NATURE_REVENU.rcm.value:
          await driver.fill("#B2DC", revenu.montantAnnuel);
          break;
      }
    }

    if (foyer.impositionRCM === IMPOSITION_RCM.bareme.value) {
      await driver.click("#B2OP");
    }

    await driver.click(".suite6");
  }

  // p07

  // p08

  if (await driver.isVisible("#p08")) {
    for (const revenu of dedupeRevenus(revenus.flat())) {
      switch (revenu.nature) {
        case NATURE_REVENU.microFoncier.value:
          await driver.fill("#B4BE", revenu.montantAnnuel);
          break;
        case NATURE_REVENU.foncier.value:
          await driver.fill(
            revenu.montantAnnuel >= 0 ? "#B4BA" : "#B4EA",
            Math.abs(revenu.montantAnnuel),
          );
          break;
      }
    }

    await driver.click(".suite8");
  }

  // p09

  if (await driver.isVisible("#p09")) {
    for (let i = 0; i < revenus.length; i++) {
      for (const revenu of revenus[i]!) {
        if (!isRevenuMicroEntreprise(revenu) || !revenu.versementLiberatoire) {
          continue;
        }

        switch (revenu.nature) {
          case NATURE_REVENU.microBICMarchandises.value:
            await driver.fill(["#B5TA", "#B5UA"][i]!, revenu.montantAnnuel);
            break;
          case NATURE_REVENU.microBICServices.value:
            await driver.fill(["#B5TB", "#B5UB"][i]!, revenu.montantAnnuel);
            break;
          case NATURE_REVENU.microBNC.value:
            await driver.fill(["#B5TE", "#B5UE"][i]!, revenu.montantAnnuel);
            break;
        }
      }
    }

    await driver.click(".suite9");
  }

  // p10

  // p11

  if (await driver.isVisible("#p11")) {
    for (let i = 0; i < revenus.length; i++) {
      for (const revenu of revenus[i]!) {
        if (!isRevenuMicroEntreprise(revenu) || revenu.versementLiberatoire) {
          continue;
        }

        switch (revenu.nature) {
          case NATURE_REVENU.microBICMarchandises.value:
            await driver.fill(["#B5KO", "#B5LO"][i]!, revenu.montantAnnuel);
            break;
          case NATURE_REVENU.microBICServices.value:
            await driver.fill(["#B5KP", "#B5LP"][i]!, revenu.montantAnnuel);
            break;
        }
      }
    }

    await driver.click(".suite11");
  }

  // p12

  // p13

  if (await driver.isVisible("#p13")) {
    for (let i = 0; i < revenus.length; i++) {
      for (const revenu of revenus[i]!) {
        if (!isRevenuMicroEntreprise(revenu) || revenu.versementLiberatoire) {
          continue;
        }

        switch (revenu.nature) {
          case NATURE_REVENU.microBNC.value:
            await driver.fill(["#B5HQ", "#B5IQ"][i]!, revenu.montantAnnuel);
            break;
        }
      }
    }

    await driver.click(".suite13");
  }

  // p14

  // p15

  // p16

  if (await driver.isVisible("#p16")) {
    for (let i = 0; i < versementsAnnuelsPER.length; i++) {
      const versementAnnuelPER = versementsAnnuelsPER[i]!;

      if (versementAnnuelPER > 0) {
        await driver.fill(["#B6RS", "#B6RT"][i]!, versementAnnuelPER);

        const plafondDeduction = versementAnnuelPER;
        await driver.fill(["#BAPS", "#BAPT"][i]!, plafondDeduction);
      }
    }

    await driver.click(".suite16");
  }

  // p17

  if (await driver.isVisible("#p17")) {
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
      await driver.fill(
        "#B7EA",
        enfantsScolarises[SCOLARTIE_ENFANT.collegien.value],
      );
    }

    if (enfantsScolarises[SCOLARTIE_ENFANT.lyceen.value] > 0) {
      await driver.fill(
        "#B7EC",
        enfantsScolarises[SCOLARTIE_ENFANT.lyceen.value],
      );
    }

    if (enfantsScolarises[SCOLARTIE_ENFANT.etudiant.value] > 0) {
      await driver.fill(
        "#B7EF",
        enfantsScolarises[SCOLARTIE_ENFANT.etudiant.value],
      );
    }

    const donsGroupes = dons.reduce(
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
            await driver.fill("#B7UD", montantAnnuel);
            break;
          case NATURE_DON.utilitePublique.value:
            await driver.fill("#B7UF", montantAnnuel);
            break;
          case NATURE_DON.partisPolitiques.value:
            await driver.fill("#B7UH", montantAnnuel);
            break;
        }
      }
    }

    const remunerationAnnuelleDeductibleEmploiADomicile =
      calculerRemunerationAnnuelleDeductibleEmploiADomicile(foyer);
    if (remunerationAnnuelleDeductibleEmploiADomicile > 0) {
      await driver.fill("#B7DB", remunerationAnnuelleDeductibleEmploiADomicile);
    }

    await driver.click(".suite17");
  }

  // p18

  // pagePas

  await driver.click(".suitePAS");

  // p19

  await driver.click(".suite19");

  // résultat

  const ir =
    (await getNumberValue(`[name="IINETIR"]`)) ??
    (await getNumberValue(`[name="IRESTIR"]`))!;
  const ps = await getNumberValue(`[name="NAPCRP"]`);

  return { ir, ps };
}
