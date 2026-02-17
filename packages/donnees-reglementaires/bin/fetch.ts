import fs from "node:fs/promises";
import path from "node:path";
import merge from "lodash.merge";

import type { Branch } from "./fetchers/types";
import { fetchHarcoded } from "./fetchers/hardcoded";
import { fetchFromOpenFiscaFrance } from "./fetchers/openfisca-france";
import { isLeaf } from "./fetchers/types";

function stringify(parent: Branch): string {
  return Object.entries(parent)
    .map(([key, child]) => {
      if (isLeaf(child)) {
        return [
          ``,
          `/**`,
          `* @description ${child.description}`,
          `* {@link ${child.url} Source}`,
          `*/`,
          `${key}: ${
            child.value == null || typeof child.value === "number"
              ? `${child.value},`
              : [
                  `[`,
                  ...child.value.flatMap((value) => [
                    `{`,
                    ...Object.entries(value).map(
                      ([key, value]) => `${key}: ${value},`,
                    ),
                    `},`,
                  ]),
                  `],`,
                ].join("\n")
          }`,
        ].join("\n");
      }
      return [`${key}: {`, stringify(child), `},`].join("\n");
    })
    .join("\n");
}

async function main() {
  const output: Branch = {};
  const warnings: string[] = [];

  for (const fetch of [fetchFromOpenFiscaFrance, fetchHarcoded]) {
    const res = await fetch();

    merge(output, res.output);
    warnings.push(...res.warnings);
  }

  await fs.writeFile(
    path.join(import.meta.dirname, "..", "src", "index.ts"),
    [`export default {`, stringify(output), `} as const;`].join("\n"),
  );

  if (warnings.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(warnings.map((warning) => `- ${warning}`).join("\n"));
  }
}

await main();
