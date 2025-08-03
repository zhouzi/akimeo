import type { PartialDeep } from "type-fest";
import { subYears } from "date-fns/subYears";
import defaultsDeep from "lodash.defaultsdeep";

import type { Adulte, Enfant } from "./types";
import { adulteSchema, enfantSchema } from "./schemas";

export function creerEnfant(enfant: PartialDeep<Enfant>): Enfant {
  return enfantSchema.parse(
    defaultsDeep({}, enfant, {
      dateNaissance: subYears(new Date(), 12),
      scolarite: null,
      fraisDeGarde: null,
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
      versementLiberatoire: false,
    } satisfies Adulte),
  );
}

export function setNombreEnfants(enfants: Enfant[], nombre: number) {
  const difference = nombre - enfants.length;

  if (difference > 0) {
    return enfants.concat(
      Array.from({ length: difference }).map(() => creerEnfant({})),
    );
  }

  if (difference < 0) {
    return enfants.slice(0, enfants.length + difference);
  }

  return enfants;
}
