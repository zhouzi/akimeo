import type { STATUT_ENTREPRISE } from "./constants";

export interface AnyEntreprise {
  statut:
    | typeof STATUT_ENTREPRISE.microEntreprise.value
    | typeof STATUT_ENTREPRISE.sarl.value;
  acre: boolean;
}

export interface MicroEntreprise {
  statut: typeof STATUT_ENTREPRISE.microEntreprise.value;
  versementLiberatoire: boolean;
}

export interface Sarl {
  statut: typeof STATUT_ENTREPRISE.sarl.value;
}
