import type { Enfant } from "@akimeo/modele/personne";
import { calculerIRComplet } from "@akimeo/fiscal/calculer-ir-complet";
import { calculerTauxIR } from "@akimeo/fiscal/calculer-taux-ir";
import { calculerTMI } from "@akimeo/fiscal/calculer-tmi";
import { NATURE_DON, NATURE_DON_OPTIONS } from "@akimeo/modele/don";
import {
  TYPE_EMPLOI_A_DOMICILE,
  TYPE_EMPLOI_A_DOMICILE_OPTIONS,
} from "@akimeo/modele/emploi-a-domicile";
import {
  FORMAT_EUROS_OPTIONS,
  formatEuros,
  formatPercentage,
} from "@akimeo/modele/format";
import {
  creerFoyer,
  foyerSchema,
  IMPOSITION_RCM,
  SITUATION_FAMILIALE,
  SITUATION_FAMILIALE_OPTIONS,
} from "@akimeo/modele/foyer";
import {
  creerAdulte,
  creerEnfant,
  SCOLARTIE_ENFANT,
  SCOLARTIE_ENFANT_OPTIONS,
  setNombreEnfants,
} from "@akimeo/modele/personne";
import { ENVELOPPE_PLACEMENT } from "@akimeo/modele/placement";
import {
  isNatureRevenuMicroEntreprise,
  NATURE_REVENU,
  NATURE_REVENU_OPTIONS,
} from "@akimeo/modele/revenu";
import { Button } from "@akimeo/ui/components/button";
import { Checkbox } from "@akimeo/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@akimeo/ui/components/dropdown-menu";
import { useAppForm, withForm } from "@akimeo/ui/components/form";
import {
  FormControl,
  FormItem,
  FormLabel,
} from "@akimeo/ui/components/form-item";
import { Label } from "@akimeo/ui/components/label";
import {
  NumberFrequenceInput,
  NumberInputField,
} from "@akimeo/ui/components/number-input";
import {
  Select,
  SelectContent,
  SelectField,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@akimeo/ui/components/select";
import { SwitchField } from "@akimeo/ui/components/switch";
import { formOptions } from "@tanstack/react-form";
import {
  ChartNoAxesColumnIncreasing,
  Landmark,
  Percent,
  Plus,
  X,
} from "lucide-react";
import z from "zod";

import { SimulateurCard } from "~/components/simulateur-card";

const formSchema = z.object({
  foyer: foyerSchema,
});

const defaultValues: z.infer<typeof formSchema> = {
  foyer: creerFoyer({
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

const AdulteForm = withForm({
  ...formOpts,
  props: {
    name: "declarant1" as "declarant1" | "declarant2",
  },
  render: ({ form, name }) => {
    return (
      <>
        <form.AppField
          name={`foyer.${name}.revenus`}
          mode="array"
          children={(fieldRevenus) => (
            <>
              {fieldRevenus.state.value.map((revenu, index) => (
                <form.AppField
                  key={index}
                  name={`foyer.${name}.revenus[${index}].montantAnnuel`}
                  children={(field) => (
                    <FormItem>
                      <div className="relative">
                        <FormLabel>
                          <Label>
                            {
                              NATURE_REVENU_OPTIONS.find(
                                (option) => option.value === revenu.nature,
                              )!.label
                            }
                          </Label>
                        </FormLabel>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-1/2 right-0 size-6 -translate-y-1/2"
                          onClick={() => fieldRevenus.removeValue(index)}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                      <NumberFrequenceInput
                        onValueChange={field.setValue}
                        value={field.state.value}
                        min={0}
                        format={FORMAT_EUROS_OPTIONS}
                        placeholder={formatEuros(0)}
                      />
                    </FormItem>
                  )}
                />
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <span>Ajouter un revenu</span>
                    <Plus />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {NATURE_REVENU_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() =>
                        fieldRevenus.pushValue({
                          nature: option.value,
                          montantAnnuel: 0,
                        })
                      }
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <form.Subscribe
                selector={(state) =>
                  state.values.foyer[name]!.revenus.some((revenu) =>
                    isNatureRevenuMicroEntreprise(revenu.nature),
                  )
                }
                children={(hasMicroEntreprise) =>
                  hasMicroEntreprise && (
                    <form.AppField
                      name={`foyer.${name}.versementLiberatoire`}
                      children={(field) => (
                        <field.SwitchField label="Versement libératoire" />
                      )}
                    />
                  )
                }
              />
            </>
          )}
        />
      </>
    );
  },
});

export function ImpotRevenu() {
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
        title="Impôt sur le revenu"
        description="Calcule ton impôt en fonction de tes revenus et de ta situation."
      >
        <div className="space-y-6">
          <form.Subscribe
            selector={(state) => {
              const ir = calculerIRComplet(state.values.foyer);
              const tmi = calculerTMI(state.values.foyer);
              const tauxIR = calculerTauxIR(state.values.foyer);

              return {
                ir: ir,
                tmi: tmi,
                tauxIR: tauxIR,
              };
            }}
            children={({ ir, tmi, tauxIR }) => (
              <div className="grid gap-4 @md/card:grid-cols-3">
                {[
                  {
                    icon: Landmark,
                    label: "Impôt sur le revenu",
                    value: formatEuros(ir),
                  },
                  {
                    icon: ChartNoAxesColumnIncreasing,
                    label: "Tranche max (TMI)",
                    value: formatPercentage(tmi.rate),
                  },
                  {
                    icon: Percent,
                    label: "Taux d'imposition",
                    value: formatPercentage(tauxIR),
                  },
                ].map((item) => (
                  <div key={item.label} className="flex gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted text-primary">
                      <item.icon size={18} />
                    </div>
                    <div className="pt-1">
                      <p className="text-lg font-medium">{item.value}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          />
          <div className="grid items-start gap-4 @lg/card:grid-cols-2">
            <div className="space-y-4">
              <div className="grid gap-4 @2xl/card:grid-cols-2">
                <form.AppField
                  name="foyer.situationFamiliale"
                  children={(field) => (
                    <SelectField
                      label="Situation familiale"
                      options={SITUATION_FAMILIALE_OPTIONS}
                      className="w-full"
                      onChange={(value) => {
                        form.setFieldValue("foyer", (currentFoyer) => {
                          switch (value) {
                            case SITUATION_FAMILIALE.celibataire.value:
                            case SITUATION_FAMILIALE.veuf.value:
                            case SITUATION_FAMILIALE.divorce.value:
                              return {
                                ...currentFoyer,
                                situationFamiliale: value,
                                declarant2: undefined,
                              };
                            case SITUATION_FAMILIALE.concubinage.value:
                            case SITUATION_FAMILIALE.marie.value:
                            case SITUATION_FAMILIALE.pacse.value:
                              return {
                                ...currentFoyer,
                                situationFamiliale: value,
                                declarant2:
                                  currentFoyer.declarant2 ?? creerAdulte({}),
                              };
                          }
                        });
                      }}
                      value={field.state.value}
                    />
                  )}
                />
                <form.AppField
                  name="foyer.enfants"
                  children={(field) => (
                    <NumberInputField
                      label="Enfants"
                      onChange={(value) =>
                        field.setValue(
                          setNombreEnfants(field.state.value, value),
                        )
                      }
                      value={field.state.value.length}
                      min={0}
                      placeholder="0"
                    />
                  )}
                />
              </div>
              <div className="space-y-4 rounded-md border p-4">
                <p className="font-heading text-lg font-medium">Tes revenus</p>
                <AdulteForm form={form} name="declarant1" />
              </div>
              <form.Subscribe
                selector={(state) => !!state.values.foyer.declarant2}
                children={(hasDeclarant2) =>
                  hasDeclarant2 && (
                    <div className="space-y-4 rounded-md border p-4">
                      <p className="font-heading text-lg font-medium">
                        Revenus conjoint(e)
                      </p>
                      <AdulteForm form={form} name="declarant2" />
                    </div>
                  )
                }
              />
              <form.Subscribe
                selector={(state) =>
                  state.values.foyer.declarant1.revenus.some(
                    (revenu) => revenu.nature === NATURE_REVENU.rcm.value,
                  )
                }
                children={(hasRCM) =>
                  hasRCM && (
                    <form.AppField
                      name="foyer.impositionRCM"
                      children={(field) => (
                        <SwitchField
                          label="Flat tax"
                          onChange={(checked) =>
                            field.setValue(
                              checked
                                ? IMPOSITION_RCM.pfu.value
                                : IMPOSITION_RCM.bareme.value,
                            )
                          }
                          value={field.state.value === IMPOSITION_RCM.pfu.value}
                        />
                      )}
                    />
                  )
                }
              />
            </div>
            <div className="overflow-hidden rounded-md border">
              <p className="p-4 font-heading text-lg font-medium">
                Avantages fiscaux
              </p>
              <form.AppField
                name="foyer.declarant1.placements"
                mode="array"
                children={(fieldPlacements) => (
                  <div className="border-t">
                    <label className="flex items-center gap-2 p-4 hover:bg-accent">
                      <Checkbox
                        onCheckedChange={(checked) =>
                          checked
                            ? fieldPlacements.setValue([
                                {
                                  enveloppe: ENVELOPPE_PLACEMENT.per.value,
                                  versementsAnnuels: 0,
                                },
                              ])
                            : fieldPlacements.setValue([])
                        }
                        checked={fieldPlacements.state.value.length > 0}
                      />
                      <span>Versements sur un PER</span>
                    </label>
                    {fieldPlacements.state.value.length > 0 && (
                      <div className="p-4 pt-0">
                        {fieldPlacements.state.value.map((_, index) => (
                          <form.AppField
                            key={index}
                            name={`foyer.declarant1.placements[${index}].versementsAnnuels`}
                            children={(field) => (
                              <field.NumberFrequenceInputField
                                label="Montant des versements"
                                description="Dans la limite du plafond de déduction disponible."
                                min={0}
                                format={FORMAT_EUROS_OPTIONS}
                                placeholder={formatEuros(0)}
                              />
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              />
              <form.AppField
                name="foyer.declarant1.dons"
                mode="array"
                children={(fieldDons) => (
                  <div className="border-t">
                    <label className="flex items-center gap-2 p-4 hover:bg-accent">
                      <Checkbox
                        onCheckedChange={(checked) =>
                          checked
                            ? fieldDons.setValue([
                                {
                                  nature: NATURE_DON.utilitePublique.value,
                                  montantAnnuel: 0,
                                },
                              ])
                            : fieldDons.setValue([])
                        }
                        checked={fieldDons.state.value.length > 0}
                      />
                      <span>Dons</span>
                    </label>
                    {fieldDons.state.value.length > 0 && (
                      <div className="space-y-4 p-4 pt-0">
                        {fieldDons.state.value.map((don, index) => (
                          <form.AppField
                            key={index}
                            name={`foyer.declarant1.dons[${index}].montantAnnuel`}
                            children={(field) => (
                              <FormItem>
                                <div className="relative">
                                  <FormLabel>
                                    <Label>
                                      {
                                        NATURE_DON_OPTIONS.find(
                                          (option) =>
                                            option.value === don.nature,
                                        )!.label
                                      }
                                    </Label>
                                  </FormLabel>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-1/2 right-0 size-6 -translate-y-1/2"
                                    onClick={() => fieldDons.removeValue(index)}
                                  >
                                    <X className="size-4" />
                                  </Button>
                                </div>
                                <NumberFrequenceInput
                                  onValueChange={field.setValue}
                                  value={field.state.value}
                                  min={0}
                                  format={FORMAT_EUROS_OPTIONS}
                                  placeholder={formatEuros(0)}
                                />
                              </FormItem>
                            )}
                          />
                        ))}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full">
                              <span>Ajouter un don</span>
                              <Plus />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {NATURE_DON_OPTIONS.map((option) => (
                              <DropdownMenuItem
                                key={option.value}
                                onClick={() =>
                                  fieldDons.pushValue({
                                    nature: option.value,
                                    montantAnnuel: 0,
                                  })
                                }
                              >
                                {option.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                )}
              />
              <form.AppField
                name="foyer.enfants"
                mode="array"
                children={(fieldEnfants) => {
                  const checked = fieldEnfants.state.value.some(
                    (enfant) => enfant.scolarite != null,
                  );
                  return (
                    <div className="border-t">
                      <label className="flex items-center gap-2 p-4 hover:bg-accent">
                        <Checkbox
                          onCheckedChange={(checked) => {
                            if (checked) {
                              fieldEnfants.setValue((enfants) => {
                                const firstEnfant =
                                  enfants[0] ?? creerEnfant({});
                                return [
                                  {
                                    ...firstEnfant,
                                    scolarite: SCOLARTIE_ENFANT.collegien.value,
                                  } as Enfant,
                                ].concat(enfants.slice(1));
                              });
                              return;
                            }

                            fieldEnfants.setValue(
                              fieldEnfants.state.value.map((enfant) => ({
                                ...enfant,
                                scolarite: null,
                              })),
                            );
                          }}
                          checked={checked}
                        />
                        <span>Enfants scolarisés</span>
                      </label>
                      {checked && (
                        <div className="space-y-4 p-4 pt-0">
                          {fieldEnfants.state.value.map((enfant, index) => (
                            <FormItem key={index}>
                              <div className="relative">
                                <FormLabel>
                                  <Label>Enfant {index + 1}</Label>
                                </FormLabel>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-1/2 right-0 size-6 -translate-y-1/2"
                                  onClick={() =>
                                    fieldEnfants.removeValue(index)
                                  }
                                >
                                  <X className="size-4" />
                                </Button>
                              </div>
                              <Select
                                onValueChange={(value) => {
                                  switch (value) {
                                    case SCOLARTIE_ENFANT.collegien.value:
                                    case SCOLARTIE_ENFANT.lyceen.value:
                                    case SCOLARTIE_ENFANT.etudiant.value:
                                      fieldEnfants.replaceValue(index, {
                                        ...enfant,
                                        scolarite: value,
                                      });
                                      break;
                                    default:
                                      fieldEnfants.replaceValue(index, {
                                        ...enfant,
                                        scolarite: null,
                                      });
                                      break;
                                  }
                                }}
                                value={enfant.scolarite ?? ""}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Non scolarisé" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {[
                                    {
                                      label: "Non scolarisé",
                                      value: "non-scolarise" as const,
                                    },
                                    ...SCOLARTIE_ENFANT_OPTIONS,
                                  ].map((option, index) => (
                                    <SelectItem
                                      key={index}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          ))}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="w-full">
                                <span>Ajouter un enfant</span>
                                <Plus />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {SCOLARTIE_ENFANT_OPTIONS.map((option) => (
                                <DropdownMenuItem
                                  key={option.value}
                                  onClick={() =>
                                    fieldEnfants.pushValue(
                                      creerEnfant({
                                        scolarite: option.value,
                                      }),
                                    )
                                  }
                                >
                                  {option.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  );
                }}
              />
              <form.AppField
                name="foyer.emploisADomicile"
                mode="array"
                children={(fieldEmploisADomicile) => (
                  <div className="border-t">
                    <label className="flex items-center gap-2 p-4 hover:bg-accent">
                      <Checkbox
                        onCheckedChange={(checked) =>
                          checked
                            ? fieldEmploisADomicile.setValue([
                                {
                                  type: TYPE_EMPLOI_A_DOMICILE.menage.value,
                                  remunerationAnnuelle: 0,
                                },
                              ])
                            : fieldEmploisADomicile.setValue([])
                        }
                        checked={fieldEmploisADomicile.state.value.length > 0}
                      />
                      <span>Emploi à domicile</span>
                    </label>
                    {fieldEmploisADomicile.state.value.length > 0 && (
                      <div className="space-y-4 p-4 pt-0">
                        {fieldEmploisADomicile.state.value.map(
                          (emploiADomicile, index) => (
                            <form.AppField
                              key={index}
                              name={`foyer.emploisADomicile[${index}].remunerationAnnuelle`}
                              children={(field) => (
                                <FormItem>
                                  <div className="relative">
                                    <FormLabel>
                                      <Label>
                                        {
                                          TYPE_EMPLOI_A_DOMICILE_OPTIONS.find(
                                            (option) =>
                                              option.value ===
                                              emploiADomicile.type,
                                          )!.label
                                        }
                                      </Label>
                                    </FormLabel>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="absolute top-1/2 right-0 size-6 -translate-y-1/2"
                                      onClick={() =>
                                        fieldEmploisADomicile.removeValue(index)
                                      }
                                    >
                                      <X className="size-4" />
                                    </Button>
                                  </div>
                                  <NumberFrequenceInput
                                    onValueChange={field.setValue}
                                    value={field.state.value}
                                    min={0}
                                    format={FORMAT_EUROS_OPTIONS}
                                    placeholder={formatEuros(0)}
                                  />
                                </FormItem>
                              )}
                            />
                          ),
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full">
                              <span>Ajouter un employé</span>
                              <Plus />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {TYPE_EMPLOI_A_DOMICILE_OPTIONS.map((option) => (
                              <DropdownMenuItem
                                key={option.value}
                                onClick={() =>
                                  fieldEmploisADomicile.pushValue({
                                    type: option.value,
                                    remunerationAnnuelle: 0,
                                  })
                                }
                              >
                                {option.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </SimulateurCard>
    </form>
  );
}
