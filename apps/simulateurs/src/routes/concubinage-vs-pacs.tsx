import { calculerIR } from "@akimeo/fiscal/calculer-ir";
import { FORMAT_EUROS_OPTIONS, formatEuros } from "@akimeo/modele/format";
import { creerFoyer, foyerSchema, pacser } from "@akimeo/modele/foyer";
import { setNombreEnfants } from "@akimeo/modele/personne";
import { calculerSommeRevenus, setMontantRevenus } from "@akimeo/modele/revenu";
import { SliderField } from "@akimeo/ui/slider";
import { formOptions } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import {
  Armchair,
  Equal,
  Landmark,
  Sofa,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import z from "zod";

import { useAppForm } from "~/components/form";
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
          <div className="bg-primary/10 space-y-4 rounded-md p-4">
            <p className="text-lg font-medium">Personne 1</p>
            <form.AppField
              name="foyer1.declarant1.revenus"
              children={(field) => (
                <SliderField
                  label="Revenus"
                  onChange={(montant) =>
                    field.setValue(
                      setMontantRevenus(field.state.value, montant),
                    )
                  }
                  value={calculerSommeRevenus(field.state.value)}
                  minValue={0}
                  maxValue={200000}
                  step={500}
                  formatOptions={FORMAT_EUROS_OPTIONS}
                />
              )}
            />
            <form.AppField
              name="foyer1.enfants"
              children={(field) => (
                <SliderField
                  label="Enfants"
                  onChange={(nombre) =>
                    field.setValue(setNombreEnfants(field.state.value, nombre))
                  }
                  value={field.state.value.length}
                  minValue={0}
                  maxValue={10}
                  step={1}
                />
              )}
            />
            <form.Subscribe
              selector={(state) => calculerIR(state.values.foyer1)}
              children={(ir) => (
                <div className="flex items-center gap-2">
                  <Landmark className="text-primary size-5" />{" "}
                  <p>IR : {formatEuros(ir)}</p>
                </div>
              )}
            />
          </div>
          <div className="bg-primary/10 space-y-4 rounded-md p-4">
            <p className="text-lg font-medium">Personne 2</p>
            <form.AppField
              name="foyer2.declarant1.revenus"
              children={(field) => (
                <SliderField
                  label="Revenus"
                  onChange={(montant) =>
                    field.setValue(
                      setMontantRevenus(field.state.value, montant),
                    )
                  }
                  value={calculerSommeRevenus(field.state.value)}
                  minValue={0}
                  maxValue={200000}
                  step={500}
                  formatOptions={FORMAT_EUROS_OPTIONS}
                />
              )}
            />
            <form.AppField
              name="foyer2.enfants"
              children={(field) => (
                <SliderField
                  label="Enfants"
                  onChange={(nombre) =>
                    field.setValue(setNombreEnfants(field.state.value, nombre))
                  }
                  value={field.state.value.length}
                  minValue={0}
                  step={1}
                  maxValue={10}
                />
              )}
            />
            <form.Subscribe
              selector={(state) => calculerIR(state.values.foyer2)}
              children={(ir) => (
                <div className="flex items-center gap-2">
                  <Landmark className="text-primary size-5" />{" "}
                  <p>IR : {formatEuros(ir)}</p>
                </div>
              )}
            />
          </div>
        </div>
        <form.Subscribe
          selector={(state) => {
            const celibataires =
              calculerIR(state.values.foyer1) + calculerIR(state.values.foyer2);
            const couple = calculerIR(
              pacser(state.values.foyer1, state.values.foyer2),
            );

            return {
              celibataires,
              couple,
              difference: couple - celibataires,
            };
          }}
          children={({ celibataires, couple, difference }) => (
            <div className="grid gap-8 @md:grid-cols-3">
              <div className="flex gap-2">
                <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full [&>svg]:size-5">
                  <Armchair />
                </div>
                <div className="pt-1">
                  <p className="text-xl font-medium">
                    {formatEuros(celibataires)}
                  </p>
                  <p className="text-sm">Concubinage</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full [&>svg]:size-5">
                  <Sofa />
                </div>
                <div className="pt-1">
                  <p className="text-xl font-medium">{formatEuros(couple)}</p>
                  <p className="text-sm">PACS</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full [&>svg]:size-5">
                  {difference === 0 ? (
                    <Equal />
                  ) : difference > 0 ? (
                    <TrendingUp />
                  ) : (
                    <TrendingDown />
                  )}
                </div>
                <div className="pt-1">
                  <p className="text-xl font-medium">
                    {formatEuros(difference, { signDisplay: "exceptZero" })}
                  </p>
                  <p className="text-sm">Différence</p>
                </div>
              </div>
            </div>
          )}
        />
      </SimulateurCard>
    </form>
  );
}
