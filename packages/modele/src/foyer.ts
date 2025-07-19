import { startOfYear } from "date-fns/startOfYear";
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
  dateChangementSituationFamiliale: Date;
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
  dateChangementSituationFamiliale: z.date(),
  declarant1: adulteSchema,
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Celibataire
  extends BaseFoyer<
    | typeof SITUATION_FAMILIALE.celibataire.value
    | typeof SITUATION_FAMILIALE.divorce.value
    | typeof SITUATION_FAMILIALE.veuf.value
  > {}
const celibataireSchema = baseFoyerSchema.extend({
  situationFamiliale: z.enum([
    SITUATION_FAMILIALE.celibataire.value,
    SITUATION_FAMILIALE.divorce.value,
    SITUATION_FAMILIALE.veuf.value,
  ]),
}) satisfies z.ZodType<Celibataire>;

interface Concubinage
  extends BaseFoyer<typeof SITUATION_FAMILIALE.concubinage.value> {
  declarant2: Adulte;
}
const concubinageSchema = baseFoyerSchema.extend({
  situationFamiliale: z.literal(SITUATION_FAMILIALE.concubinage.value),
  declarant2: adulteSchema,
}) satisfies z.ZodType<Concubinage>;

interface Couple
  extends BaseFoyer<
    | typeof SITUATION_FAMILIALE.marie.value
    | typeof SITUATION_FAMILIALE.pacse.value
  > {
  declarant2: Adulte;
}
const coupleSchema = baseFoyerSchema.extend({
  situationFamiliale: z.enum([
    SITUATION_FAMILIALE.marie.value,
    SITUATION_FAMILIALE.pacse.value,
  ]),
  declarant2: adulteSchema,
}) satisfies z.ZodType<Couple>;

export type Foyer = Celibataire | Concubinage | Couple;

const foyerSchema = z.union([
  celibataireSchema,
  concubinageSchema,
  coupleSchema,
]) satisfies z.ZodType<Foyer>;

export function isCouple(foyer: Foyer): foyer is Couple {
  return (
    foyer.situationFamiliale === SITUATION_FAMILIALE.marie.value ||
    foyer.situationFamiliale === SITUATION_FAMILIALE.pacse.value
  );
}

export function creerFoyer(
  foyer:
    | PartialDeep<Celibataire>
    | PartialDeep<Concubinage>
    | PartialDeep<Couple>,
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
        } satisfies Concubinage | Couple),
      );
    case SITUATION_FAMILIALE.celibataire.value:
    case SITUATION_FAMILIALE.divorce.value:
    case SITUATION_FAMILIALE.veuf.value:
    default:
      return foyerSchema.parse(
        defaultsDeep({}, foyer, {
          situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
          dateChangementSituationFamiliale: startOfYear(new Date()),
          declarant1: creerAdulte(foyer.declarant1 ?? {}),
          enfants: [],
          impositionRCM: IMPOSITION_RCM.pfu.value,
          emploisADomicile: [],
        } satisfies Celibataire),
      );
  }
}
