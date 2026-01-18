/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  NATURE_ACTIVITE_ENTREPRISE,
  STATUT_ENTREPRISE,
} from "./constants";

type AnyStatutEntreprise =
  | typeof STATUT_ENTREPRISE.microEntreprise.value
  | typeof STATUT_ENTREPRISE.ei.value
  | typeof STATUT_ENTREPRISE.sarl.value;

type AnyNatureActiviteEntreprise =
  | typeof NATURE_ACTIVITE_ENTREPRISE.agricole.value
  | typeof NATURE_ACTIVITE_ENTREPRISE.artisanale.value
  | typeof NATURE_ACTIVITE_ENTREPRISE.commerciale.value
  | typeof NATURE_ACTIVITE_ENTREPRISE.commercialeMarchandises.value
  | typeof NATURE_ACTIVITE_ENTREPRISE.commercialeServices.value
  | typeof NATURE_ACTIVITE_ENTREPRISE.liberale.value;

interface BaseEntreprise<
  Statut extends AnyStatutEntreprise,
  NatureActivite extends
    AnyNatureActiviteEntreprise = AnyNatureActiviteEntreprise,
> {
  statut: Statut;
  natureActivite: NatureActivite;
  acre: boolean;
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
  extends BaseEntreprise<typeof STATUT_ENTREPRISE.sarl.value> {}

export type AnyEntreprise = MicroEntreprise | EI | Sarl;
