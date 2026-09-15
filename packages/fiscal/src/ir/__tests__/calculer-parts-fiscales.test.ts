import { SITUATION_FAMILIALE } from "@akimeo/modele/foyer/constants";
import { creerFoyer } from "@akimeo/modele/foyer/helpers";
import { setNombreEnfants } from "@akimeo/modele/personne/helpers";
import { describe, expect, it } from "vitest";

import { calculerPartsFiscales } from "../calculer-parts-fiscales";

describe("calculerPartsFiscales", () => {
  // https://www.economie.gouv.fr/particuliers/quotient-familial
  it.each([
    [
      creerFoyer({
        situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
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
      }),
      1,
      2.5,
      3,
      4,
      5,
    ],
  ])(
    "pour un $situationFamiliale",
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
