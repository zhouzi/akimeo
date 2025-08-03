import type { SCOLARTIE_ENFANT } from "./constants";
import type { Don } from "~/don/types";
import type { Placement } from "~/placement/types";
import type { Revenu } from "~/revenu/types";

export interface Personne {
  dateNaissance: Date;
}

export interface Enfant extends Personne {
  scolarite:
    | null
    | typeof SCOLARTIE_ENFANT.collegien.value
    | typeof SCOLARTIE_ENFANT.lyceen.value
    | typeof SCOLARTIE_ENFANT.etudiant.value;
  fraisDeGarde: number | null;
}

export interface Adulte extends Personne {
  revenus: Revenu[];
  placements: Placement[];
  dons: Don[];
  versementLiberatoire: boolean;
}
