import z from "zod";

import type {
  BaseFoyer,
  Foyer,
  FoyerCelibataire,
  FoyerConcubinage,
  FoyerCouple,
  FoyerDivorce,
  FoyerMarie,
  FoyerPacse,
  FoyerVeuf,
} from "./types";
import { emploiADomicileSchema } from "~/emploi-a-domicile/schemas";
import { adulteSchema, enfantSchema } from "~/personne/schemas";
import { IMPOSITION_RCM, SITUATION_FAMILIALE } from "./constants";

export const baseFoyerSchema = z.object({
  situationFamiliale: z.enum([
    SITUATION_FAMILIALE.celibataire.value,
    SITUATION_FAMILIALE.divorce.value,
    SITUATION_FAMILIALE.veuf.value,
    SITUATION_FAMILIALE.concubinage.value,
    SITUATION_FAMILIALE.marie.value,
    SITUATION_FAMILIALE.pacse.value,
  ]),
  declarant1: adulteSchema,
  declarant2: z.literal(undefined),
  enfants: z.array(enfantSchema),
  impositionRCM: z.enum([
    IMPOSITION_RCM.bareme.value,
    IMPOSITION_RCM.pfu.value,
  ]),
  emploisADomicile: z.array(emploiADomicileSchema),
}) satisfies z.ZodType<
  BaseFoyer<
    | typeof SITUATION_FAMILIALE.celibataire.value
    | typeof SITUATION_FAMILIALE.divorce.value
    | typeof SITUATION_FAMILIALE.veuf.value
    | typeof SITUATION_FAMILIALE.concubinage.value
    | typeof SITUATION_FAMILIALE.marie.value
    | typeof SITUATION_FAMILIALE.pacse.value
  >
>;

export const foyerCelibataireSchema = baseFoyerSchema.extend({
  situationFamiliale: z.literal(SITUATION_FAMILIALE.celibataire.value),
  declarant2: z.literal(undefined),
}) satisfies z.ZodType<FoyerCelibataire>;

export const foyerDivorceSchema = baseFoyerSchema.extend({
  situationFamiliale: z.literal(SITUATION_FAMILIALE.divorce.value),
  declarant2: z.literal(undefined),
}) satisfies z.ZodType<FoyerDivorce>;

export const foyerVeufSchema = baseFoyerSchema.extend({
  situationFamiliale: z.literal(SITUATION_FAMILIALE.veuf.value),
  declarant2: z.literal(undefined),
}) satisfies z.ZodType<FoyerVeuf>;

export const foyerConcubinageSchema = baseFoyerSchema.extend({
  situationFamiliale: z.literal(SITUATION_FAMILIALE.concubinage.value),
  declarant2: adulteSchema,
}) satisfies z.ZodType<FoyerConcubinage>;

export const foyerPacseSchema = baseFoyerSchema.extend({
  situationFamiliale: z.literal(SITUATION_FAMILIALE.pacse.value),
  declarant2: adulteSchema,
}) satisfies z.ZodType<FoyerPacse>;

export const foyerMarieSchema = baseFoyerSchema.extend({
  situationFamiliale: z.literal(SITUATION_FAMILIALE.marie.value),
  declarant2: adulteSchema,
}) satisfies z.ZodType<FoyerMarie>;

export const foyerCoupleSchema = z.union([
  foyerPacseSchema,
  foyerMarieSchema,
]) satisfies z.ZodType<FoyerCouple>;

export const foyerSchema = z.union([
  foyerCelibataireSchema,
  foyerDivorceSchema,
  foyerVeufSchema,
  foyerConcubinageSchema,
  foyerPacseSchema,
  foyerMarieSchema,
]) satisfies z.ZodType<Foyer>;
