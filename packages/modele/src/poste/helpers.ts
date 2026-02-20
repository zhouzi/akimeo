import type { PartialDeep } from "type-fest";
import defaultsDeep from "lodash.defaultsdeep";

import type { Salarie } from "./types";
import { CONTRAT_POSTE } from "./constants";
import { salarieSchema } from "./schemas";

export function creerSalarie(salarie: PartialDeep<Salarie>): Salarie {
  return salarieSchema.parse(
    defaultsDeep({}, salarie, {
      contrat: CONTRAT_POSTE.cdi.value,
    } satisfies Salarie),
  );
}
