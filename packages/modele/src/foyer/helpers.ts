import type { PartialDeep } from "type-fest";
import defaultsDeep from "lodash.defaultsdeep";

import type {
  Foyer,
  FoyerCelibataire,
  FoyerConcubinage,
  FoyerCouple,
} from "./types";
import { creerAdulte } from "~/personne/helpers";
import { IMPOSITION_RCM, SITUATION_FAMILIALE } from "./constants";
import { foyerSchema } from "./schemas";

export function isFoyerCouple(foyer: Foyer): foyer is FoyerCouple {
  return (
    foyer.situationFamiliale === SITUATION_FAMILIALE.marie.value ||
    foyer.situationFamiliale === SITUATION_FAMILIALE.pacse.value
  );
}

export function creerFoyer(
  foyer:
    | PartialDeep<FoyerCelibataire>
    | PartialDeep<FoyerConcubinage>
    | PartialDeep<FoyerCouple>,
): Foyer {
  switch (foyer.situationFamiliale) {
    case SITUATION_FAMILIALE.concubinage.value:
    case SITUATION_FAMILIALE.marie.value:
    case SITUATION_FAMILIALE.pacse.value:
      return foyerSchema.parse(
        defaultsDeep({}, foyer, {
          ...creerFoyer({
            situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
          }),
          situationFamiliale: foyer.situationFamiliale,
          declarant2: creerAdulte(foyer.declarant2 ?? {}),
        } satisfies FoyerConcubinage | FoyerCouple),
      );
    case SITUATION_FAMILIALE.celibataire.value:
    case SITUATION_FAMILIALE.divorce.value:
    case SITUATION_FAMILIALE.veuf.value:
    default:
      return foyerSchema.parse(
        defaultsDeep({}, foyer, {
          situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
          declarant1: creerAdulte(foyer.declarant1 ?? {}),
          declarant2: undefined,
          enfants: [],
          impositionRCM: IMPOSITION_RCM.pfu.value,
          emploisADomicile: [],
        } satisfies FoyerCelibataire),
      );
  }
}

export function pacser(foyer1: Foyer, foyer2: Foyer): Foyer {
  return {
    declarant1: foyer1.declarant1,
    declarant2: foyer2.declarant1,
    situationFamiliale: SITUATION_FAMILIALE.pacse.value,
    emploisADomicile: foyer1.emploisADomicile.concat(foyer2.emploisADomicile),
    enfants: foyer1.enfants.concat(foyer2.enfants),
    impositionRCM: foyer1.impositionRCM,
  };
}
