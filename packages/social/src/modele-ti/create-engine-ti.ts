import rules from "modele-ti";

import { createEngine } from "../helpers/create-engine";

export function createEngineTI() {
  return createEngine(rules);
}

export type EngineTI = ReturnType<typeof createEngineTI>;
