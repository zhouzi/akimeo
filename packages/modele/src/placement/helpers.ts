import type { PartialDeep } from "type-fest";
import defaultsDeep from "lodash.defaultsdeep";

import type {
  Placement,
  PlacementPEA,
  PlacementPER,
  ValeurPlacement,
} from "./types";
import { ENVELOPPE_PLACEMENT, ENVELOPPE_PLACEMENT_OPTIONS } from "./constants";
import { placementPEASchema, placementPERSchema } from "./schemas";

export function creerPlacement<T extends Placement["enveloppe"]>(
  placement: { enveloppe: T } & PartialDeep<
    Extract<Placement, { enveloppe: T }>
  >,
) {
  switch (placement.enveloppe) {
    case ENVELOPPE_PLACEMENT.pea.value:
      return placementPEASchema.parse(
        defaultsDeep({}, placement, {
          enveloppe: ENVELOPPE_PLACEMENT.pea.value,
          valeur: { versements: 0, plusValue: 0 },
          versementsAnnuels: 0,
          retraitsAnnuels: 0,
          rendementAnnuel: 0,
        } satisfies PlacementPEA),
      ) as Extract<Placement, { enveloppe: T }>;
    case ENVELOPPE_PLACEMENT.per.value:
      return placementPERSchema.parse(
        defaultsDeep({}, placement, {
          enveloppe: ENVELOPPE_PLACEMENT.per.value,
          valeur: { versements: 0, plusValue: 0 },
          versementsAnnuels: 0,
          retraitsAnnuels: 0,
          rendementAnnuel: 0,
        } satisfies PlacementPER),
      ) as Extract<Placement, { enveloppe: T }>;
  }
}

function soustraireRetraits<T extends Placement>(placement: T): T {
  const valeurTotale = placement.valeur.versements + placement.valeur.plusValue;
  const versementsRatio =
    valeurTotale > 0 ? placement.valeur.versements / valeurTotale : 0;
  const plusValueRatio =
    valeurTotale > 0 ? placement.valeur.plusValue / valeurTotale : 0;

  return {
    ...placement,
    valeur: {
      versements: Math.max(
        0,
        placement.valeur.versements -
          placement.retraitsAnnuels * versementsRatio,
      ),
      plusValue: Math.max(
        0,
        placement.valeur.plusValue - placement.retraitsAnnuels * plusValueRatio,
      ),
    },
  };
}

function ajouterVersements<T extends Placement>(placement: T): T {
  const enveloppe = ENVELOPPE_PLACEMENT_OPTIONS.find(
    (otherEnveloppe) => otherEnveloppe.value === placement.enveloppe,
  )!;
  const plafond = enveloppe.plafond ?? Infinity;

  return {
    ...placement,
    valeur: {
      ...placement.valeur,
      versements: Math.min(
        plafond,
        placement.valeur.versements + placement.versementsAnnuels,
      ),
    },
  };
}

function ajouterPlusValue<T extends Placement>(placement: T): T {
  const valeurTotale = placement.valeur.versements + placement.valeur.plusValue;

  return {
    ...placement,
    valeur: {
      ...placement.valeur,
      plusValue:
        placement.valeur.plusValue + valeurTotale * placement.rendementAnnuel,
    },
  };
}

export function projeterPlacement<T extends Placement>(placement: T): T {
  return soustraireRetraits(ajouterVersements(ajouterPlusValue(placement)));
}

export function calculerContributionPlacement<T extends Placement>(
  placement: T,
): ValeurPlacement {
  const valeurPrecedente = placement.valeur;
  placement = projeterPlacement(placement);

  return {
    versements: placement.valeur.versements - valeurPrecedente.versements,
    plusValue: placement.valeur.plusValue - valeurPrecedente.plusValue,
  };
}
