import z from "zod";

import type { AnyEntreprise, MicroEntreprise, Sarl } from "./types";
import { STATUT_ENTREPRISE } from "./constants";

export const anyEntrepriseSchema = z.object({
  statut: z.enum([
    STATUT_ENTREPRISE.microEntreprise.value,
    STATUT_ENTREPRISE.sarl.value,
  ]),
  acre: z.boolean(),
}) satisfies z.ZodType<AnyEntreprise>;

export const microEntrepriseSchema = anyEntrepriseSchema.extend({
  statut: z.literal(STATUT_ENTREPRISE.microEntreprise.value),
  versementLiberatoire: z.boolean(),
}) satisfies z.ZodType<MicroEntreprise>;

export const sarlSchema = anyEntrepriseSchema.extend({
  statut: z.literal(STATUT_ENTREPRISE.sarl.value),
}) satisfies z.ZodType<Sarl>;
