import type { Revenu } from "@akimeo/modele";

export function dedupeRevenus(revenus: Revenu[]) {
  return Object.values(
    revenus.reduce(
      (acc, revenu) =>
        Object.assign(acc, {
          [revenu.nature]: {
            ...revenu,
            montantAnnuel:
              // FIXME: un bon type permettrait de ne pas avoir à désactiver les règles
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              (acc[revenu.nature]?.montantAnnuel ?? 0) + revenu.montantAnnuel,
          },
        }),
      {} as Record<Revenu["nature"], Revenu>,
    ),
  );
}
