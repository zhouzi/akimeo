import rules from "@akimeo/modele-as";

import { createEngine } from "../helpers/create-engine";

export function createEngineAS() {
  return createEngine(rules);
}

export type EngineAS = ReturnType<typeof createEngineAS>;
