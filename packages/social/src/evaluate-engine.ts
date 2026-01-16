import type Engine from "publicodes";
import { round } from "es-toolkit";

export function evaluateEngine(engine: Engine, valeur: string) {
  const { nodeValue } = engine.evaluate({
    valeur: valeur,
    unité: "€/an",
    arrondi: "non",
  });

  return typeof nodeValue !== "number" || isNaN(nodeValue)
    ? 0
    : round(nodeValue, 2);
}
