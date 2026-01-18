import z from "zod";

import type {
  AnyPoste,
  AnySalarie,
  Apprenti,
  Salarie,
  Stagiaire,
} from "./types";
import { CONTRAT_POSTE } from "./constants";

const basePosteSchema = z.object({
  contrat: z.enum([
    CONTRAT_POSTE.cdi.value,
    CONTRAT_POSTE.cdd.value,
    CONTRAT_POSTE.apprentissage.value,
    CONTRAT_POSTE.professionnalisation.value,
    CONTRAT_POSTE.stage.value,
  ]),
});

export const salarieSchema = basePosteSchema.extend({
  contrat: z.enum([CONTRAT_POSTE.cdi.value, CONTRAT_POSTE.cdd.value]),
}) satisfies z.ZodType<Salarie>;

export const apprentiSchema = basePosteSchema.extend({
  contrat: z.enum([
    CONTRAT_POSTE.apprentissage.value,
    CONTRAT_POSTE.professionnalisation.value,
  ]),
}) satisfies z.ZodType<Apprenti>;

export const anySalarieSchema = z.union([
  salarieSchema,
  apprentiSchema,
]) satisfies z.ZodType<AnySalarie>;

export const stagiaireSchema = basePosteSchema.extend({
  contrat: z.literal(CONTRAT_POSTE.stage.value),
}) satisfies z.ZodType<Stagiaire>;

export const anyPosteSchema = z.union([
  anySalarieSchema,
  stagiaireSchema,
]) satisfies z.ZodType<AnyPoste>;
