import z from "zod";

import type { AnyEntreprise, MicroEntreprise, Sarl } from "./types";
import { NATURE_ACTIVITE_ENTREPRISE, STATUT_ENTREPRISE } from "./constants";

export const anyEntrepriseSchema = z.object({
  statut: z.enum([
    STATUT_ENTREPRISE.microEntreprise.value,
    STATUT_ENTREPRISE.sarl.value,
  ]),
  natureActivite: z.enum([
    NATURE_ACTIVITE_ENTREPRISE.agricole.value,
    NATURE_ACTIVITE_ENTREPRISE.artisanale.value,
    NATURE_ACTIVITE_ENTREPRISE.commerciale.value,
    NATURE_ACTIVITE_ENTREPRISE.commercialeMarchandises.value,
    NATURE_ACTIVITE_ENTREPRISE.commercialeServices.value,
    NATURE_ACTIVITE_ENTREPRISE.liberale.value,
  ]),
  acre: z.boolean(),
}) satisfies z.ZodType<AnyEntreprise>;

export const microEntrepriseSchema = anyEntrepriseSchema.extend({
  statut: z.literal(STATUT_ENTREPRISE.microEntreprise.value),
  natureActivite: z.enum([
    NATURE_ACTIVITE_ENTREPRISE.artisanale.value,
    NATURE_ACTIVITE_ENTREPRISE.commercialeMarchandises.value,
    NATURE_ACTIVITE_ENTREPRISE.commercialeServices.value,
    NATURE_ACTIVITE_ENTREPRISE.liberale.value,
  ]),
  versementLiberatoire: z.boolean(),
}) satisfies z.ZodType<MicroEntreprise>;

export const sarlSchema = anyEntrepriseSchema.extend({
  statut: z.literal(STATUT_ENTREPRISE.sarl.value),
}) satisfies z.ZodType<Sarl>;
