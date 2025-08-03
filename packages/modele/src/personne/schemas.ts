import z from "zod";

import type { Adulte, Enfant, Personne } from "./types";
import { donSchema } from "~/don/schemas";
import { placementSchema } from "~/placement/schemas";
import { revenuSchema } from "~/revenu/schemas";
import { SCOLARTIE_ENFANT } from "./constants";

export const personneSchema = z.object({
  dateNaissance: z.date(),
}) satisfies z.ZodType<Personne>;

export const enfantSchema = personneSchema.extend({
  scolarite: z
    .enum([
      SCOLARTIE_ENFANT.collegien.value,
      SCOLARTIE_ENFANT.lyceen.value,
      SCOLARTIE_ENFANT.etudiant.value,
    ])
    .nullable(),
  fraisDeGarde: z.number().nullable(),
}) satisfies z.ZodType<Enfant>;

export const adulteSchema = personneSchema.extend({
  revenus: z.array(revenuSchema),
  placements: z.array(placementSchema),
  dons: z.array(donSchema),
  versementLiberatoire: z.boolean(),
}) satisfies z.ZodType<Adulte>;
