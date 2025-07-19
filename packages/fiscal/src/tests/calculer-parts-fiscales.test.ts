import {
  creerFoyer,
  setNombreEnfants,
  SITUATION_FAMILIALE,
} from "@akimeo/modele";
import { startOfYear } from "date-fns/startOfYear";
import { subYears } from "date-fns/subYears";
import { describe, expect, it } from "vitest";

import { calculerPartsFiscales } from "~/calculer-parts-fiscales";

describe("calculerPartsFiscales", () => {
  // https://www.economie.gouv.fr/particuliers/quotient-familial
  it.each([
    [
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
        dateChangementSituationFamiliale: startOfYear(new Date()),
      }),
      1,
      1.5,
      2,
      3,
      4,
    ],
    [
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.concubinage.value,
        dateChangementSituationFamiliale: startOfYear(new Date()),
      }),
      1,
      1.5,
      2,
      3,
      4,
    ],
    [
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.divorce.value,
        dateChangementSituationFamiliale: startOfYear(new Date()),
      }),
      1,
      1.5,
      2,
      3,
      4,
    ],
    [
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.divorce.value,
        dateChangementSituationFamiliale: subYears(new Date(), 1),
      }),
      1,
      1.5,
      2,
      3,
      4,
    ],
    [
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.veuf.value,
        dateChangementSituationFamiliale: startOfYear(new Date()),
      }),
      1,
      2.5,
      3,
      4,
      5,
    ],
    [
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.veuf.value,
        dateChangementSituationFamiliale: subYears(new Date(), 1),
      }),
      1,
      2.5,
      3,
      4,
      5,
    ],
  ])(
    "pour un $situationFamiliale depuis le $dateChangementSituationFamiliale",
    (foyer, noChildren, oneChild, twoChildren, threeChildren, fourChildren) => {
      expect(
        calculerPartsFiscales({
          ...foyer,
          enfants: setNombreEnfants(foyer.enfants, 0),
        }),
      ).toBe(noChildren);

      expect(
        calculerPartsFiscales({
          ...foyer,
          enfants: setNombreEnfants(foyer.enfants, 1),
        }),
      ).toBe(oneChild);

      expect(
        calculerPartsFiscales({
          ...foyer,
          enfants: setNombreEnfants(foyer.enfants, 2),
        }),
      ).toBe(twoChildren);

      expect(
        calculerPartsFiscales({
          ...foyer,
          enfants: setNombreEnfants(foyer.enfants, 3),
        }),
      ).toBe(threeChildren);

      expect(
        calculerPartsFiscales({
          ...foyer,
          enfants: setNombreEnfants(foyer.enfants, 4),
        }),
      ).toBe(fourChildren);
    },
  );
});
