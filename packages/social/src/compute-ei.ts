import type { Foyer } from "@akimeo/modele";
import type { EI } from "@akimeo/modele/entreprise/types";

import type { EngineTI } from "./modele-ti/create-engine-ti";
import type { TIInput } from "./modele-ti/create-situation-ti";
import type { TIOutput } from "./modele-ti/evaluate-ti";
import { setEngineSituation } from "./helpers/set-engine-situation";
import { createSituationTI } from "./modele-ti/create-situation-ti";
import { evaluateTI } from "./modele-ti/evaluate-ti";

export type EIInput = TIInput;

export type EIOutput = TIOutput;

export function computeEI<Output extends EIOutput>(
  engine: EngineTI,
  foyer: Foyer,
  ei: EI,
  input: EIInput,
  output: Output,
) {
  setEngineSituation(engine, {
    ...createSituationTI(foyer, ei, input),
    "entreprise . imposition": "'IR'",
    "entreprise . EI": "oui",
  });
  return evaluateTI(engine, foyer, ei, output);
}
