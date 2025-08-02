import type { Foyer } from "@akimeo/modele";

import { calculerIRDu } from "./calculer-ir-du";
import { calculerVersementLiberatoire } from "./calculer-versement-liberatoire";

export function calculerIR(foyer: Foyer) {
  return [calculerIRDu, calculerVersementLiberatoire].reduce(
    (acc, fn) => acc + fn(foyer),
    0,
  );
}
