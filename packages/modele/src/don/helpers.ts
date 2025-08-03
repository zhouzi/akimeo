import type { PartialDeep } from "type-fest";
import defaultsDeep from "lodash.defaultsdeep";

import type { Don } from "./types";
import { NATURE_DON } from "./constants";
import { donSchema } from "./schemas";

export function creerDon(don: PartialDeep<Don>): Don {
  return donSchema.parse(
    defaultsDeep({}, don, {
      nature: NATURE_DON.utilitePublique.value,
      montantAnnuel: 0,
    } satisfies Don),
  );
}
