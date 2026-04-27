import type { Foyer } from "@akimeo/modele";
import type { SAS } from "@akimeo/modele/entreprise/types";
import type { Entries } from "type-fest";
import type { Filter } from "type-fest/source/except";
import { calculerIR } from "@akimeo/fiscal";
import { creerRevenuEntreprise } from "@akimeo/modele/entreprise/helpers";

import type { EngineAS } from "./create-engine-as";
import { evaluateEngine } from "../helpers/evaluate-engine";

export type ASOutput = Partial<{
  remunerationTotale: true;
  cotisations: true;
  remunerationNetteAvantImpot: true;
  ir: true;
}>;

export function evaluateAS<Output extends ASOutput>(
  engine: EngineAS,
  foyer: Foyer,
  entreprise: SAS,
  output: Output,
) {
  return (Object.entries(output) as Entries<typeof output>).reduce(
    (acc, [key]) => {
      switch (key) {
        case "remunerationTotale":
          return Object.assign(acc, {
            [key]: evaluateEngine(
              engine,
              "assimilé salarié . rémunération . totale",
            ),
          });
        case "cotisations":
          return Object.assign(acc, {
            [key]: evaluateEngine(engine, "assimilé salarié . cotisations"),
          });
        case "remunerationNetteAvantImpot":
          return Object.assign(acc, {
            [key]: evaluateEngine(
              engine,
              "assimilé salarié . rémunération . nette . à payer avant impôt",
            ),
          });
        case "ir":
          return Object.assign(acc, {
            [key]: calculerIR({
              ...foyer,
              declarant1: {
                ...foyer.declarant1,
                revenus: [
                  ...foyer.declarant1.revenus,
                  creerRevenuEntreprise(
                    entreprise,
                    evaluateEngine(
                      engine,
                      "assimilé salarié . rémunération . nette . imposable",
                    ),
                  ),
                ],
              },
            }),
          });
      }
    },
    {} as Record<
      Filter<keyof Output, Filter<keyof Output, keyof ASOutput>>,
      number
    >,
  );
}
