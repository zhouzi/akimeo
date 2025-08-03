import type { NATURE_DON } from "./constants";

export interface Don {
  nature:
    | typeof NATURE_DON.personnesEnDifficulte.value
    | typeof NATURE_DON.utilitePublique.value
    | typeof NATURE_DON.partisPolitiques.value;
  montantAnnuel: number;
}
