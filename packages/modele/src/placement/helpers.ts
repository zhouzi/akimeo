import type { PartialDeep } from "type-fest";
import defaultsDeep from "lodash.defaultsdeep";

import type { Placement, PlacementPEA, PlacementPER } from "./types";
import { ENVELOPPE_PLACEMENT } from "./constants";
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
          versementsAnnuels: 0,
        } satisfies PlacementPEA),
      ) as Extract<Placement, { enveloppe: T }>;
    case ENVELOPPE_PLACEMENT.per.value:
      return placementPERSchema.parse(
        defaultsDeep({}, placement, {
          enveloppe: ENVELOPPE_PLACEMENT.per.value,
          versementsAnnuels: 0,
        } satisfies PlacementPER),
      ) as Extract<Placement, { enveloppe: T }>;
  }
}
