import type { PartialDeep } from "type-fest";
import defaultsDeep from "lodash.defaultsdeep";
import z from "zod";

export const ENVELOPPE_PLACEMENT = {
  per: {
    label: "PER",
    value: "per" as const,
  },
  pea: {
    label: "PEA",
    value: "pea" as const,
  },
};

interface BasePlacement {
  versementsAnnuels: number;
}
const basePlacementSchema = z.object({
  versementsAnnuels: z.number(),
}) satisfies z.ZodType<BasePlacement>;

interface PlacementPER extends BasePlacement {
  enveloppe: typeof ENVELOPPE_PLACEMENT.per.value;
}
const placementPERSchema = basePlacementSchema.extend({
  enveloppe: z.literal(ENVELOPPE_PLACEMENT.per.value),
}) satisfies z.ZodType<PlacementPER>;

interface PlacementPEA extends BasePlacement {
  enveloppe: typeof ENVELOPPE_PLACEMENT.pea.value;
}
const placementPEASchema = basePlacementSchema.extend({
  enveloppe: z.literal(ENVELOPPE_PLACEMENT.pea.value),
}) satisfies z.ZodType<PlacementPEA>;

export type Placement = PlacementPER | PlacementPEA;

export const placementSchema = z.union([
  placementPERSchema,
  placementPEASchema,
]) satisfies z.ZodType<Placement>;

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
