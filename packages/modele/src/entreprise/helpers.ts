import type { PartialDeep } from "type-fest";
import defaultsDeep from "lodash.defaultsdeep";

import type { Sarl, SAS } from "./types";
import { NATURE_ACTIVITE_ENTREPRISE, STATUT_ENTREPRISE } from "./constants";
import { sarlSchema, sasSchema } from "./schemas";

export function creerSARL(sarl: PartialDeep<Sarl>): Sarl {
  return sarlSchema.parse(
    defaultsDeep({}, sarl, {
      statut: STATUT_ENTREPRISE.sarl.value,
      natureActivite: NATURE_ACTIVITE_ENTREPRISE.liberale.value,
      acre: false,
    } satisfies Sarl),
  );
}

export function creerSAS(sas: PartialDeep<SAS>): SAS {
  return sasSchema.parse(
    defaultsDeep({}, sas, {
      statut: STATUT_ENTREPRISE.sas.value,
      natureActivite: NATURE_ACTIVITE_ENTREPRISE.liberale.value,
      acre: false,
    } satisfies SAS),
  );
}
