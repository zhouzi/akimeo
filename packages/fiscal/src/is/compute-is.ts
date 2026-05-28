import { trancherIS } from "./trancher-is";

export function computeIS(resultatAvantImpot: number) {
  return trancherIS(resultatAvantImpot).reduce(
    (acc, tranche) => acc + tranche.impot,
    0,
  );
}
