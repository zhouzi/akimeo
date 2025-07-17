import type { PartialDeep } from "type-fest";
import defaultsDeep from "lodash.defaultsdeep";
import z from "zod";

export const TYPE_EMPLOI_A_DOMICILE = {
  menage: {
    label: "Ménage",
    value: "menage" as const,
  },
  petitBricolage: {
    label: "Petit bricolage",
    value: "petit-bricolage" as const,
  },
  assistanceInformatique: {
    label: "Assistance informatique",
    value: "assistance-informatique" as const,
  },
  jardinage: {
    label: "Jardinage",
    value: "jardinage" as const,
  },
};
export const TYPE_EMPLOI_A_DOMICILE_OPTIONS = Object.values(
  TYPE_EMPLOI_A_DOMICILE,
);

export interface EmploiADomicile {
  type:
    | typeof TYPE_EMPLOI_A_DOMICILE.assistanceInformatique.value
    | typeof TYPE_EMPLOI_A_DOMICILE.jardinage.value
    | typeof TYPE_EMPLOI_A_DOMICILE.menage.value
    | typeof TYPE_EMPLOI_A_DOMICILE.petitBricolage.value;
  remunerationAnnuelle: number;
}

export const emploiADomicileSchema = z.object({
  type: z.enum([
    TYPE_EMPLOI_A_DOMICILE.assistanceInformatique.value,
    TYPE_EMPLOI_A_DOMICILE.jardinage.value,
    TYPE_EMPLOI_A_DOMICILE.menage.value,
    TYPE_EMPLOI_A_DOMICILE.petitBricolage.value,
  ]),
  remunerationAnnuelle: z.number(),
}) satisfies z.ZodType<EmploiADomicile>;

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
