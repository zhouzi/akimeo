import type { Foyer } from "@akimeo/modele";
import { isFoyerCouple } from "@akimeo/modele";

export function getRevenus(foyer: Foyer) {
  return [
    ...foyer.declarant1.revenus,
    ...(isFoyerCouple(foyer) ? foyer.declarant2.revenus : []),
  ];
}
