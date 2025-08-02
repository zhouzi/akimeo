import type { Foyer } from "@akimeo/modele";
import donneesReglementaires from "@akimeo/donnees-reglementaires";

import { calculerPartsFiscales } from "./calculer-parts-fiscales";
import { calculerRevenuNetImposable } from "./calculer-revenu-net-imposable";

const BAREME_IR =
  donneesReglementaires.impot_revenu.bareme_ir_depuis_1945.bareme;

export function trancherRevenus(foyer: Foyer, qf = false) {
  const revenuNetImposable = calculerRevenuNetImposable(foyer);
  const partsFiscales = calculerPartsFiscales(
    qf ? { ...foyer, enfants: [] } : foyer,
  );

  return BAREME_IR.map((tranche) => ({
    ...tranche,
    threshold: tranche.threshold * partsFiscales,
  })).map((tranche, index, tranches) => {
    const trancheSuivante = tranches[index + 1];

    const min = tranche.threshold;
    const max = trancheSuivante?.threshold ?? Infinity;

    const montantImposableMax = max - min;
    const revenusImposablesRestants = Math.max(0, revenuNetImposable - min);

    const montantImpose = Math.min(
      revenusImposablesRestants,
      montantImposableMax,
    );

    const impotBrut = montantImpose * tranche.rate;

    return {
      ...tranche,
      montantImpose,
      montantImposableMax,
      impotBrut,
    };
  });
}
