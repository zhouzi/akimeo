import type { Entries } from "type-fest";
import type { Filter } from "type-fest/source/except";
import { calculerIR } from "@akimeo/fiscal";
import { Foyer, NATURE_REVENU } from "@akimeo/modele";
import { NATURE_ACTIVITE_ENTREPRISE } from "@akimeo/modele/entreprise/constants";
import { MicroEntreprise } from "@akimeo/modele/entreprise/types";
import Engine from "publicodes";

import { createSituationAcre, SituationAcre } from "./create-situation-acre";
import { createSituationImpot, SituationImpot } from "./create-situation-impot";
import { evaluateEngine } from "./evaluate-engine";
import { setEngineSituation } from "./set-engine-situation";

type SituationActivite =
  | {
      "entreprise . activité . nature": "'commerciale'";
      "entreprise . activités . service ou vente": "'vente'";
    }
  | {
      "entreprise . activité . nature": "'commerciale'";
      "entreprise . activités . service ou vente": "'service'";
    }
  | {
      "entreprise . activité . nature": "'libérale'";
      "entreprise . activité . nature . libérale . réglementée": "oui" | "non";
    }
  | {
      "entreprise . activité . nature": "'artisanale'";
    };

function createSituationActivite(
  microEntreprise: MicroEntreprise,
): SituationActivite {
  switch (microEntreprise.natureActivite) {
    case NATURE_ACTIVITE_ENTREPRISE.commercialeMarchandises.value:
      return {
        "entreprise . activité . nature": "'commerciale'",
        "entreprise . activités . service ou vente": "'vente'",
      };
    case NATURE_ACTIVITE_ENTREPRISE.commercialeServices.value:
      return {
        "entreprise . activité . nature": "'commerciale'",
        "entreprise . activités . service ou vente": "'service'",
      };
    case NATURE_ACTIVITE_ENTREPRISE.liberale.value:
      return {
        "entreprise . activité . nature": "'libérale'",
        "entreprise . activité . nature . libérale . réglementée": "non",
      };
    case NATURE_ACTIVITE_ENTREPRISE.artisanale.value:
      return {
        "entreprise . activité . nature": "'artisanale'",
      };
  }
}

interface SituationVersementLiberatoire {
  "dirigeant . auto-entrepreneur . impôt . versement libératoire":
    | "oui"
    | "non";
}

function createSituationVersementLiberatoire(
  microEntreprise: MicroEntreprise,
): SituationVersementLiberatoire {
  if (microEntreprise.versementLiberatoire) {
    return {
      "dirigeant . auto-entrepreneur . impôt . versement libératoire": "oui",
    };
  }
  return {
    "dirigeant . auto-entrepreneur . impôt . versement libératoire": "non",
  };
}

interface MicroEntrepriseInput {
  chiffreAffaires: number;
}

interface SituationMicroEntrepriseInput {
  "dirigeant . auto-entrepreneur . chiffre d'affaires": number;
}

function createSituationMicroEntrepriseInput(
  input: MicroEntrepriseInput,
): SituationMicroEntrepriseInput {
  return {
    "dirigeant . auto-entrepreneur . chiffre d'affaires": input.chiffreAffaires,
  };
}

type SituationMicroEntreprise = SituationImpot &
  SituationActivite &
  SituationVersementLiberatoire &
  SituationAcre &
  SituationMicroEntrepriseInput & {
    "entreprise . date de création": string;
    "entreprise . catégorie juridique": "'EI'";
    "entreprise . catégorie juridique . EI . auto-entrepreneur": "oui";
    "dirigeant . auto-entrepreneur": "oui";
  };

function creerSituationME(
  foyer: Foyer,
  microEntreprise: MicroEntreprise,
  input: MicroEntrepriseInput,
): SituationMicroEntreprise {
  return {
    ...createSituationImpot(foyer),
    ...createSituationActivite(microEntreprise),
    ...createSituationVersementLiberatoire(microEntreprise),
    ...createSituationAcre(microEntreprise),
    ...createSituationMicroEntrepriseInput(input),
    "entreprise . date de création": `01/01/${new Date().getFullYear()}`,
    "entreprise . catégorie juridique": "'EI'",
    "entreprise . catégorie juridique . EI . auto-entrepreneur": "oui",
    "dirigeant . auto-entrepreneur": "oui",
  };
}

type MicroEntrepriseOutput = Partial<{
  cotisations: true;
  ir: true;
  revenuNetAvantImpot: true;
  trimestresRetraite: true;
  cotisationsRetraite: true;
  retraiteBase: true;
  retraiteComplementaire: true;
}>;

export function computeMicroEntreprise<Output extends MicroEntrepriseOutput>(
  engine: Engine,
  foyer: Foyer,
  microEntreprise: MicroEntreprise,
  input: MicroEntrepriseInput,
  output: Output,
) {
  setEngineSituation(engine, {
    ...creerSituationME(foyer, microEntreprise, input),
  });
  return (Object.entries(output) as Entries<typeof output>).reduce(
    (acc, [key]) => {
      switch (key) {
        case "cotisations":
          return Object.assign(acc, {
            [key]: evaluateEngine(
              engine,
              "dirigeant . auto-entrepreneur . cotisations et contributions",
            ),
          });
        case "ir": {
          return Object.assign(acc, {
            [key]: calculerIR({
              ...foyer,
              declarant1: {
                ...foyer.declarant1,
                revenus: [
                  ...foyer.declarant1.revenus,
                  {
                    nature:
                      microEntreprise.natureActivite ===
                        NATURE_ACTIVITE_ENTREPRISE.artisanale.value ||
                      microEntreprise.natureActivite ===
                        NATURE_ACTIVITE_ENTREPRISE.commercialeMarchandises.value
                        ? NATURE_REVENU.microBICMarchandises.value
                        : microEntreprise.natureActivite ===
                            NATURE_ACTIVITE_ENTREPRISE.commercialeServices.value
                          ? NATURE_REVENU.microBICMarchandises.value
                          : NATURE_REVENU.microBNC.value,
                    montantAnnuel: evaluateEngine(
                      engine,
                      "dirigeant . auto-entrepreneur . chiffre d'affaires",
                    ),
                  },
                ],
                versementLiberatoire: microEntreprise.versementLiberatoire,
              },
            }),
          });
        }
        case "revenuNetAvantImpot":
          return Object.assign(acc, {
            [key]: evaluateEngine(
              engine,
              "dirigeant . auto-entrepreneur . revenu net",
            ),
          });
        case "trimestresRetraite":
          return Object.assign(acc, {
            [key]: evaluateEngine(
              engine,
              "protection sociale . retraite . trimestres",
            ),
          });
        case "cotisationsRetraite":
          return Object.assign(acc, {
            [key]: evaluateEngine(
              engine,
              "protection sociale . retraite . base . cotisée",
            ),
          });
        case "retraiteBase":
          return Object.assign(acc, {
            [key]: evaluateEngine(
              engine,
              "protection sociale . retraite . base",
            ),
          });
        case "retraiteComplementaire":
          return Object.assign(acc, {
            [key]: evaluateEngine(
              engine,
              "protection sociale . retraite . complémentaire",
            ),
          });
      }
    },
    {} as Record<
      Filter<keyof Output, Filter<keyof Output, keyof MicroEntrepriseOutput>>,
      number
    >,
  );
}
