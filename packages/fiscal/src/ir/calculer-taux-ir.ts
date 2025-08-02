import type { Foyer } from "@akimeo/modele";

import { calculerIRDu } from "./calculer-ir-du";
import { getRevenus } from "./get-revenus";

export function calculerTauxIR(foyer: Foyer) {
  const sommeRevenus = getRevenus(foyer).reduce(
    (acc, revenu) => acc + revenu.montantAnnuel,
    0,
  );
  const ir = calculerIRDu(foyer);

  return sommeRevenus > 0 ? ir / sommeRevenus : 0;
}
