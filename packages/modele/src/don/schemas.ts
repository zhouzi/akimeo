import z from "zod";

import type { Don } from "./types";
import { NATURE_DON } from "./constants";

export const donSchema = z.object({
  nature: z.enum([
    NATURE_DON.personnesEnDifficulte.value,
    NATURE_DON.utilitePublique.value,
    NATURE_DON.partisPolitiques.value,
  ]),
  montantAnnuel: z.number(),
}) satisfies z.ZodType<Don>;
