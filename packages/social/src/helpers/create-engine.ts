import type { ParsedRules, RawPublicodes } from "publicodes";
import Engine from "publicodes";

export function createEngine<RuleNames extends string>(
  rules: RawPublicodes<RuleNames> | ParsedRules<RuleNames>,
): Engine<RuleNames> {
  return new Engine(rules, {
    logger: {
      log: () => {
        // noop
      },
      // eslint-disable-next-line no-console
      error: console.error.bind(console),
      warn: () => {
        // noop
      },
    },
  });
}
