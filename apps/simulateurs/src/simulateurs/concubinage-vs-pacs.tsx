import type { Foyer } from "@akimeo/modele";
import { calculerIR } from "@akimeo/fiscal/ir/calculer-ir";
import {
  creerFoyer,
  foyerSchema,
  isNatureRevenuMicroEntreprise,
  NATURE_REVENU,
  pacser,
  setNombreEnfants,
  SITUATION_FAMILIALE,
} from "@akimeo/modele";
import { useAppForm, withFieldGroup } from "@akimeo/ui/components/form";
import { Slider, SliderField } from "@akimeo/ui/components/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@akimeo/ui/components/table";
import { formOptions } from "@tanstack/react-form";
import { Armchair, BedDouble, Sofa } from "lucide-react";
import z from "zod";

import { FORMAT_EUROS_OPTIONS, formatEuros } from "~/lib/format";

const formSchema = z.object({
  foyer1: foyerSchema,
  foyer2: foyerSchema,
});

const defaultValues: z.infer<typeof formSchema> = {
  foyer1: creerFoyer({
    situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
    declarant1: {
      revenus: [
        {
          nature: NATURE_REVENU.salaire.value,
          montantAnnuel: 0,
        },
      ],
    },
  }),
  foyer2: creerFoyer({
    situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
    declarant1: {
      revenus: [
        {
          nature: NATURE_REVENU.salaire.value,
          montantAnnuel: 0,
        },
      ],
    },
  }),
};

const formOpts = formOptions({
  validators: {
    onChange: formSchema,
  },
  defaultValues,
});

const FoyerFieldGroup = withFieldGroup({
  defaultValues: {
    foyer: creerFoyer({
      situationFamiliale: SITUATION_FAMILIALE.celibataire.value,
    }) as Foyer,
  },
  render: ({ group }) => {
    return (
      <>
        <div className="grid gap-2">
          <div className="grid grid-cols-2 gap-2">
            <group.AppField
              name="foyer.declarant1.revenus[0].nature"
              children={(field) => (
                <field.SelectField
                  options={[
                    NATURE_REVENU.salaire,
                    NATURE_REVENU.remuneration,
                    NATURE_REVENU.microBICMarchandises,
                    NATURE_REVENU.microBICServices,
                    NATURE_REVENU.microBNC,
                  ]}
                />
              )}
            />
            <group.AppField
              name="foyer.declarant1.revenus[0].montantAnnuel"
              children={(field) => (
                <field.NumberFrequenceInputField
                  step={1000}
                  min={0}
                  placeholder={formatEuros(0)}
                  format={FORMAT_EUROS_OPTIONS}
                />
              )}
            />
          </div>
          <group.AppField
            name="foyer.declarant1.revenus[0].montantAnnuel"
            children={(field) => (
              <Slider
                onValueChange={([montant]) => field.handleChange(montant!)}
                value={[field.state.value]}
                min={0}
                max={200000}
                step={1000}
              />
            )}
          />
        </div>
        <group.Subscribe
          selector={(state) =>
            state.values.foyer.declarant1.revenus.some((revenu) =>
              isNatureRevenuMicroEntreprise(revenu.nature),
            )
          }
          children={(hasMicroEntrepriseRevenus) =>
            hasMicroEntrepriseRevenus && (
              <group.AppField
                name="foyer.declarant1.versementLiberatoire"
                children={(field) => (
                  <field.SwitchField label="Versement libératoire" />
                )}
              />
            )
          }
        />
        <group.AppField
          name="foyer.enfants"
          children={(field) => (
            <SliderField
              label="Enfants"
              onChange={([nombre]) =>
                field.setValue(setNombreEnfants(field.state.value, nombre!))
              }
              value={[field.state.value.length]}
              min={0}
              max={10}
              step={1}
            />
          )}
        />
      </>
    );
  },
});

export function ConcubinageVSPacs() {
  const form = useAppForm({
    ...formOpts,
  });

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await form.handleSubmit();
      }}
    >
      <div className="grid gap-4 @2xl/card:grid-cols-2">
        <div className="space-y-4 rounded-md border p-4">
          <p className="font-heading text-lg font-medium">Personne 1</p>
          <FoyerFieldGroup form={form} fields={{ foyer: "foyer1" }} />
        </div>
        <div className="space-y-4 rounded-md border p-4">
          <p className="font-heading text-lg font-medium">Personne 2</p>
          <FoyerFieldGroup form={form} fields={{ foyer: "foyer2" }} />
        </div>
      </div>
      <form.Subscribe
        selector={(state) => {
          const foyer1 = calculerIR(state.values.foyer1);
          const foyer2 = calculerIR(state.values.foyer2);
          const concubinage = foyer1 + foyer2;
          const pacs = calculerIR(
            pacser(state.values.foyer1, state.values.foyer2),
          );

          return {
            foyer1,
            foyer2,
            concubinage,
            pacs,
          };
        }}
        children={({ foyer1, foyer2, concubinage, pacs }) => (
          <Table className="mt-6">
            <TableHeader>
              <TableRow>
                <TableHead>Situation</TableHead>
                <TableHead className="text-right">
                  Impôt sur le revenu
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { icon: Armchair, label: "Personne 1", ir: foyer1 },
                { icon: Armchair, label: "Personne 2", ir: foyer2 },
                {
                  icon: Sofa,
                  label: "Personne 1 + Personne 2, en concubinage",
                  ir: concubinage,
                },
                {
                  icon: BedDouble,
                  label: "Personne 1 + Personne 2, en Pacs",
                  ir: pacs,
                },
              ].map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <row.icon className="text-primary" />
                      <span>{row.label}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatEuros(row.ir)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      />
    </form>
  );
}
