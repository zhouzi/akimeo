import type { Foyer } from "@akimeo/modele";

import { trancherRevenus } from "./calculer-ir";

export function calculerTMI(foyer: Foyer) {
  const tranches = trancherRevenus(foyer);
  return (
    tranches
      .slice()
      .reverse()
      .find((tranche) => tranche.montantImpose > 0) ?? tranches[0]!
  );
}
