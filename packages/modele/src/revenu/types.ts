import type { NATURE_REVENU } from "./constants";

export interface Revenu {
  nature:
    | typeof NATURE_REVENU.salaire.value
    | typeof NATURE_REVENU.remuneration.value
    | typeof NATURE_REVENU.pensionRetraite.value
    | typeof NATURE_REVENU.autre.value
    | typeof NATURE_REVENU.bnc.value
    | typeof NATURE_REVENU.microBNC.value
    | typeof NATURE_REVENU.bic.value
    | typeof NATURE_REVENU.microBICServices.value
    | typeof NATURE_REVENU.microBICMarchandises.value
    | typeof NATURE_REVENU.foncier.value
    | typeof NATURE_REVENU.microFoncier.value
    | typeof NATURE_REVENU.rcm.value;
  montantAnnuel: number;
}
