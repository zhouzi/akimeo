import z from "zod";

import type {
  BasePlacement,
  Placement,
  PlacementPEA,
  PlacementPER,
} from "./types";
import { ENVELOPPE_PLACEMENT } from "./constants";

export const basePlacementSchema = z.object({
  valeur: z.object({ versements: z.number(), plusValue: z.number() }),
  versementsAnnuels: z.number(),
  retraitsAnnuels: z.number(),
}) satisfies z.ZodType<BasePlacement>;

export const placementPERSchema = basePlacementSchema.extend({
  enveloppe: z.literal(ENVELOPPE_PLACEMENT.per.value),
  rendementAnnuel: z.number(),
}) satisfies z.ZodType<PlacementPER>;

export const placementPEASchema = basePlacementSchema.extend({
  enveloppe: z.literal(ENVELOPPE_PLACEMENT.pea.value),
  rendementAnnuel: z.number(),
}) satisfies z.ZodType<PlacementPEA>;

export const placementSchema = z.union([
  placementPERSchema,
  placementPEASchema,
]) satisfies z.ZodType<Placement>;
