import z from "zod";

import type { EmploiADomicile } from "./types";
import { TYPE_EMPLOI_A_DOMICILE } from "./constants";

export const emploiADomicileSchema = z.object({
  type: z.enum([
    TYPE_EMPLOI_A_DOMICILE.assistanceInformatique.value,
    TYPE_EMPLOI_A_DOMICILE.jardinage.value,
    TYPE_EMPLOI_A_DOMICILE.menage.value,
    TYPE_EMPLOI_A_DOMICILE.petitBricolage.value,
  ]),
  remunerationAnnuelle: z.number(),
}) satisfies z.ZodType<EmploiADomicile>;
