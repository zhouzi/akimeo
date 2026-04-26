/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  NATURE_ACTIVITE_ENTREPRISE,
  STATUT_ENTREPRISE,
} from "./constants";

interface BaseEntreprise<
  Statut extends
    | typeof STATUT_ENTREPRISE.microEntreprise.value
    | typeof STATUT_ENTREPRISE.ei.value
    | typeof STATUT_ENTREPRISE.sarl.value
    | typeof STATUT_ENTREPRISE.sas.value,
  NatureActivite extends
    | typeof NATURE_ACTIVITE_ENTREPRISE.agricole.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.artisanale.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.commerciale.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.commercialeMarchandises.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.commercialeServices.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.liberale.value,
> {
  statut: Statut;
  natureActivite: NatureActivite;
  acre: boolean;
  tva: boolean;
}

export interface MicroEntreprise
  extends BaseEntreprise<
    typeof STATUT_ENTREPRISE.microEntreprise.value,
    | typeof NATURE_ACTIVITE_ENTREPRISE.artisanale.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.commercialeMarchandises.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.commercialeServices.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.liberale.value
  > {
  versementLiberatoire: boolean;
}

export interface EI
  extends BaseEntreprise<
    typeof STATUT_ENTREPRISE.ei.value,
    | typeof NATURE_ACTIVITE_ENTREPRISE.artisanale.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.commerciale.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.liberale.value
  > {}

export interface Sarl
  extends BaseEntreprise<
    typeof STATUT_ENTREPRISE.sarl.value,
    | typeof NATURE_ACTIVITE_ENTREPRISE.artisanale.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.commerciale.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.liberale.value
  > {}

export interface SAS
  extends BaseEntreprise<
    typeof STATUT_ENTREPRISE.sas.value,
    | typeof NATURE_ACTIVITE_ENTREPRISE.artisanale.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.commerciale.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.liberale.value
  > {}

export type AnyEntreprise = MicroEntreprise | EI | Sarl | SAS;
