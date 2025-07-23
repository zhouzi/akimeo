import type { Foyer } from "@akimeo/modele/foyer";

import { calculerIR } from "./calculer-ir";
import { calculerVersementLiberatoire } from "./calculer-versement-liberatoire";

export function calculerIRComplet(foyer: Foyer) {
  return [calculerIR, calculerVersementLiberatoire].reduce(
    (acc, fn) => acc + fn(foyer),
    0,
  );
}
