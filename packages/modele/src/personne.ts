import type { PartialDeep } from "type-fest";
import { subYears } from "date-fns/subYears";
import defaultsDeep from "lodash.defaultsdeep";
import z from "zod";

import type { Don } from "./don";
import type { Placement } from "./placement";
import type { Revenu } from "./revenu";
import { donSchema } from "./don";
import { placementSchema } from "./placement";
import { revenuSchema } from "./revenu";

interface Personne {
  dateNaissance: Date;
}
const personneSchema = z.object({
  dateNaissance: z.date(),
}) satisfies z.ZodType<Personne>;

export const SCOLARTIE_ENFANT = {
  collegien: {
    label: "Collégien",
    value: "collegien" as const,
  },
  lyceen: {
    label: "Lycéen",
    value: "lyceen" as const,
  },
  etudiant: {
    label: "Étudiant",
    value: "etudiant" as const,
  },
};

export interface Enfant extends Personne {
  scolarite:
    | null
    | typeof SCOLARTIE_ENFANT.collegien.value
    | typeof SCOLARTIE_ENFANT.lyceen.value
    | typeof SCOLARTIE_ENFANT.etudiant.value;
}
export const enfantSchema = personneSchema.extend({
  scolarite: z
    .enum([
      SCOLARTIE_ENFANT.collegien.value,
      SCOLARTIE_ENFANT.lyceen.value,
      SCOLARTIE_ENFANT.etudiant.value,
    ])
    .nullable(),
}) satisfies z.ZodType<Enfant>;

export interface Adulte extends Personne {
  revenus: Revenu[];
  placements: Placement[];
  dons: Don[];
}
export const adulteSchema = personneSchema.extend({
  revenus: z.array(revenuSchema),
  placements: z.array(placementSchema),
  dons: z.array(donSchema),
}) satisfies z.ZodType<Adulte>;

export function creerEnfant(enfant: PartialDeep<Enfant>): Enfant {
  return enfantSchema.parse(
    defaultsDeep({}, enfant, {
      dateNaissance: subYears(new Date(), 12),
      scolarite: null,
    } satisfies Enfant),
  );
}

export function creerAdulte(adulte: PartialDeep<Adulte>): Adulte {
  return adulteSchema.parse(
    defaultsDeep({}, adulte, {
      dateNaissance: subYears(new Date(), 40),
      revenus: [],
      placements: [],
      dons: [],
    } satisfies Adulte),
  );
}
