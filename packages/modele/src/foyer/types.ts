import type { IMPOSITION_RCM, SITUATION_FAMILIALE } from "./constants";
import type { EmploiADomicile } from "~/emploi-a-domicile/types";
import type { Adulte, Enfant } from "~/personne/types";

export interface BaseFoyer<
  SituationFamiliale extends
    | typeof SITUATION_FAMILIALE.celibataire.value
    | typeof SITUATION_FAMILIALE.divorce.value
    | typeof SITUATION_FAMILIALE.veuf.value
    | typeof SITUATION_FAMILIALE.concubinage.value
    | typeof SITUATION_FAMILIALE.marie.value
    | typeof SITUATION_FAMILIALE.pacse.value,
> {
  situationFamiliale: SituationFamiliale;
  declarant1: Adulte;
  enfants: Enfant[];
  impositionRCM:
    | typeof IMPOSITION_RCM.bareme.value
    | typeof IMPOSITION_RCM.pfu.value;
  emploisADomicile: EmploiADomicile[];
}

export interface FoyerCelibataire
  extends BaseFoyer<typeof SITUATION_FAMILIALE.celibataire.value> {
  declarant2: undefined;
}

export interface FoyerDivorce
  extends BaseFoyer<typeof SITUATION_FAMILIALE.divorce.value> {
  declarant2: undefined;
}

export interface FoyerVeuf
  extends BaseFoyer<typeof SITUATION_FAMILIALE.veuf.value> {
  declarant2: undefined;
}

export interface FoyerConcubinage
  extends BaseFoyer<typeof SITUATION_FAMILIALE.concubinage.value> {
  declarant2: Adulte;
}

export interface FoyerPacse
  extends BaseFoyer<typeof SITUATION_FAMILIALE.pacse.value> {
  declarant2: Adulte;
}

export interface FoyerMarie
  extends BaseFoyer<typeof SITUATION_FAMILIALE.marie.value> {
  declarant2: Adulte;
}

export type FoyerCouple = FoyerPacse | FoyerMarie;

export type Foyer =
  | FoyerCelibataire
  | FoyerDivorce
  | FoyerVeuf
  | FoyerConcubinage
  | FoyerMarie
  | FoyerPacse;
