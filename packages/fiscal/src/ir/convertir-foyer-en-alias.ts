import type { Adulte, Don, Foyer } from "@akimeo/modele";
import type { Alias } from "@akimeo/pilote-ir/schemas/alias";
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

import { calculerRemunerationAnnuelleDeductibleEmploiADomicile } from "~/ir/calculer-remuneration-annuelle-deductible-emploi-a-domicile";
import { dedupeRevenus } from "~/ir/dedupe-revenus";

const SITUATION_FAMILIALE_TO_ALIAS = {
  [SITUATION_FAMILIALE.marie.value]: "M",
  [SITUATION_FAMILIALE.pacse.value]: "O",
  [SITUATION_FAMILIALE.celibataire.value]: "C",
  [SITUATION_FAMILIALE.concubinage.value]: "C",
  [SITUATION_FAMILIALE.divorce.value]: "D",
  [SITUATION_FAMILIALE.veuf.value]: "V",
} as const satisfies Record<Foyer["situationFamiliale"], string>;

export function convertirFoyerEnAlias(foyer: Foyer): Alias {
  const declarants = [
    foyer.declarant1,
    ...(isFoyerCouple(foyer) ? [foyer.declarant2] : []),
  ] as [Adulte] | [Adulte, Adulte];

  const alias: Alias = {
    etatCivil: {
      situationFamiliale:
        SITUATION_FAMILIALE_TO_ALIAS[foyer.situationFamiliale],
      anneeNaissance: {
        declarant1: foyer.declarant1.dateNaissance.getFullYear(),
        ...(isFoyerCouple(foyer) && {
          declarant2: foyer.declarant2.dateNaissance.getFullYear(),
        }),
      },
      personnesACharge:
        foyer.enfants.length > 0
          ? {
              enfants: {
                nombre: foyer.enfants.length,
                anneesNaissance: foyer.enfants
                  .slice(0, 6)
                  .map((e) => e.dateNaissance.getFullYear()),
              },
            }
          : undefined,
    },
    revenus: {},
    charges: {},
    reductionsCredits: {},
  };

  // Revenus par déclarant
  for (let i = 0; i < declarants.length; i++) {
    const declarant = declarants[i]!;
    const d = i === 0 ? "declarant1" : "declarant2";

    for (const revenu of dedupeRevenus(declarant.revenus)) {
      switch (revenu.nature) {
        case NATURE_REVENU.salaire.value:
          alias.revenus!.traitementsSalaires ??= {};
          alias.revenus!.traitementsSalaires.activite ??= {};
          alias.revenus!.traitementsSalaires.activite[d] = revenu.montantAnnuel;
          break;
        case NATURE_REVENU.remuneration.value:
          alias.revenus!.traitementsSalaires ??= {};
          alias.revenus!.traitementsSalaires.associesGerantsArt62 ??= {};
          alias.revenus!.traitementsSalaires.associesGerantsArt62[d] =
            revenu.montantAnnuel;
          break;
        case NATURE_REVENU.pensionRetraite.value:
          alias.revenus!.pensionsRetraitesRentes ??= {};
          alias.revenus!.pensionsRetraitesRentes.total ??= {};
          alias.revenus!.pensionsRetraitesRentes.total[d] =
            revenu.montantAnnuel;
          break;
      }

      // Micro-entreprise avec versement libératoire
      if (
        declarant.versementLiberatoire &&
        isNatureRevenuMicroEntreprise(revenu.nature)
      ) {
        alias.revenus!.microVL ??= {};
        switch (revenu.nature) {
          case NATURE_REVENU.microBICMarchandises.value:
            alias.revenus!.microVL.bic ??= {};
            alias.revenus!.microVL.bic.ventesMarchandises ??= {};
            alias.revenus!.microVL.bic.ventesMarchandises[d] =
              revenu.montantAnnuel;
            break;
          case NATURE_REVENU.microBICServices.value:
            alias.revenus!.microVL.bic ??= {};
            alias.revenus!.microVL.bic.prestationsServicesMeublees ??= {};
            alias.revenus!.microVL.bic.prestationsServicesMeublees[d] =
              revenu.montantAnnuel;
            break;
          case NATURE_REVENU.microBNC.value:
            alias.revenus!.microVL.bnc ??= {};
            alias.revenus!.microVL.bnc[d] = revenu.montantAnnuel;
            break;
        }
      }

      // Micro-entreprise sans versement libératoire
      if (
        !declarant.versementLiberatoire &&
        isNatureRevenuMicroEntreprise(revenu.nature)
      ) {
        switch (revenu.nature) {
          case NATURE_REVENU.microBICMarchandises.value:
            alias.revenus!.bicPro ??= {};
            alias.revenus!.bicPro.micro ??= {};
            alias.revenus!.bicPro.micro.ventesMarchandises ??= {};
            alias.revenus!.bicPro.micro.ventesMarchandises[d] =
              revenu.montantAnnuel;
            break;
          case NATURE_REVENU.microBICServices.value:
            alias.revenus!.bicPro ??= {};
            alias.revenus!.bicPro.micro ??= {};
            alias.revenus!.bicPro.micro.prestationsServicesMeublees ??= {};
            alias.revenus!.bicPro.micro.prestationsServicesMeublees[d] =
              revenu.montantAnnuel;
            break;
          case NATURE_REVENU.microBNC.value:
            alias.revenus!.bncPro ??= {};
            alias.revenus!.bncPro.micro ??= {};
            alias.revenus!.bncPro.micro.imposables ??= {};
            alias.revenus!.bncPro.micro.imposables[d] = revenu.montantAnnuel;
            break;
        }
      }
    }

    // PER
    const versementAnnuelPER = declarant.placements.reduce(
      (acc, placement) =>
        placement.enveloppe === ENVELOPPE_PLACEMENT.per.value
          ? acc + calculerContributionPlacement(placement).versements
          : acc,
      0,
    );

    if (versementAnnuelPER > 0) {
      alias.charges!.epargneRetraite ??= {};
      alias.charges!.epargneRetraite.cotisationsPerp ??= {};
      alias.charges!.epargneRetraite.cotisationsPerp[d] = versementAnnuelPER;
      alias.charges!.epargneRetraite.plafondDeduction ??= {};
      alias.charges!.epargneRetraite.plafondDeduction[d] = versementAnnuelPER;
    }
  }

  // RCM (tous déclarants confondus)
  const rcm = dedupeRevenus(declarants.flatMap((d) => d.revenus)).find(
    (r) => r.nature === NATURE_REVENU.rcm.value,
  );

  if (rcm) {
    alias.revenus!.rcm ??= {};
    alias.revenus!.rcm.avecAbattement ??= {};
    alias.revenus!.rcm.avecAbattement.actionsParts = rcm.montantAnnuel;

    if (foyer.impositionRCM === IMPOSITION_RCM.bareme.value) {
      alias.revenus!.rcm.optionBareme = true;
    }
  }

  // Foncier (tous déclarants confondus)
  for (const revenu of dedupeRevenus(declarants.flatMap((d) => d.revenus))) {
    switch (revenu.nature) {
      case NATURE_REVENU.microFoncier.value:
        alias.revenus!.fonciers ??= {};
        alias.revenus!.fonciers.micro ??= {};
        alias.revenus!.fonciers.micro.recettes = revenu.montantAnnuel;
        break;
      case NATURE_REVENU.foncier.value:
        alias.revenus!.fonciers ??= {};
        if (revenu.montantAnnuel >= 0) {
          alias.revenus!.fonciers.regimeReel ??= {};
          alias.revenus!.fonciers.regimeReel.imposables = revenu.montantAnnuel;
        } else {
          alias.revenus!.fonciers.deficitFoncier = Math.abs(
            revenu.montantAnnuel,
          );
        }
        break;
    }
  }

  // Enfants scolarisés
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
    alias.reductionsCredits!.enfantsEtudes ??= {};
    alias.reductionsCredits!.enfantsEtudes.college =
      enfantsScolarises[SCOLARTIE_ENFANT.collegien.value];
  }
  if (enfantsScolarises[SCOLARTIE_ENFANT.lyceen.value] > 0) {
    alias.reductionsCredits!.enfantsEtudes ??= {};
    alias.reductionsCredits!.enfantsEtudes.lycee =
      enfantsScolarises[SCOLARTIE_ENFANT.lyceen.value];
  }
  if (enfantsScolarises[SCOLARTIE_ENFANT.etudiant.value] > 0) {
    alias.reductionsCredits!.enfantsEtudes ??= {};
    alias.reductionsCredits!.enfantsEtudes.superieur =
      enfantsScolarises[SCOLARTIE_ENFANT.etudiant.value];
  }

  // Frais de garde
  const enfantsAvecFraisDeGarde = foyer.enfants.filter(
    (enfant) =>
      typeof enfant.fraisDeGarde === "number" &&
      differenceInYears(new Date(), enfant.dateNaissance) <= 6,
  );
  const fraisDeGardeKeys = [
    "premierEnfant",
    "deuxiemeEnfant",
    "troisiemeEnfant",
  ] as const;
  for (let i = 0; i < Math.min(enfantsAvecFraisDeGarde.length, 3); i++) {
    alias.reductionsCredits!.fraisGardeEnfants ??= {};
    alias.reductionsCredits!.fraisGardeEnfants[fraisDeGardeKeys[i]!] =
      enfantsAvecFraisDeGarde[i]!.fraisDeGarde!;
  }

  // Dons
  const donsGroupes = declarants
    .flatMap((d) => d.dons)
    .reduce<Partial<Record<Don["nature"], number>>>((acc, don) => {
      acc[don.nature] = (acc[don.nature] ?? 0) + don.montantAnnuel;
      return acc;
    }, {});

  for (const [nature, montantAnnuel] of Object.entries(donsGroupes)) {
    if (montantAnnuel > 0) {
      alias.reductionsCredits!.dons ??= {};
      alias.reductionsCredits!.dons.france ??= {};
      switch (nature) {
        case NATURE_DON.personnesEnDifficulte.value:
          alias.reductionsCredits!.dons.france.personnesEnDifficulte31122025 =
            montantAnnuel;
          break;
        case NATURE_DON.utilitePublique.value:
          alias.reductionsCredits!.dons.france.oeuvresUtilitePublique =
            montantAnnuel;
          break;
        case NATURE_DON.partisPolitiques.value:
          alias.reductionsCredits!.dons.france.partisPoliques = montantAnnuel;
          break;
      }
    }
  }

  // Emploi à domicile
  const remunerationDeductible =
    calculerRemunerationAnnuelleDeductibleEmploiADomicile(foyer);
  if (remunerationDeductible > 0) {
    alias.reductionsCredits!.servicePersonne ??= {};
    alias.reductionsCredits!.servicePersonne.sommesVersees =
      remunerationDeductible;
  }

  return alias;
}
