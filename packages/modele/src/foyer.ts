import defaultsDeep from "lodash.defaultsdeep";
import { type PartialDeep } from "type-fest";
import z from "zod";

import type { EmploiADomicile } from "./emploi-a-domicile";
import type { Adulte, Enfant } from "./personne";
import { emploiADomicileSchema } from "./emploi-a-domicile";
import { adulteSchema, creerAdulte, enfantSchema } from "./personne";

export const SITUATION_FAMILIALE = {
  celibataire: {
    label: "Célibataire",
    value: "celibataire" as const,
  },
  divorce: {
    label: "Divorcé",
    value: "divorce" as const,
  },
  veuf: {
    label: "Veuf",
    value: "veuf" as const,
  },
  concubinage: {
    label: "Concubinage",
    value: "concubinage" as const,
  },
  marie: {
    label: "Marié",
    value: "marie" as const,
  },
  pacse: {
    label: "Pacsé",
    value: "pacse" as const,
  },
};
export const SITUATION_FAMILIALE_OPTIONS = Object.values(SITUATION_FAMILIALE);

export const IMPOSITION_RCM = {
  bareme: {
    label: "Barème progressif",
    value: "bareme" as const,
  },
  pfu: {
    label: "Prélèvement forfaitaire unique",
    value: "pfu" as const,
  },
};

interface BaseFoyer<
  SituationFamiliale extends
    | typeof SITUATION_FAMILIALE.celibataire.value
    | typeof SITUATION_FAMILIALE.divorce.value
    | typeof SITUATION_FAMILIALE.veuf.value
    | typeof SITUATION_FAMILIALE.concubinage.value
    | typeof SITUATION_FAMILIALE.marie.value
    | typeof SITUATION_FAMILIALE.pacse.value,
> {
  situationFamiliale: SituationFamiliale;
  declarant1: Adulte;
  enfants: Enfant[];
  impositionRCM:
    | typeof IMPOSITION_RCM.bareme.value
    | typeof IMPOSITION_RCM.pfu.value;
  emploisADomicile: EmploiADomicile[];
}
const baseFoyerSchema = z.object({
  situationFamiliale: z.enum([
    SITUATION_FAMILIALE.celibataire.value,
    SITUATION_FAMILIALE.divorce.value,
    SITUATION_FAMILIALE.veuf.value,
    SITUATION_FAMILIALE.concubinage.value,
    SITUATION_FAMILIALE.marie.value,
    SITUATION_FAMILIALE.pacse.value,
  ]),
  declarant1: adulteSchema,
  declarant2: z.literal(undefined),
  enfants: z.array(enfantSchema),
  impositionRCM: z.enum([
    IMPOSITION_RCM.bareme.value,
    IMPOSITION_RCM.pfu.value,
  ]),
  emploisADomicile: z.array(emploiADomicileSchema),
}) satisfies z.ZodType<
  BaseFoyer<
    | typeof SITUATION_FAMILIALE.celibataire.value
    | typeof SITUATION_FAMILIALE.divorce.value
    | typeof SITUATION_FAMILIALE.veuf.value
    | typeof SITUATION_FAMILIALE.concubinage.value
    | typeof SITUATION_FAMILIALE.marie.value
    | typeof SITUATION_FAMILIALE.pacse.value
  >
>;

export interface FoyerCelibataire
  extends BaseFoyer<
    | typeof SITUATION_FAMILIALE.celibataire.value
    | typeof SITUATION_FAMILIALE.divorce.value
    | typeof SITUATION_FAMILIALE.veuf.value
  > {
  declarant2: undefined;
}
const foyerCelibataireSchema = baseFoyerSchema.extend({
  situationFamiliale: z.enum([
    SITUATION_FAMILIALE.celibataire.value,
    SITUATION_FAMILIALE.divorce.value,
    SITUATION_FAMILIALE.veuf.value,
  ]),
  declarant2: z.literal(undefined),
}) satisfies z.ZodType<FoyerCelibataire>;

export interface FoyerConcubinage
  extends BaseFoyer<typeof SITUATION_FAMILIALE.concubinage.value> {
  declarant2: Adulte;
}
const foyerConcubinageSchema = baseFoyerSchema.extend({
  situationFamiliale: z.literal(SITUATION_FAMILIALE.concubinage.value),
  declarant2: adulteSchema,
}) satisfies z.ZodType<FoyerConcubinage>;

export interface FoyerCouple
  extends BaseFoyer<
    | typeof SITUATION_FAMILIALE.marie.value
    | typeof SITUATION_FAMILIALE.pacse.value
  > {
  declarant2: Adulte;
}
const foyerCoupleSchema = baseFoyerSchema.extend({
  situationFamiliale: z.enum([
    SITUATION_FAMILIALE.marie.value,
    SITUATION_FAMILIALE.pacse.value,
  ]),
  declarant2: adulteSchema,
}) satisfies z.ZodType<FoyerCouple>;

export type Foyer = FoyerCelibataire | FoyerConcubinage | FoyerCouple;

export const foyerSchema = z.union([
  foyerCelibataireSchema,
  foyerConcubinageSchema,
  foyerCoupleSchema,
]) satisfies z.ZodType<Foyer>;

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
