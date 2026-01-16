import type {
  NATURE_ACTIVITE_ENTREPRISE,
  STATUT_ENTREPRISE,
} from "./constants";

export interface AnyEntreprise {
  statut:
    | typeof STATUT_ENTREPRISE.microEntreprise.value
    | typeof STATUT_ENTREPRISE.sarl.value;
  natureActivite:
    | typeof NATURE_ACTIVITE_ENTREPRISE.agricole.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.artisanale.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.commerciale.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.commercialeMarchandises.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.commercialeServices.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.liberale.value;
  acre: boolean;
}

export interface MicroEntreprise extends AnyEntreprise {
  statut: typeof STATUT_ENTREPRISE.microEntreprise.value;
  natureActivite:
    | typeof NATURE_ACTIVITE_ENTREPRISE.artisanale.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.commercialeMarchandises.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.commercialeServices.value
    | typeof NATURE_ACTIVITE_ENTREPRISE.liberale.value;
  versementLiberatoire: boolean;
}

export interface Sarl extends AnyEntreprise {
  statut: typeof STATUT_ENTREPRISE.sarl.value;
}
