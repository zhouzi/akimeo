import type { PartialDeep } from "type-fest";
import defaultsDeep from "lodash.defaultsdeep";

import type { EmploiADomicile } from "./types";
import { TYPE_EMPLOI_A_DOMICILE } from "./constants";
import { emploiADomicileSchema } from "./schemas";

export function creerEmploiADomicile(
  emploiADomicile: PartialDeep<EmploiADomicile>,
): EmploiADomicile {
  return emploiADomicileSchema.parse(
    defaultsDeep({}, emploiADomicile, {
      type: TYPE_EMPLOI_A_DOMICILE.menage.value,
      remunerationAnnuelle: 0,
    } satisfies EmploiADomicile),
  );
}
