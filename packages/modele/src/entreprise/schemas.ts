import z from "zod";

import type { AnyEntreprise, EI, MicroEntreprise, Sarl, SAS } from "./types";
import { NATURE_ACTIVITE_ENTREPRISE, STATUT_ENTREPRISE } from "./constants";

const baseEntrepriseSchema = z.object({
  acre: z.boolean(),
  tva: z.boolean(),
});

export const microEntrepriseSchema = baseEntrepriseSchema.extend({
  statut: z.literal(STATUT_ENTREPRISE.microEntreprise.value),
  natureActivite: z.enum([
    NATURE_ACTIVITE_ENTREPRISE.artisanale.value,
    NATURE_ACTIVITE_ENTREPRISE.commercialeMarchandises.value,
    NATURE_ACTIVITE_ENTREPRISE.commercialeServices.value,
    NATURE_ACTIVITE_ENTREPRISE.liberale.value,
  ]),
  versementLiberatoire: z.boolean(),
}) satisfies z.ZodType<MicroEntreprise>;

export const eiSchema = baseEntrepriseSchema.extend({
  statut: z.literal(STATUT_ENTREPRISE.ei.value),
  natureActivite: z.enum([
    NATURE_ACTIVITE_ENTREPRISE.artisanale.value,
    NATURE_ACTIVITE_ENTREPRISE.commerciale.value,
    NATURE_ACTIVITE_ENTREPRISE.liberale.value,
  ]),
}) satisfies z.ZodType<EI>;

export const sarlSchema = baseEntrepriseSchema.extend({
  statut: z.literal(STATUT_ENTREPRISE.sarl.value),
  natureActivite: z.enum([
    NATURE_ACTIVITE_ENTREPRISE.artisanale.value,
    NATURE_ACTIVITE_ENTREPRISE.commerciale.value,
    NATURE_ACTIVITE_ENTREPRISE.liberale.value,
  ]),
}) satisfies z.ZodType<Sarl>;

export const sasSchema = baseEntrepriseSchema.extend({
  statut: z.literal(STATUT_ENTREPRISE.sas.value),
  natureActivite: z.enum([
    NATURE_ACTIVITE_ENTREPRISE.artisanale.value,
    NATURE_ACTIVITE_ENTREPRISE.commerciale.value,
    NATURE_ACTIVITE_ENTREPRISE.liberale.value,
  ]),
}) satisfies z.ZodType<SAS>;

export const anyEntrepriseSchema = z.union([
  microEntrepriseSchema,
  eiSchema,
  sarlSchema,
  sasSchema,
]) satisfies z.ZodType<AnyEntreprise>;
