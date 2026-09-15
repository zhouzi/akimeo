import type { Foyer } from "@akimeo/modele/foyer/types";
import { isFoyerCouple } from "@akimeo/modele/foyer/helpers";

export function getRevenus(foyer: Foyer) {
  return [
    ...foyer.declarant1.revenus,
    ...(isFoyerCouple(foyer) ? foyer.declarant2.revenus : []),
  ];
}
