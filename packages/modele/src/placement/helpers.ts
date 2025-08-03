import type { PartialDeep } from "type-fest";
import defaultsDeep from "lodash.defaultsdeep";

import type { Placement } from "./types";
import { ENVELOPPE_PLACEMENT } from "./constants";
import { placementSchema } from "./schemas";

export function creerPlacement(placement: PartialDeep<Placement>): Placement {
  switch (placement.enveloppe) {
    case ENVELOPPE_PLACEMENT.pea.value:
    case ENVELOPPE_PLACEMENT.per.value:
    default:
      return placementSchema.parse(
        defaultsDeep({}, placement, {
          enveloppe: ENVELOPPE_PLACEMENT.pea.value,
          versementsAnnuels: 0,
        } satisfies Placement),
      );
  }
}
