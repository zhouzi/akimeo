import type { PartialDeep } from "type-fest";
import defaultsDeep from "lodash.defaultsdeep";

import type { EI, MicroEntreprise, Sarl, SAS } from "./types";
import { NATURE_ACTIVITE_ENTREPRISE, STATUT_ENTREPRISE } from "./constants";
import {
  eiSchema,
  microEntrepriseSchema,
  sarlSchema,
  sasSchema,
} from "./schemas";

export function creerMicroEntreprise(
  microEntreprise: PartialDeep<MicroEntreprise>,
): MicroEntreprise {
  return microEntrepriseSchema.parse(
    defaultsDeep({}, microEntreprise, {
      statut: STATUT_ENTREPRISE.microEntreprise.value,
      natureActivite: NATURE_ACTIVITE_ENTREPRISE.liberale.value,
      acre: false,
      tva: false,
      versementLiberatoire: false,
    } satisfies MicroEntreprise),
  );
}

export function creerEI(ei: PartialDeep<EI>): EI {
  return eiSchema.parse(
    defaultsDeep({}, ei, {
      statut: STATUT_ENTREPRISE.ei.value,
      natureActivite: NATURE_ACTIVITE_ENTREPRISE.liberale.value,
      acre: false,
      tva: true,
    } satisfies EI),
  );
}

export function creerSARL(sarl: PartialDeep<Sarl>): Sarl {
  return sarlSchema.parse(
    defaultsDeep({}, sarl, {
      statut: STATUT_ENTREPRISE.sarl.value,
      natureActivite: NATURE_ACTIVITE_ENTREPRISE.liberale.value,
      acre: false,
      tva: true,
    } satisfies Sarl),
  );
}

export function creerSAS(sas: PartialDeep<SAS>): SAS {
  return sasSchema.parse(
    defaultsDeep({}, sas, {
      statut: STATUT_ENTREPRISE.sas.value,
      natureActivite: NATURE_ACTIVITE_ENTREPRISE.liberale.value,
      acre: false,
      tva: true,
    } satisfies SAS),
  );
}
