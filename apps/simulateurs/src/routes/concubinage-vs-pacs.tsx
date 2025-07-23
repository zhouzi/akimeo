import { calculerIR } from "@akimeo/fiscal/calculer-ir";
import { formatEuros } from "@akimeo/modele/format";
import { creerFoyer, foyerSchema, pacser } from "@akimeo/modele/foyer";
import { setNombreEnfants } from "@akimeo/modele/personne";
import { calculerSommeRevenus, setMontantRevenus } from "@akimeo/modele/revenu";
import { useAppForm, withForm } from "@akimeo/ui/components/form";
import { SliderField } from "@akimeo/ui/components/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@akimeo/ui/components/table";
import { formOptions } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

import { SimulateurCard } from "~/components/simulateur-card";

const formSchema = z.object({
  foyer1: foyerSchema,
  foyer2: foyerSchema,
});

const defaultValues: z.infer<typeof formSchema> = {
  foyer1: creerFoyer({}),
  foyer2: creerFoyer({}),
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
          name={`${name}.declarant1.revenus`}
          children={(field) => (
            <SliderField
              label="Revenus"
              onChange={([montant]) =>
                field.setValue(setMontantRevenus(field.state.value, montant!))
              }
              value={[calculerSommeRevenus(field.state.value)]}
              min={0}
              max={200000}
              step={500}
              formatValue={formatEuros}
            />
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

export const Route = createFileRoute("/concubinage-vs-pacs")({
  component: RouteComponent,
});

function RouteComponent() {
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
      <SimulateurCard
        title="Concubinage vs PACS"
        description="Aperçu de l'impact du PACS sur l'impôt sur le revenu d'un couple."
        className="@container"
      >
        <div className="grid gap-4 @lg:grid-cols-2">
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
                <TableRow>
                  <TableCell className="font-medium">Personne 1</TableCell>
                  <TableCell className="text-right">
                    {formatEuros(foyer1)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Personne 2</TableCell>
                  <TableCell className="text-right">
                    {formatEuros(foyer2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Personne 1 + Personne 2, en concubinage
                  </TableCell>
                  <TableCell className="text-right">
                    {formatEuros(concubinage)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Personne 1 + Personne 2, en Pacs
                  </TableCell>
                  <TableCell className="text-right">
                    {formatEuros(pacs)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        />
      </SimulateurCard>
    </form>
  );
}
