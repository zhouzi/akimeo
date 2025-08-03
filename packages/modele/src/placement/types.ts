import type { ENVELOPPE_PLACEMENT } from "./constants";

export interface BasePlacement {
  versementsAnnuels: number;
}

export interface PlacementPER extends BasePlacement {
  enveloppe: typeof ENVELOPPE_PLACEMENT.per.value;
}

export interface PlacementPEA extends BasePlacement {
  enveloppe: typeof ENVELOPPE_PLACEMENT.pea.value;
}

export type Placement = PlacementPER | PlacementPEA;
