import z from "zod";

import type {
  BasePlacement,
  Placement,
  PlacementPEA,
  PlacementPER,
  ValeurPlacement,
} from "./types";
import { ENVELOPPE_PLACEMENT } from "./constants";

const valeurPlacementSchema = z.object({
  versements: z.number(),
  plusValue: z.number(),
}) satisfies z.ZodType<ValeurPlacement>;

export const basePlacementSchema = z.object({
  valeur: valeurPlacementSchema,
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
