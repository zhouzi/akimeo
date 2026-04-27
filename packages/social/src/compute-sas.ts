import type { Foyer } from "@akimeo/modele";
import type { SAS } from "@akimeo/modele/entreprise/types";

import type { EngineAS } from "./modele-as/create-engine-as";
import type { ASInput } from "./modele-as/create-situation-as";
import type { ASOutput } from "./modele-as/evaluate-as";
import { setEngineSituation } from "./helpers/set-engine-situation";
import { createSituationAS } from "./modele-as/create-situation-as";
import { evaluateAS } from "./modele-as/evaluate-as";

export type SASInput = ASInput;

export type SASOutput = ASOutput;

export function computeSAS<Output extends SASOutput>(
  engine: EngineAS,
  foyer: Foyer,
  sas: SAS,
  input: SASInput,
  output: Output,
) {
  setEngineSituation(engine, {
    ...createSituationAS(foyer, sas, input),
  });
  return evaluateAS(engine, foyer, sas, output);
}
