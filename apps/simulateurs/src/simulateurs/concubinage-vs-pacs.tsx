import { calculerIR } from "@akimeo/fiscal/ir/calculer-ir";
import {
  creerFoyer,
  foyerSchema,
  isNatureRevenuMicroEntreprise,
  NATURE_REVENU,
  NATURE_REVENU_OPTIONS,
  pacser,
  setNombreEnfants,
} from "@akimeo/modele";
import { Button } from "@akimeo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@akimeo/ui/components/dropdown-menu";
import { useAppForm, withForm } from "@akimeo/ui/components/form";
import { FormItem } from "@akimeo/ui/components/form-item";
import { FrequenceToggle } from "@akimeo/ui/components/frequence-toggle";
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
import {
  Armchair,
  BedDouble,
  CalendarSync,
  ChevronDown,
  Sofa,
} from "lucide-react";
import z from "zod";

import { formatEuros } from "~/lib/format";

const formSchema = z.object({
  foyer1: foyerSchema,
  foyer2: foyerSchema,
});

const defaultValues: z.infer<typeof formSchema> = {
  foyer1: creerFoyer({
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

const PersonneForm = withForm({
  ...formOpts,
  props: {
    name: "foyer1" as "foyer1" | "foyer2",
  },
  render: ({ form, name }) => {
    return (
      <>
        <form.AppField
          name={`${name}.declarant1.revenus[0]`}
          children={(fieldRevenu) => (
            <>
              <form.AppField
                name={`${name}.declarant1.revenus[0].montantAnnuel`}
                children={(fieldMontantAnnuel) => (
                  <FormItem>
                    <div className="flex items-center justify-between gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="xs" className="-ml-2">
                            <span>
                              {
                                NATURE_REVENU_OPTIONS.find(
                                  (option) =>
                                    option.value ===
                                    fieldRevenu.state.value.nature,
                                )!.label
                              }
                            </span>
                            <ChevronDown />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {[
                            NATURE_REVENU.salaire,
                            NATURE_REVENU.remuneration,
                            NATURE_REVENU.microBICMarchandises,
                            NATURE_REVENU.microBICServices,
                            NATURE_REVENU.microBNC,
                          ].map((option) => (
                            <DropdownMenuItem
                              key={option.value}
                              onClick={() =>
                                fieldRevenu.setValue({
                                  nature: option.value,
                                  montantAnnuel:
                                    fieldRevenu.state.value.montantAnnuel,
                                })
                              }
                            >
                              {option.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <FrequenceToggle
                        value={fieldMontantAnnuel.state.value}
                        children={({ value, label, toggleFrequence }) => (
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={toggleFrequence}
                            className="-mr-2"
                          >
                            <span>{formatEuros(value)}</span>
                            <span className="font-normal text-muted-foreground">
                              {label}
                            </span>
                            <CalendarSync />
                          </Button>
                        )}
                      />
                    </div>
                    <Slider
                      onValueChange={([montant]) =>
                        fieldMontantAnnuel.setValue(montant!)
                      }
                      value={[fieldMontantAnnuel.state.value]}
                      min={0}
                      max={200000}
                      step={100}
                    />
                  </FormItem>
                )}
              />
              {isNatureRevenuMicroEntreprise(
                fieldRevenu.state.value.nature,
              ) && (
                <form.AppField
                  name={`${name}.declarant1.versementLiberatoire`}
                  children={(field) => (
                    <field.SwitchField label="Versement libératoire" />
                  )}
                />
              )}
            </>
          )}
        />
        <form.AppField
          name={`${name}.enfants`}
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
          <PersonneForm form={form} name="foyer1" />
        </div>
        <div className="space-y-4 rounded-md border p-4">
          <p className="font-heading text-lg font-medium">Personne 2</p>
          <PersonneForm form={form} name="foyer2" />
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
