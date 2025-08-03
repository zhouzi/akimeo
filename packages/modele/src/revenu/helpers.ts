import type { Revenu } from "./types";
import { NATURE_REVENU } from "./constants";

export function isNatureRevenuMicroEntreprise(nature: Revenu["nature"]) {
  return (
    nature === NATURE_REVENU.microBICMarchandises.value ||
    nature === NATURE_REVENU.microBICServices.value ||
    nature === NATURE_REVENU.microBNC.value
  );
}
