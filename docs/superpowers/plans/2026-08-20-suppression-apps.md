# Suppression des apps de `main` — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Figer l'état de production actuel sur une branche locale `lts` qui se déploie elle-même, puis ramener `main` à un monorepo de librairies en supprimant `apps/` et `packages/ui`.

**Architecture:** Deux branches locales issues du même commit `d45a7e2`. `lts` conserve le monorepo complet et ne diffère de `d45a7e2` que par le déclencheur du workflow de déploiement des docs. La branche courante `zhouzi/remove-apps-simulateurs-docs` porte trois commits de suppression. Aucune des deux n'est poussée.

**Tech Stack:** pnpm 10.13.1 (workspaces + catalog, `catalogMode: strict`), Turborepo 2.5, TypeScript, Vitest, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-08-20-suppression-apps-design.md`

## Global Constraints

- **Aucun push, aucune PR, aucune modification de configuration de production.** Tout reste local. Ne jamais exécuter `git push`, `gh pr create`, ni toucher aux dashboards Cloudflare / GitHub.
- **Commit de référence de la production : `d45a7e2`.** `lts` doit partir de ce commit exact, pas de `HEAD` — `HEAD` porte déjà le commit de spec `1e43068`, qui n'a rien à faire sur `lts`.
- **Branche de travail pour les suppressions : `zhouzi/remove-apps-simulateurs-docs`.** Ne jamais committer de suppression sur `main`.
- **Nom de la branche de sauvegarde : `lts`** (exactement, en minuscules, sans préfixe).
- **Packages conservés sur `main`** : `donnees-reglementaires`, `fiscal`, `modele`, `pilote-ir`, `comptable`, `finance`, `social`, `embed`, `format-number`, `config/*`. `embed` et `format-number` deviennent orphelins mais sont conservés délibérément — ne pas les supprimer par zèle.
- **Pas de tests unitaires nouveaux à écrire.** Cette opération ne crée aucun comportement : c'est une suppression. La suite de régression, c'est la CI existante du dépôt — `pnpm run build`, `pnpm run typecheck`, `pnpm run ci:lint`, `pnpm run ci:test`. Chaque tâche s'y adosse. Ne pas fabriquer de tests factices pour respecter la forme du TDD.
- **`pnpm run ci:test` a besoin de `PILOTE_IR_API_KEY`.** Si la variable est absente de l'environnement local, les tests de `packages/fiscal` échoueront. Le signaler explicitement dans le rapport de tâche ; ne jamais déclarer la vérification complète si elle ne l'était pas.

---

### Task 1: Créer la branche `lts` et repointer le déploiement des docs

**Files:**
- Create (branche): `lts` à partir de `d45a7e2`
- Modify: `.github/workflows/deploy-docs.yml:4-7`

**Interfaces:**
- Consumes: rien (première tâche)
- Produces: la branche locale `lts`, dont le workflow `Deploy docs` se déclenche sur `push` vers `lts`. Les tâches suivantes n'en dépendent pas techniquement, mais l'ordre compte : `lts` doit exister avant qu'on supprime quoi que ce soit, pour que la sauvegarde précède la destruction.

- [ ] **Step 1: Vérifier l'état de départ**

```bash
git status --short
git rev-parse main d45a7e2
git branch --list lts
```

Attendu : arbre de travail propre (aucune sortie de `git status --short`), les deux `rev-parse` renvoient le même SHA `d45a7e25f6cf75031ebfc589718a78100450f944`, et `git branch --list lts` ne renvoie rien.

Si `lts` existe déjà, s'arrêter et le signaler plutôt que d'écraser une branche existante.

- [ ] **Step 2: Créer la branche `lts` et s'y placer**

```bash
git switch -c lts d45a7e2
git log --oneline -1
```

Attendu : `d45a7e2 Make dateNaissance more stable`. Si la sortie affiche `1e43068 Add design for removing apps from main`, la branche est partie du mauvais commit — supprimer (`git switch - && git branch -D lts`) et recommencer.

- [ ] **Step 3: Repointer le déclencheur du workflow**

Dans `.github/workflows/deploy-docs.yml`, remplacer :

```yaml
on:
  push:
    branches:
      - main
```

par :

```yaml
on:
  push:
    branches:
      - lts
```

Ne rien changer d'autre dans ce fichier : `pnpm turbo run build --filter=docs...`, `SIMULATEURS_HOSTNAME` et `path: ./apps/docs/build` restent valides sur `lts`, qui conserve `apps/docs`.

- [ ] **Step 4: Vérifier que le YAML est valide et que le déclencheur est le bon**

```bash
python3 -c "import yaml,sys; d=yaml.safe_load(open('.github/workflows/deploy-docs.yml')); print(d[True]['push']['branches'])"
```

Attendu : `['lts']`.

(La clé `on` est parsée en booléen `True` par PyYAML — c'est normal, pas un bug du fichier.)

- [ ] **Step 5: Vérifier que la snapshot construit toujours**

```bash
pnpm install --frozen-lockfile
pnpm run build
```

Attendu : les deux commandes réussissent. `lts` est le code de production — s'il ne construit pas, la sauvegarde ne vaut rien. En cas d'échec, s'arrêter et rapporter : ne pas « réparer » du code de production dans le cadre de cette tâche.

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/deploy-docs.yml
git commit -m "Deploy docs from lts

main is about to lose apps/, so the docs deployment moves to this
branch. Requires allowing lts in the github-pages environment's
deployment branches — see the runbook in the design doc."
```

- [ ] **Step 7: Revenir sur la branche de travail**

```bash
git switch zhouzi/remove-apps-simulateurs-docs
pnpm install --frozen-lockfile
git log --oneline -1
```

Attendu : `1e43068 Add design for removing apps from main`. Le `pnpm install` est nécessaire car `node_modules` a été résolu pour `lts` à l'étape 5.

---

### Task 2: Supprimer `apps/` et le workflow de déploiement des docs

**Files:**
- Delete: `apps/docs/` (répertoire complet), `apps/simulateurs/` (répertoire complet, y compris `functions/api/event.ts`), `.github/workflows/deploy-docs.yml`
- Modify: `pnpm-workspace.yaml:1-4`, `turbo.json:10-14`, `pnpm-lock.yaml` (régénéré)

**Interfaces:**
- Consumes: la branche `lts` de la Task 1 existe et contient l'état complet.
- Produces: un dépôt sans répertoire `apps/`. `packages/ui` existe encore mais n'a plus aucun consommateur — c'est la Task 3 qui le retire.

- [ ] **Step 1: Établir la ligne de base verte**

```bash
pnpm run build && pnpm run typecheck && pnpm run ci:lint
```

Attendu : tout passe. On a besoin de savoir que le dépôt était vert *avant* de supprimer, sinon on ne saura pas attribuer un échec ultérieur.

Si quelque chose échoue ici, s'arrêter et le rapporter — c'est une défaillance préexistante, pas une conséquence du plan.

- [ ] **Step 2: Supprimer les applications et le workflow**

```bash
git rm -r --quiet apps .github/workflows/deploy-docs.yml
ls apps 2>&1
```

Attendu : `ls: apps: No such file or directory`. Le répertoire `apps/` disparaît entièrement puisqu'il ne contenait que `docs` et `simulateurs`.

- [ ] **Step 3: Retirer `apps/*` du workspace pnpm**

Dans `pnpm-workspace.yaml`, remplacer :

```yaml
packages:
  - apps/*
  - packages/*
  - config/*
```

par :

```yaml
packages:
  - packages/*
  - config/*
```

Ne pas toucher au bloc `catalog:` dans cette tâche — c'est la Task 4.

- [ ] **Step 4: Retirer la tâche `docs#build` de Turborepo**

Dans `turbo.json`, supprimer ce bloc entier (il référence la cible `docs`, désormais inexistante, et la variable `SIMULATEURS_HOSTNAME`) :

```json
    "docs#build": {
      "dependsOn": ["^build", "@akimeo/fiscal#build"],
      "outputs": ["build/**"],
      "env": ["SIMULATEURS_HOSTNAME"]
    },
```

Le fichier doit rester du JSON valide — attention à la virgule. Après suppression, `"build"` est suivi directement de `"dev"` :

```json
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "persistent": true,
      "cache": false
    },
```

- [ ] **Step 5: Régénérer le lockfile**

```bash
pnpm install
```

Attendu : succès, et `pnpm-lock.yaml` est modifié (les dépendances propres aux apps disparaissent).

```bash
git status --short pnpm-lock.yaml
```

Attendu : `M pnpm-lock.yaml`.

- [ ] **Step 6: Vérifier la régression**

```bash
pnpm install --frozen-lockfile && pnpm run build && pnpm run typecheck && pnpm run ci:lint
```

Attendu : tout passe. Le `--frozen-lockfile` confirme que le lockfile régénéré est cohérent avec les manifestes — c'est exactement ce que fera la CI.

- [ ] **Step 7: Vérifier qu'il ne reste aucune référence aux apps**

```bash
git grep -n -e 'apps/' -e 'SIMULATEURS_HOSTNAME' -e 'simulateurs' -- . ':!docs/superpowers' ':!pnpm-lock.yaml'
```

Attendu : aucune sortie, **sauf** des occurrences dans `README.md` et `CONTRIBUTING.md`, qui sont traitées en Task 4. `docs/superpowers` (spec et plan) est exclu : ces documents parlent légitimement des apps. `pnpm-lock.yaml` est exclu : il est généré, et des noms de paquets tiers peuvent contenir ces motifs sans que ce soit une référence pendante.

Si une occurrence apparaît ailleurs que dans ces deux fichiers markdown, la traiter maintenant et la mentionner dans le rapport de tâche — c'est un cas que le plan n'avait pas anticipé.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Remove apps/

Both apps live on the lts branch now, which also carries the docs
deployment workflow. Drops apps/* from the pnpm workspace and the
docs#build task from turbo.json."
```

---

### Task 3: Supprimer `packages/ui`

**Files:**
- Delete: `packages/ui/` (répertoire complet)
- Modify: `pnpm-lock.yaml` (régénéré)

**Interfaces:**
- Consumes: le dépôt sans `apps/` produit par la Task 2. `@akimeo/ui` n'a plus aucun consommateur depuis cette suppression.
- Produces: un dépôt dont les seuls packages sont les neuf librairies métier + `config/*`.

- [ ] **Step 1: Confirmer que `@akimeo/ui` n'a plus de consommateur**

```bash
git grep -l '@akimeo/ui' -- . ':!packages/ui' ':!docs/superpowers'
```

Attendu : aucune sortie. Si un fichier remonte, s'arrêter : la suppression casserait quelque chose que le design n'avait pas identifié.

- [ ] **Step 2: Supprimer le package**

```bash
git rm -r --quiet packages/ui
ls packages
```

Attendu : `comptable donnees-reglementaires embed finance fiscal format-number modele pilote-ir social` — neuf entrées, sans `ui`.

- [ ] **Step 3: Régénérer le lockfile**

```bash
pnpm install
```

Attendu : succès.

- [ ] **Step 4: Vérifier la régression**

```bash
pnpm install --frozen-lockfile && pnpm run build && pnpm run typecheck && pnpm run ci:lint
```

Attendu : tout passe.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Remove packages/ui

Its only consumer was apps/simulateurs. The design system stays
available on the lts branch."
```

---

### Task 4: Élaguer le catalog pnpm et mettre à jour la documentation du dépôt

**Files:**
- Modify: `pnpm-workspace.yaml` (bloc `catalog:`), `README.md:13-15`, `CONTRIBUTING.md:11-14` et `CONTRIBUTING.md:23-30`, `.vscode/settings.json`, `pnpm-lock.yaml` (régénéré)

**Interfaces:**
- Consumes: le dépôt de la Task 3, sans `apps/` ni `packages/ui`.
- Produces: l'état final de la branche de suppression, prêt pour la PR décrite dans le runbook de la spec.

- [ ] **Step 1: Élaguer le catalog**

Dans le bloc `catalog:` de `pnpm-workspace.yaml`, supprimer ces **46 entrées**. Elles n'ont plus aucune référence `catalog:` dans un `package.json` conservé (jeu calculé le 2026-08-20 sur les 13 manifestes restants) :

```
@base-ui-components/react       @tanstack/react-router-devtools   plausible-tracker
@cloudflare/workers-types       @tanstack/router-plugin           playwright
@docusaurus/core                @testing-library/dom              prism-react-renderer
@docusaurus/module-type-aliases @testing-library/react            react-dom
@docusaurus/preset-classic      @types/react-dom                  recharts
@docusaurus/tsconfig            @vitejs/plugin-react              tailwind-merge
@docusaurus/types               class-variance-authority          tailwindcss
@fontsource-variable/rethink-sans  clsx                           tw-animate-css
@fontsource-variable/saira      docusaurus-plugin-typedoc         typedoc
@mdx-js/react                   jsdom                             typedoc-plugin-markdown
@radix-ui/react-checkbox        lucide-react                      vite
@radix-ui/react-dialog                                            vite-plugin-checker
@radix-ui/react-dropdown-menu                                     web-vitals
@radix-ui/react-label
@radix-ui/react-select
@radix-ui/react-slider
@radix-ui/react-slot
@radix-ui/react-switch
@radix-ui/react-tooltip
@tailwindcss/vite
@tanstack/react-form
@tanstack/react-router
```

Les **40 entrées suivantes restent** — ne pas y toucher :

```
@akimeo/modele-as   @orpc/openapi-client        eslint-plugin-react-hooks  react
@akimeo/modele-social  @types/lodash.defaultsdeep  eslint-plugin-turbo     tsc-alias
@akimeo/modele-ti   @types/lodash.merge         eslint-plugin-unused-imports  tsx
@eslint/js          @types/lodash.set           globals                    type-fest
@ianvs/prettier-plugin-sort-imports  @types/node  lodash.defaultsdeep      typescript
@orpc/client        @types/react                lodash.merge               typescript-eslint
@orpc/contract      concurrently                lodash.set                 vite-tsconfig-paths
                    date-fns                    prettier                   vitest
                    es-toolkit                  prettier-plugin-tailwindcss  yaml
                    eslint                      publicodes                 zod
                    eslint-config-prettier
                    eslint-formatter-compact
                    eslint-plugin-react
```

Laisser `catalogMode: strict` et le bloc `packages:` inchangés.

Note pour comprendre le filet de sécurité : `catalogMode: strict` fait échouer `pnpm install` si un `package.json` référence `catalog:` pour une clé absente du catalog. Un élagage trop agressif produit donc une erreur franche à l'étape 3, jamais un bug silencieux.

- [ ] **Step 2: Vérifier le compte**

```bash
python3 -c "
import re
txt = open('pnpm-workspace.yaml').read()
cat = re.search(r'\ncatalog:\n(.*?)\n\ncatalogMode', txt, re.S).group(1)
print(len([l for l in cat.splitlines() if l.strip()]))
"
```

Attendu : `40`. Si le compte diffère, comparer aux deux listes de l'étape 1 avant de continuer.

- [ ] **Step 3: Confirmer que l'élagage est cohérent**

```bash
rm -rf node_modules packages/*/node_modules config/*/node_modules
pnpm install
```

Attendu : succès. Une erreur du type `catalog entry not found` signifie qu'une entrée encore référencée a été supprimée — la restaurer depuis `git diff pnpm-workspace.yaml`.

La suppression de `node_modules` force pnpm à re-résoudre depuis zéro plutôt qu'à réutiliser un état déjà installé, ce qui rendrait la vérification complaisante.

- [ ] **Step 4: Mettre à jour le README**

Dans `README.md`, supprimer la ligne 15 et la ligne vide qui la précède. Passer de :

```markdown
Ce dépôt regroupe plusieurs packages publiés sous le nom `@akimeo/*`, organisés par domaine (modele, fiscal, social, données réglementaires, etc.), dans le répertoire `packages/`.

Les solutions finales sont elles dans le répertoire `apps/`.

## Contribuer
```

à :

```markdown
Ce dépôt regroupe plusieurs packages publiés sous le nom `@akimeo/*`, organisés par domaine (modele, fiscal, social, données réglementaires, etc.), dans le répertoire `packages/`.

## Contribuer
```

Laisser le lien `akimeo.xyz/docs/librairies` de la ligne 9 : le site reste en ligne, servi depuis `lts`.

- [ ] **Step 5: Mettre à jour le CONTRIBUTING — section Présentation**

Dans `CONTRIBUTING.md`, remplacer les lignes 11 à 14 :

```markdown
Le code dans ./packages constitue les librairies utilisées dans les ./apps. Il y a pour l'instant deux applications principales :

1. Le site, qui est une application [Docusaurus](https://docusaurus.io/).
2. Les simulateurs à imbriquer en iframe, qui est une application [Vite](https://vite.dev/) avec [TanStack Router](https://tanstack.com/router/latest).
```

par :

```markdown
Le code dans ./packages constitue les librairies publiées sous le nom `@akimeo/*`.

Les applications qui les consomment — le site de documentation et les simulateurs — vivent désormais sur la branche `lts`, d'où elles sont déployées.
```

- [ ] **Step 6: Mettre à jour le CONTRIBUTING — section Installation**

Toujours dans `CONTRIBUTING.md`, remplacer la ligne 23 et tout ce qui suit :

```markdown
6. Lance le développement avec `pnpm dev`

Ce qui va démarrer deux applications :

- [docs](./apps/docs) sur http://localhost:3000
- [simulateurs](./apps/simulateurs/) sur http://localhost:3001

Simulateurs est une application React purement statique avec les simulateurs qui sont imbriqués dans la documentation. Donc le point d'entrée principale, c'est http://localhost:3000
```

par :

```markdown
6. Lance les tests avec `pnpm test`
```

Le fichier se termine désormais sur cette ligne. `pnpm dev` n'a plus rien à démarrer maintenant que les applications sont parties.

- [ ] **Step 7: Nettoyer `.vscode/settings.json`**

> **Ajout au-delà de la spec** — signaler dans le rapport de tâche. Ces réglages ne concernaient que `apps/simulateurs` (`routeTree.gen.ts` est généré par TanStack Router) et `packages/ui` (`cn` / `cva` sont ses helpers Tailwind). Si Gabin préfère garder le fichier intact, cette étape se retire seule sans toucher au reste.

Remplacer le contenu de `.vscode/settings.json` par :

```json
{
  "eslint.workingDirectories": [
    {
      "mode": "auto"
    }
  ]
}
```

- [ ] **Step 8: Vérification complète**

```bash
pnpm install --frozen-lockfile
pnpm run build
pnpm run typecheck
pnpm run ci:lint
pnpm run ci:test
```

Attendu : les cinq commandes passent.

Sur `ci:test` : si `PILOTE_IR_API_KEY` est absent de l'environnement, les tests de `packages/fiscal` échoueront. Vérifier avec `[ -n "$PILOTE_IR_API_KEY" ] && echo présent || echo absent` et **rapporter le résultat tel quel**. Une vérification partielle rapportée comme partielle est correcte ; une vérification partielle rapportée comme complète ne l'est pas.

- [ ] **Step 9: Vérification finale des références pendantes**

```bash
git grep -n -e 'apps/' -e '@akimeo/ui' -e 'simulateurs' -e 'SIMULATEURS_HOSTNAME' -e 'docusaurus' -- . ':!docs/superpowers' ':!pnpm-lock.yaml' ':!.gitignore'
```

Attendu : aucune sortie, **sauf** la mention légitime de `lts` et des simulateurs ajoutée au `CONTRIBUTING.md` à l'étape 5, et le mot « simulateurs » employé au sens métier dans le `README.md` (lignes 3 et 5 — il décrit ce que servent les librairies, pas l'application supprimée). Relire chaque occurrence restante plutôt que de supposer.

`.gitignore` est exclu : son `.docusaurus` vient du gabarit toptal généré, il n'a pas été ajouté à la main et n'a pas à être touché.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "Prune repo config after removing apps

Drops 46 now-unreferenced catalog entries, and updates README,
CONTRIBUTING and .vscode settings to describe a libraries-only
monorepo."
```

- [ ] **Step 11: Rapport final**

Afficher l'état des deux branches :

```bash
git log --oneline main..zhouzi/remove-apps-simulateurs-docs
git log --oneline main..lts
git status --short
git branch -vv
```

Attendu :
- quatre commits sur la branche de suppression (spec + trois suppressions)
- un commit sur `lts`
- arbre propre
- **aucune des deux branches n'a d'upstream** — c'est la contrainte principale du plan, la colonne de tracking de `git branch -vv` doit être vide pour `lts` et pour `zhouzi/remove-apps-simulateurs-docs`

Puis rappeler à Gabin que le runbook de la spec — section « Runbook », seule source de vérité pour l'ordre des étapes — reste entièrement à sa main.

---

## Ce que ce plan ne fait pas

Volontairement hors périmètre, conformément à la spec :

- **Aucune opération upstream.** Pas de push, pas de PR, pas de modification des dashboards Cloudflare ou GitHub.
- **`comptable`, `finance` et `social` ne sont pas supprimés** bien qu'ils soient déjà orphelins aujourd'hui — c'est un état préexistant, pas une conséquence de cette opération.
- **`embed` et `format-number` ne sont pas supprimés** bien qu'ils deviennent orphelins ici. Décision assumée : `embed` est la librairie d'intégration destinée aux sites tiers.
- **Le figement de la documentation d'API n'est pas résolu.** Après cette opération, `akimeo.xyz/docs/librairies` sera généré depuis la snapshot `lts` et ne suivra plus l'évolution des librairies sur `main`. La spec documente les trois issues possibles ; aucune n'est tranchée ici.
