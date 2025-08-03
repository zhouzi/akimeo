import z from "zod";

import type {
  BasePlacement,
  Placement,
  PlacementPEA,
  PlacementPER,
} from "./types";
import { ENVELOPPE_PLACEMENT } from "./constants";

export const basePlacementSchema = z.object({
  versementsAnnuels: z.number(),
}) satisfies z.ZodType<BasePlacement>;
export const placementPERSchema = basePlacementSchema.extend({
  enveloppe: z.literal(ENVELOPPE_PLACEMENT.per.value),
}) satisfies z.ZodType<PlacementPER>;
export const placementPEASchema = basePlacementSchema.extend({
  enveloppe: z.literal(ENVELOPPE_PLACEMENT.pea.value),
}) satisfies z.ZodType<PlacementPEA>;
export const placementSchema = z.union([
  placementPERSchema,
  placementPEASchema,
]) satisfies z.ZodType<Placement>;
