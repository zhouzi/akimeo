import type { ENVELOPPE_PLACEMENT } from "./constants";

export interface ValeurPlacement {
  versements: number;
  plusValue: number;
}

export interface BasePlacement {
  valeur: ValeurPlacement;
  versementsAnnuels: number;
  retraitsAnnuels: number;
}

export interface PlacementPER extends BasePlacement {
  enveloppe: typeof ENVELOPPE_PLACEMENT.per.value;
  rendementAnnuel: number;
}

export interface PlacementPEA extends BasePlacement {
  enveloppe: typeof ENVELOPPE_PLACEMENT.pea.value;
  rendementAnnuel: number;
}

export type Placement = PlacementPER | PlacementPEA;
