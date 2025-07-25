import type { PartialDeep } from "type-fest";
import defaultsDeep from "lodash.defaultsdeep";
import z from "zod";

export const NATURE_DON = {
  personnesEnDifficulte: {
    label: "Personnes en difficulté",
    value: "personne-en-difficulte" as const,
  },
  utilitePublique: {
    label: "Utilité publique",
    value: "utilite-publique" as const,
  },
  partisPolitiques: {
    label: "Partis politiques",
    value: "partis-politiques" as const,
  },
};
export const NATURE_DON_OPTIONS = Object.values(NATURE_DON);

export interface Don {
  nature:
    | typeof NATURE_DON.personnesEnDifficulte.value
    | typeof NATURE_DON.utilitePublique.value
    | typeof NATURE_DON.partisPolitiques.value;
  montantAnnuel: number;
}
export const donSchema = z.object({
  nature: z.enum([
    NATURE_DON.personnesEnDifficulte.value,
    NATURE_DON.utilitePublique.value,
    NATURE_DON.partisPolitiques.value,
  ]),
  montantAnnuel: z.number(),
}) satisfies z.ZodType<Don>;

export function creerDon(don: PartialDeep<Don>): Don {
  return donSchema.parse(
    defaultsDeep({}, don, {
      nature: NATURE_DON.utilitePublique.value,
      montantAnnuel: 0,
    } satisfies Don),
  );
}
