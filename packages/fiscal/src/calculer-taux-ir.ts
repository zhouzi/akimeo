import type { Foyer } from "@akimeo/modele";

import { calculerIR, getRevenus } from "./calculer-ir";

export function calculerTauxIR(foyer: Foyer) {
  const sommeRevenus = getRevenus(foyer).reduce(
    (acc, revenu) => acc + revenu.montantAnnuel,
    0,
  );
  const ir = calculerIR(foyer);

  return sommeRevenus > 0 ? ir / sommeRevenus : 0;
}
