/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { CONTRAT_POSTE } from "./constants";

interface BasePoste<
  Contrat extends
    | typeof CONTRAT_POSTE.cdi.value
    | typeof CONTRAT_POSTE.cdd.value
    | typeof CONTRAT_POSTE.apprentissage.value
    | typeof CONTRAT_POSTE.professionnalisation.value
    | typeof CONTRAT_POSTE.stage.value,
> {
  contrat: Contrat;
}

export interface Salarie
  extends BasePoste<
    typeof CONTRAT_POSTE.cdi.value | typeof CONTRAT_POSTE.cdd.value
  > {}

export interface Apprenti
  extends BasePoste<
    | typeof CONTRAT_POSTE.apprentissage.value
    | typeof CONTRAT_POSTE.professionnalisation.value
  > {}

export type AnySalarie = Salarie | Apprenti;

export interface Stagiaire
  extends BasePoste<typeof CONTRAT_POSTE.stage.value> {}

export type AnyPoste = AnySalarie | Stagiaire;
