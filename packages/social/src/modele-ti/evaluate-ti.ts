import type { EI, Sarl } from "@akimeo/modele/entreprise/types";
import type { Foyer } from "@akimeo/modele/foyer/types";
import type { Entries, Exact } from "type-fest";
import type { Filter } from "type-fest/source/except";
import { calculerIR } from "@akimeo/fiscal";
import { creerRevenuEntreprise } from "@akimeo/modele/entreprise/helpers";

import type { EngineTI } from "./create-engine-ti";
import { evaluateEngine } from "../helpers/evaluate-engine";

export type TIOutput = Partial<{
  chiffreAffaires: true;
  cotisations: true;
  remunerationNetteImposable: true;
  remunerationNetteAvantImpot: true;
  ir: true;
}>;

export function evaluateTI<Output extends TIOutput>(
  engine: EngineTI,
  foyer: Foyer,
  entreprise: EI | Sarl,
  output: Exact<TIOutput, Output>,
) {
  return (Object.entries(output) as Entries<typeof output>).reduce(
    (acc, [key]) => {
      switch (key) {
        case "chiffreAffaires":
          return Object.assign(acc, {
            [key]: evaluateEngine(engine, "entreprise . chiffre d'affaires"),
          });
        case "cotisations":
          return Object.assign(acc, {
            [key]: evaluateEngine(
              engine,
              "indépendant . cotisations et contributions",
            ),
          });
        case "remunerationNetteImposable":
          return Object.assign(acc, {
            [key]: evaluateEngine(
              engine,
              "indépendant . rémunération . nette . imposable",
            ),
          });
        case "remunerationNetteAvantImpot":
          return Object.assign(acc, {
            [key]: evaluateEngine(engine, "indépendant . rémunération . nette"),
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
                      "indépendant . rémunération . nette . imposable",
                    ),
                  ),
                ],
              },
            }),
          });
        default:
          // eslint-disable-next-line no-console
          console.warn(`Unsupported output: "${String(key)}"`);
          return acc;
      }
    },
    {} as Record<
      Filter<keyof Output, Filter<keyof Output, keyof TIOutput>>,
      number
    >,
  );
}
