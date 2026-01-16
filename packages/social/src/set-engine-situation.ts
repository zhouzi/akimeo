import type Engine from "publicodes";

export function setEngineSituation<T extends Record<string, string | number>>(
  engine: Engine,
  situation: T,
) {
  return engine.setSituation(
    Object.entries(situation).reduce(
      (acc, [key, value]) =>
        Object.assign(acc, {
          [key]:
            typeof value === "number"
              ? {
                  valeur: value,
                  unité: "€/an",
                }
              : value,
        }),
      {},
    ),
  );
}
