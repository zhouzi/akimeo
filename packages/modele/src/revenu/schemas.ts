import z from "zod";

import type { Revenu } from "./types";
import { NATURE_REVENU } from "./constants";

export const revenuSchema = z.object({
  nature: z.enum([
    NATURE_REVENU.salaire.value,
    NATURE_REVENU.remuneration.value,
    NATURE_REVENU.pensionRetraite.value,
    NATURE_REVENU.autre.value,
    NATURE_REVENU.bnc.value,
    NATURE_REVENU.microBNC.value,
    NATURE_REVENU.bic.value,
    NATURE_REVENU.microBICServices.value,
    NATURE_REVENU.microBICMarchandises.value,
    NATURE_REVENU.foncier.value,
    NATURE_REVENU.microFoncier.value,
    NATURE_REVENU.rcm.value,
  ]),
  montantAnnuel: z.number(),
}) satisfies z.ZodType<Revenu>;
