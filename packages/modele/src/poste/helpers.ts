import type { PartialDeep } from "type-fest";
import defaultsDeep from "lodash.defaultsdeep";

import type { AnyPoste, Apprenti, Salarie, Stagiaire } from "./types";
import { CONTRAT_POSTE } from "./constants";
import { apprentiSchema, salarieSchema, stagiaireSchema } from "./schemas";

export function creerSalarie(salarie: PartialDeep<Salarie>): Salarie {
  return salarieSchema.parse(
    defaultsDeep({}, salarie, {
      contrat: CONTRAT_POSTE.cdi.value,
    } satisfies Salarie),
  );
}

export function creerApprenti(apprenti: PartialDeep<Apprenti>): Apprenti {
  return apprentiSchema.parse(
    defaultsDeep({}, apprenti, {
      contrat: CONTRAT_POSTE.apprentissage.value,
    } satisfies Apprenti),
  );
}

export function creerStagiaire(stagiaire: PartialDeep<Stagiaire>): Stagiaire {
  return stagiaireSchema.parse(
    defaultsDeep({}, stagiaire, {
      contrat: CONTRAT_POSTE.stage.value,
    } satisfies Stagiaire),
  );
}

export function creerAnyPoste<T extends AnyPoste["contrat"]>(
  anyPoste: { contrat: T } & PartialDeep<Extract<AnyPoste, { contrat: T }>>,
) {
  switch (anyPoste.contrat) {
    case CONTRAT_POSTE.apprentissage.value:
    case CONTRAT_POSTE.professionnalisation.value:
      return creerApprenti(anyPoste as PartialDeep<Apprenti>);
    case CONTRAT_POSTE.stage.value:
      return creerStagiaire(anyPoste as PartialDeep<Stagiaire>);
    case CONTRAT_POSTE.cdi.value:
    case CONTRAT_POSTE.cdd.value:
    default:
      return creerSalarie(anyPoste as PartialDeep<Salarie>);
  }
}
