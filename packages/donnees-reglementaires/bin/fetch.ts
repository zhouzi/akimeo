import fs from "node:fs/promises";
import path from "node:path";
import { differenceInYears } from "date-fns/differenceInYears";
import set from "lodash.set";
import { parse } from "yaml";

const aujourdhui = new Date();

const regles = [
  "impot_revenu/calcul_impot_revenu/recouvrement/min_avant_credits_impots",
  "impot_revenu/calcul_reductions_impots/enfants_scolarises/universite",
  "impot_revenu/calcul_reductions_impots/enfants_scolarises/lycee",
  "impot_revenu/calcul_reductions_impots/enfants_scolarises/college",
  "impot_revenu/calcul_impot_revenu/plaf_qf/decote/seuil_celib",
  "impot_revenu/calcul_impot_revenu/plaf_qf/decote/taux",
  "impot_revenu/calcul_impot_revenu/plaf_qf/decote/seuil_couple",
  "impot_revenu/calcul_revenus_imposables/deductions/abatpro/max",
  "impot_revenu/calcul_revenus_imposables/deductions/abatpro/min",
  "impot_revenu/calcul_revenus_imposables/deductions/abatpro/taux",
  "impot_revenu/bareme_ir_depuis_1945/bareme",
  "impot_revenu/calcul_revenus_imposables/rpns/micro/microentreprise/regime_micro_bnc/taux",
  "impot_revenu/calcul_revenus_imposables/rpns/micro/microentreprise/regime_micro_bic/marchandises/taux",
  "impot_revenu/calcul_revenus_imposables/rpns/micro/microentreprise/regime_micro_bic/services/taux",
  "impot_revenu/calcul_revenus_imposables/rpns/micro/microfoncier/taux",
  "impot_revenu/calcul_revenus_imposables/foncier_deduc/plafond",
  "impot_revenu/calcul_impot_revenu/plaf_qf/quotient_familial/cas_general/conj",
  "impot_revenu/calcul_impot_revenu/plaf_qf/quotient_familial/cas_general/enf1",
  "impot_revenu/calcul_impot_revenu/plaf_qf/quotient_familial/cas_general/enf2",
  "impot_revenu/calcul_impot_revenu/plaf_qf/quotient_familial/cas_general/enf3_et_sup",
  "impot_revenu/calcul_impot_revenu/plaf_qf/plafond_avantages_procures_par_demi_part/general",
  "impot_revenu/calcul_revenus_imposables/rvcm/revenus_capitaux_mobiliers_dividendes/taux_abattement",
  "taxation_capital/prelevement_forfaitaire/partir_2018/taux_prelevement_forfaitaire_rev_capital_eligibles_pfu_interets_dividendes_etc",
  "impot_revenu/calcul_reductions_impots/dons/dons_coluche/plafond",
  "impot_revenu/calcul_reductions_impots/dons/dons_coluche/taux",
  "impot_revenu/calcul_reductions_impots/dons/dons_aux_partis_politiques/plafond_seul",
  "impot_revenu/calcul_reductions_impots/dons/dons_aux_partis_politiques/plafond_foyer",
  "impot_revenu/calcul_reductions_impots/dons/taux_reduction",
  "impot_revenu/calcul_reductions_impots/dons/plafond_dons",
  "impot_revenu/credits_impots/emploi_salarie_domicile/taux",
  "impot_revenu/credits_impots/emploi_salarie_domicile/plafond",
  "impot_revenu/credits_impots/emploi_salarie_domicile/increment_plafond",
  "impot_revenu/credits_impots/emploi_salarie_domicile/plafond_maximum",
];

type LeafValue = number | null;

interface Leaf {
  url: string;
  description: string;
  value: LeafValue | Record<string, LeafValue>[];
}

interface Branch {
  [key: string]: Branch | Leaf;
}

function isLeaf(node: Branch | Leaf): node is Leaf {
  return "value" in node;
}

const output: Branch = {};
const warnings: string[] = [];

for (const regle of regles) {
  const fileUrl = `https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/${regle}.yaml`;

  const res = await fetch(fileUrl);

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const content = await res.text();
  const json = parse(content) as (
    | {
        values: Record<string, { value: LeafValue }>;
      }
    | {
        brackets: Record<string, Record<string, { value: LeafValue }>>[];
      }
  ) & {
    description: string;
    metadata: {
      last_value_still_valid_on: string;
    };
  };

  const lastValueStillValidOn = new Date(
    json.metadata.last_value_still_valid_on,
  );
  const lastValueInvalidSinceYears = differenceInYears(
    aujourdhui,
    lastValueStillValidOn,
  );

  if (lastValueInvalidSinceYears >= 1) {
    warnings.push(
      `⚠️ ${regle} a été vérifiée il y a au moins ${lastValueInvalidSinceYears} an(s)`,
    );
  }

  function getLatestValue(values: Record<string, { value: LeafValue }>) {
    const [latestValue] = Object.entries(values).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime(),
    );
    const [, { value }] = latestValue!;

    return value;
  }

  set(output, regle.split("/").join("."), {
    url: fileUrl,
    description: json.description,
    value:
      "values" in json
        ? getLatestValue(json.values)
        : json.brackets
            .filter((bracket) =>
              Object.values(bracket).some(
                (value) => getLatestValue(value) != null,
              ),
            )
            .map((bracket) =>
              Object.entries(bracket).reduce(
                (acc, [key, value]) =>
                  Object.assign(acc, {
                    [key]: getLatestValue(value),
                  }),
                {},
              ),
            ),
  });

  await new Promise((resolve) => setTimeout(resolve, 100));
}

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
            typeof child.value === "number"
              ? `${child.value},`
              : [
                  `[`,
                  ...child.value!.flatMap((value) => [
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

await fs.writeFile(
  path.join(import.meta.dirname, "..", "src", "index.ts"),
  [`export default {`, stringify(output), `} as const;`].join("\n"),
);

if (warnings.length > 0) {
  // eslint-disable-next-line no-console
  console.warn(warnings.map((warning) => `- ${warning}`).join("\n"));
}
