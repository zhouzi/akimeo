import rules from "@akimeo/modele-ti";

import { createEngine } from "../helpers/create-engine";

export function createEngineTI() {
  return createEngine(rules);
}

export type EngineTI = ReturnType<typeof createEngineTI>;
