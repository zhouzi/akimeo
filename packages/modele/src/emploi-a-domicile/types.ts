import type { TYPE_EMPLOI_A_DOMICILE } from "./constants";

export interface EmploiADomicile {
  type:
    | typeof TYPE_EMPLOI_A_DOMICILE.assistanceInformatique.value
    | typeof TYPE_EMPLOI_A_DOMICILE.jardinage.value
    | typeof TYPE_EMPLOI_A_DOMICILE.menage.value
    | typeof TYPE_EMPLOI_A_DOMICILE.petitBricolage.value;
  remunerationAnnuelle: number;
}
