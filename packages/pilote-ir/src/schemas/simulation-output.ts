import z from "zod";

import { declarationSchema } from "./declaration";

const resultatSchema = z.object({
  impotAvantCreditsDimpots: z.number(),
  droitsSimples: z.number(),
  montantRestantAPayer: z.number(),
  impotSurLeRevenuNet: z.number(),
  montantQuiVousSeraRembourse: z.number(),
  montantNetDesPrelevementsSociaux: z.number(),
  nombreDeParts: z.number(),
  revenuFiscalDeReference: z.number(),
  revenuNetImposableOuDeficitAReporter: z.number(),
  revenuBrutGlobalOuDeficit: z.number(),
});

export const simulationOutputSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  declaration: declarationSchema,
  resultat: resultatSchema.nullable(),
  urlPdf: z.url(),
  urlResultat: z.url(),
});

export type SimulationOutput = z.infer<typeof simulationOutputSchema>;
