import { oc } from "@orpc/contract";
import z from "zod";

import { aliasSchema } from "~/schemas/alias";
import { declarationSchema } from "~/schemas/declaration";
import { simulationOutputSchema } from "~/schemas/simulation-output";

export const contract = {
  createSimulation: oc
    .route({
      method: "POST",
      path: "/2026/simulations",
    })
    .input(aliasSchema)
    .output(simulationOutputSchema),

  createSimulationParCodes: oc
    .route({
      method: "POST",
      path: "/2026/simulations/par-codes",
    })
    .input(declarationSchema)
    .output(simulationOutputSchema),

  getSimulation: oc
    .route({
      method: "GET",
      path: "/simulations/{id}",
    })
    .input(z.object({ id: z.string() }))
    .output(simulationOutputSchema),
};
