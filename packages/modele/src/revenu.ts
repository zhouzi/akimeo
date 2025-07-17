import z from "zod";

export const NATURE_REVENU = {
  salaire: {
    label: "Salaire",
    value: "salaire" as const,
  },
  remuneration: {
    label: "Rémunération",
    value: "remuneration" as const,
  },
  pensionRetraite: {
    label: "Pension retraite",
    value: "pension-retraite" as const,
  },
  autre: {
    label: "Autre",
    value: "autre" as const,
  },
  bnc: {
    label: "BNC",
    value: "bnc" as const,
  },
  microBNC: {
    label: "Micro BNC",
    value: "micro-bnc" as const,
  },
  bic: {
    label: "BIC",
    value: "bic" as const,
  },
  microBICServices: {
    label: "Micro BIC (services)",
    value: "micro-bic-services" as const,
  },
  microBICMarchandises: {
    label: "Micro BIC (marchandises)",
    value: "micro-bic-marchandises" as const,
  },
  foncier: {
    label: "Foncier",
    value: "foncier" as const,
  },
  microFoncier: {
    label: "Micro foncier",
    value: "micro-foncier" as const,
  },
  rcm: {
    label: "Revenus des capitaux mobiliers",
    value: "rcm" as const,
  },
};

interface RevenuSalaire {
  nature: typeof NATURE_REVENU.salaire.value;
  montantAnnuel: number;
}
const revenuSalaireSchema = z.object({
  nature: z.literal(NATURE_REVENU.salaire.value),
  montantAnnuel: z.number(),
}) satisfies z.ZodType<RevenuSalaire>;

interface RevenuRemuneration {
  nature: typeof NATURE_REVENU.remuneration.value;
  montantAnnuel: number;
}
const revenuRemunerationSchema = z.object({
  nature: z.literal(NATURE_REVENU.remuneration.value),
  montantAnnuel: z.number(),
}) satisfies z.ZodType<RevenuRemuneration>;

interface RevenuPensionRetraite {
  nature: typeof NATURE_REVENU.pensionRetraite.value;
  montantAnnuel: number;
}
const revenuPensionRetraiteSchema = z.object({
  nature: z.literal(NATURE_REVENU.pensionRetraite.value),
  montantAnnuel: z.number(),
}) satisfies z.ZodType<RevenuPensionRetraite>;

interface RevenuAutre {
  nature: typeof NATURE_REVENU.autre.value;
  montantAnnuel: number;
}
const revenuAutreSchema = z.object({
  nature: z.literal(NATURE_REVENU.autre.value),
  montantAnnuel: z.number(),
}) satisfies z.ZodType<RevenuAutre>;

interface RevenuBNC {
  nature: typeof NATURE_REVENU.bnc.value;
  montantAnnuel: number;
}
const revenuBNCSchema = z.object({
  nature: z.literal(NATURE_REVENU.bnc.value),
  montantAnnuel: z.number(),
}) satisfies z.ZodType<RevenuBNC>;

interface RevenuMicroBNC {
  nature: typeof NATURE_REVENU.microBNC.value;
  montantAnnuel: number;
  versementLiberatoire: boolean;
}
const revenuMicroBNCSchema = z.object({
  nature: z.literal(NATURE_REVENU.microBNC.value),
  montantAnnuel: z.number(),
  versementLiberatoire: z.boolean(),
}) satisfies z.ZodType<RevenuMicroBNC>;

interface RevenuBIC {
  nature: typeof NATURE_REVENU.bic.value;
  montantAnnuel: number;
}
const revenuBICSchema = z.object({
  nature: z.literal(NATURE_REVENU.bic.value),
  montantAnnuel: z.number(),
}) satisfies z.ZodType<RevenuBIC>;

interface RevenuMicroBICServices {
  nature: typeof NATURE_REVENU.microBICServices.value;
  montantAnnuel: number;
  versementLiberatoire: boolean;
}
const revenuMicroBICServicesSchema = z.object({
  nature: z.literal(NATURE_REVENU.microBICServices.value),
  montantAnnuel: z.number(),
  versementLiberatoire: z.boolean(),
}) satisfies z.ZodType<RevenuMicroBICServices>;

interface RevenuMicroBICMarchandises {
  nature: typeof NATURE_REVENU.microBICMarchandises.value;
  montantAnnuel: number;
  versementLiberatoire: boolean;
}
const revenuMicroBICMarchandisesSchema = z.object({
  nature: z.literal(NATURE_REVENU.microBICMarchandises.value),
  montantAnnuel: z.number(),
  versementLiberatoire: z.boolean(),
}) satisfies z.ZodType<RevenuMicroBICMarchandises>;

export type RevenuMicroEntreprise =
  | RevenuMicroBICMarchandises
  | RevenuMicroBICServices
  | RevenuMicroBNC;

interface RevenuFoncier {
  nature: typeof NATURE_REVENU.foncier.value;
  montantAnnuel: number;
}
const revenuFoncierSchema = z.object({
  nature: z.literal(NATURE_REVENU.foncier.value),
  montantAnnuel: z.number(),
}) satisfies z.ZodType<RevenuFoncier>;

interface RevenuMicroFoncier {
  nature: typeof NATURE_REVENU.microFoncier.value;
  montantAnnuel: number;
}
const revenuMicroFoncierSchema = z.object({
  nature: z.literal(NATURE_REVENU.microFoncier.value),
  montantAnnuel: z.number(),
}) satisfies z.ZodType<RevenuMicroFoncier>;

interface RevenuRCM {
  nature: typeof NATURE_REVENU.rcm.value;
  montantAnnuel: number;
}
const revenuRCMSchema = z.object({
  nature: z.literal(NATURE_REVENU.rcm.value),
  montantAnnuel: z.number(),
}) satisfies z.ZodType<RevenuRCM>;

export type Revenu =
  | RevenuSalaire
  | RevenuRemuneration
  | RevenuPensionRetraite
  | RevenuAutre
  | RevenuBNC
  | RevenuMicroBNC
  | RevenuBIC
  | RevenuMicroBICServices
  | RevenuMicroBICMarchandises
  | RevenuFoncier
  | RevenuMicroFoncier
  | RevenuRCM;
export const revenuSchema = z.union([
  revenuSalaireSchema,
  revenuRemunerationSchema,
  revenuPensionRetraiteSchema,
  revenuAutreSchema,
  revenuBNCSchema,
  revenuMicroBNCSchema,
  revenuBICSchema,
  revenuMicroBICServicesSchema,
  revenuMicroBICMarchandisesSchema,
  revenuFoncierSchema,
  revenuMicroFoncierSchema,
  revenuRCMSchema,
]) satisfies z.ZodType<Revenu>;

export function isRevenuMicroEntreprise(
  revenu: Revenu,
): revenu is RevenuMicroEntreprise {
  return (
    revenu.nature === NATURE_REVENU.microBICMarchandises.value ||
    revenu.nature === NATURE_REVENU.microBICServices.value ||
    revenu.nature === NATURE_REVENU.microBNC.value
  );
}
