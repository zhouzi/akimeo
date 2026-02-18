import { differenceInYears } from "date-fns/differenceInYears";
import { subYears } from "date-fns/subYears";
import set from "lodash.set";
import { parse } from "yaml";

import type { Branch, LeafValue } from "./types";

function getLatestValue(values: Record<string, { value: LeafValue }>) {
  const [latestValue] = Object.entries(values).sort(
    ([a], [b]) => new Date(b).getTime() - new Date(a).getTime(),
  );
  const [, { value }] = latestValue!;

  return value;
}

export async function fetchFromOpenFiscaFrance() {
  const output: Branch = {};
  const warnings: string[] = [];

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
    "impot_revenu/calcul_impot_revenu/plaf_qf/quotient_familial/cas_general/veuf",
    "impot_revenu/calcul_impot_revenu/plaf_qf/plafond_avantages_procures_par_demi_part/reduc_postplafond_veuf",
    "impot_revenu/calcul_revenus_imposables/rpns/microsocial/servi",
    "impot_revenu/calcul_revenus_imposables/rpns/microsocial/vente",
    "impot_revenu/calcul_revenus_imposables/rpns/microsocial/bnc",
    "impot_revenu/credits_impots/gardenf/taux",
    "impot_revenu/credits_impots/gardenf/plafond",
    "taxation_societes/impot_societe/seuil_superieur_benefices_taux_reduit",
    "taxation_societes/impot_societe/taux_normal",
    "taxation_societes/impot_societe/taux_reduit",
    "taxation_indirecte/tva/taux_reduit",
    "taxation_indirecte/tva/taux_intermediaire",
    "taxation_indirecte/tva/taux_normal",
    "taxation_indirecte/tva/taux_particulier_super_reduit",
    "marche_travail/salaire_minimum/smic/smic_b_mensuel",
    "prelevements_sociaux/pss/plafond_securite_sociale_annuel",
    "prelevements_sociaux/pss/plafond_securite_sociale_mensuel",
  ];

  for (const regle of regles) {
    const fileUrl = `https://raw.githubusercontent.com/openfisca/openfisca-france/refs/heads/master/openfisca_france/parameters/${regle}.yaml`;

    const res = await fetch(fileUrl);

    if (!res.ok) {
      throw new Error(
        `🚨 ${regle} n'a pas pu être téléchargée : ${res.statusText}`,
      );
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
        last_value_still_valid_on?: string;
      };
    };

    const lastValueStillValidOn = new Date(
      json.metadata.last_value_still_valid_on ??
        // TODO: récupérer la dernière date de mise à jour de la valeur à défaut de "last_value_still_valid_on"
        subYears(aujourdhui, 30),
    );
    const lastValueInvalidSinceYears = differenceInYears(
      aujourdhui,
      lastValueStillValidOn,
    );

    if (lastValueInvalidSinceYears >= 1) {
      warnings.push(
        `⚠️ ${regle} a été vérifiée pour la dernière fois il y a ${lastValueInvalidSinceYears} an(s)`,
      );
    }

    const value =
      "values" in json
        ? getLatestValue(json.values)
        : json.brackets
            .filter((bracket) =>
              Object.values(bracket).some(
                (value) => getLatestValue(value) != null,
              ),
            )
            .map((bracket) =>
              Object.entries(bracket).reduce<Record<string, LeafValue>>(
                (acc, [key, value]) =>
                  Object.assign(acc, {
                    [key]: getLatestValue(value),
                  }),
                {},
              ),
            );

    if (
      (Array.isArray(value) &&
        value.some((obj) =>
          Object.values(obj).some((objValue) => objValue == null),
        )) ||
      value == null
    ) {
      warnings.push(
        `⚠️ ${regle} a produit des valeurs vides qui suggèrent qu'elle n'est plus applicable`,
      );
    }

    set(output, regle.split("/").join("."), {
      url: fileUrl,
      description: json.description,
      value: value,
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return { output, warnings };
}
