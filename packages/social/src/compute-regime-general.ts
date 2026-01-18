import type Engine from "publicodes";
import type { Entries } from "type-fest";
import type { Filter } from "type-fest/source/except";

import { evaluateEngine } from "./evaluate-engine";

export type RegimeGeneralOutput = Partial<{
  trimestresRetraite: true;
  cotisationsRetraite: true;
  retraiteBase: true;
  retraiteComplementaire: true;
}>;

export function computeRegimeGeneral<Output extends RegimeGeneralOutput>(
  engine: Engine,
  output: Output,
) {
  return (Object.entries(output) as Entries<typeof output>).reduce(
    (acc, [key]) => {
      switch (key) {
        case "trimestresRetraite":
          return Object.assign(acc, {
            [key]: evaluateEngine(
              engine,
              "protection sociale . retraite . trimestres",
            ),
          });
        case "cotisationsRetraite":
          return Object.assign(acc, {
            [key]: evaluateEngine(
              engine,
              "protection sociale . retraite . base . cotisée",
            ),
          });
        case "retraiteBase":
          return Object.assign(acc, {
            [key]: evaluateEngine(
              engine,
              "protection sociale . retraite . base",
            ),
          });
        case "retraiteComplementaire":
          return Object.assign(acc, {
            [key]: evaluateEngine(
              engine,
              "protection sociale . retraite . complémentaire",
            ),
          });
      }
    },
    {} as Record<
      Filter<keyof Output, Filter<keyof Output, keyof RegimeGeneralOutput>>,
      number
    >,
  );
}
