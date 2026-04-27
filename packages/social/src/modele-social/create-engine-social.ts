import rules from "@akimeo/modele-social";

import { createEngine } from "../helpers/create-engine";

export function createEngineSocial() {
  return createEngine(rules);
}

export type EngineSocial = ReturnType<typeof createEngineSocial>;
