import type { Foyer } from "@akimeo/modele";
import type { Sarl } from "@akimeo/modele/entreprise/types";

import type { EngineTI } from "./modele-ti/create-engine-ti";
import type { TIInput } from "./modele-ti/create-situation-ti";
import type { TIOutput } from "./modele-ti/evaluate-ti";
import { setEngineSituation } from "./helpers/set-engine-situation";
import { createSituationTI } from "./modele-ti/create-situation-ti";
import { evaluateTI } from "./modele-ti/evaluate-ti";

export type SARLInput = TIInput;

export type SARLOutput = TIOutput;

export function computeSARL<Output extends SARLOutput>(
  engine: EngineTI,
  foyer: Foyer,
  sarl: Sarl,
  input: SARLInput,
  output: Output,
) {
  setEngineSituation(engine, {
    ...createSituationTI(foyer, sarl, input),
    "entreprise . imposition": "'IR'",
    "entreprise . EI": "non",
  });
  return evaluateTI(engine, foyer, sarl, output);
}
