import { ConcubinageVSPacs } from "./concubinage-vs-pacs";
import { ImpotRevenu } from "./impot-revenu";

export default [
  {
    slug: "concubinage-vs-pacs",
    title: "Concubinage vs PACS",
    description:
      "Aperçu de l'impact du PACS sur l'impôt sur le revenu d'un couple.",
    simulateur: ConcubinageVSPacs,
  },
  {
    slug: "impot-revenu",
    title: "Impôt sur le revenu",
    description:
      "Calcule ton impôt en fonction de tes revenus et de ta situation.",
    simulateur: ImpotRevenu,
  },
];
