import rules from "@akimeo/modele-social";
import Engine from "publicodes";

export function createEngine(): Engine {
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
