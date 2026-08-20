# Suppression des apps de `main`, conservation en prod sur `lts`

**Date** : 2026-08-20
**Statut** : design validé, implémentation à faire

## Problème

`main` héberge deux applications déployées en production :

- `apps/docs` — Docusaurus → GitHub Pages, via `.github/workflows/deploy-docs.yml`
  (déclenché sur `push: main`)
- `apps/simulateurs` — Vite/React + une Cloudflare Function
  (`functions/api/event.ts`) → Cloudflare Pages, dont la branche de production
  est réglée dans le dashboard Cloudflare et non dans le dépôt

On veut retirer ces applications de `main` pour le ramener à un monorepo de
librairies, sans interrompre la production et sans perdre la possibilité de
continuer à faire évoluer les applications.

## Décisions

| Question | Décision |
|---|---|
| Nature de la branche de sauvegarde | Branche de maintenance vivante : on continuera à y committer et à la déployer |
| Nom | `lts` |
| Rapport à `main` | Indépendance totale. `lts` ne re-mergera jamais `main` et embarque sa propre copie figée des packages |
| Livrable de cette itération | Tout en local. Aucun push, aucune PR, aucune modification de configuration de production |

## Périmètre

### Supprimé de `main`

| Chemin | Note |
|---|---|
| `apps/docs/` | le répertoire `apps/` disparaît entièrement |
| `apps/simulateurs/` | y compris `functions/api/event.ts` |
| `packages/ui/` | consommé uniquement par `simulateurs` |
| `.github/workflows/deploy-docs.yml` | migre sur `lts` |

### Conservé sur `main`

`donnees-reglementaires`, `fiscal`, `modele`, `pilote-ir`, `comptable`,
`finance`, `social`, `embed`, `format-number`, `config/*`.

`embed` et `format-number` deviennent orphelins **par cette opération** — `embed`
avait un consommateur interne, `apps/simulateurs`, qui disparaît ici — mais sont
conservés délibérément : `embed` est la librairie d'intégration destinée aux
sites tiers (WordPress, Wix, Framer, Circle) et a une raison d'être sans
application dans le dépôt. `comptable`, `finance` et `social` sont déjà
orphelins aujourd'hui, indépendamment de cette opération, et sortent du
périmètre.

Aucun package n'est publié sur npm (vérifié le 2026-08-20) : il n'y a pas de
consommateur externe à gérer.

## Disposition git

```
main (d45a7e2, état de la production)
 │
 ├─→ lts                       ← part de d45a7e2
 │     ├─ 8d68bf8 « Deploy docs from lts »
 │     │  deploy-docs.yml : on.push.branches  main → lts
 │     └─ f249e84 « Allow manually triggering the docs deploy »
 │        deploy-docs.yml : ajout de workflow_dispatch
 │     Monorepo complet, par ailleurs inchangé.
 │
 └─→ zhouzi/remove-apps-simulateurs-docs   ← part de d45a7e2
       └─ commits de suppression
       Monorepo de librairies uniquement.
```

Aucune des deux branches n'est poussée à l'issue de cette itération.

### Alternative écartée

Un dépôt séparé (`akimeo-apps`) correspondrait plus fidèlement à l'intention —
deux projets qui divergent définitivement, sans merge. Écarté pour l'instant
car plus coûteux en travail upstream. Une branche se convertit en dépôt à tout
moment (`git push nouveau-depot lts:main`), la décision reste ouverte.

## Modifications de fichiers sur la branche de suppression

- **`pnpm-workspace.yaml`** — retrait de l'entrée `apps/*`, puis élagage du
  `catalog:`. Une quarantaine d'entrées deviennent mortes (docusaurus, radix,
  tanstack, tailwind, playwright, typedoc…). L'ensemble à élaguer est calculé
  par script — toute entrée du catalog sans référence `catalog:` restante dans
  un `package.json` conservé — et non à l'œil. `catalogMode: strict` fait
  échouer `pnpm install` si l'élagage va trop loin : l'erreur est franche.
- **`turbo.json`** — retrait du bloc de tâche `docs#build`, qui référence la
  cible `docs` et la variable `SIMULATEURS_HOSTNAME`.
- **`README.md`** (l. 15) et **`CONTRIBUTING.md`** (l. 14, 27-30) — retrait des
  descriptions des applications.
- **`pnpm-lock.yaml`** — régénéré par `pnpm install`.
- **`.github/workflows/ci.yml`** — aucun changement nécessaire (vérifié : seule
  la variable `PILOTE_IR_API_KEY` y figure).

### Découpage des commits

Trois commits sur la branche de suppression, pour que la revue reste lisible :

1. suppression de `apps/` et du workflow `deploy-docs`
2. suppression de `packages/ui`
3. nettoyage de la configuration du dépôt (`pnpm-workspace.yaml`, `turbo.json`,
   documentation, lockfile)

## Conséquence acceptée : le figement de la documentation d'API

`apps/docs` génère la documentation d'API des librairies via
`docusaurus-plugin-typedoc`, en lisant les sources de `packages/*`. Après
l'opération, `akimeo.xyz/docs/librairies` — référencé dans le `README.md` de
`main` — sera généré depuis la snapshot `lts`, donc **figé à l'état du
2026-08-20**, tandis que `fiscal`, `modele` et `pilote-ir` continueront
d'évoluer sur `main`.

C'est une perte réelle, assumée pour cette itération. Trois issues restent
ouvertes pour plus tard : accepter le figement, cherry-picker ponctuellement les
packages sur `lts` malgré le principe d'indépendance, ou reconstruire une
documentation d'API depuis `main`. Cette spec ne tranche pas.

## Conséquence acceptée : le découplage du protocole `embed`

`packages/embed` n'est pas qu'une librairie tierce autonome : c'est la moitié
d'un protocole d'échange dont l'autre moitié vivait dans
`apps/simulateurs/src/lib/iframe.ts`, source de l'`/iframe.js` déployé. Ce
fichier importait `@akimeo/embed/browser/types`,
`@akimeo/embed/browser/iframe-attributes` et
`@akimeo/embed/browser/resize-height-event`. Par ailleurs,
`packages/embed/src/react/akimeo-embed.tsx:13` et `akimeo-iframe.tsx:17` codent
en dur `https://simulateurs.akimeo.xyz` comme origine par défaut, d'où `embed`
charge `/iframe.js`.

Puisque `main` et `lts` ne se remergeront jamais (cf. Décisions), toute
évolution sur `main` de `RESIZE_HEIGHT_EVENT_DATA_TYPE`, `ResizeHeightEventData`,
`CreateAkimeoEmbed` ou `IFRAME_ATTRIBUTES` désynchronisera silencieusement
`embed` de l'`iframe.js` figé servi depuis `lts` — sans erreur de build, sans
test qui casse : les deux moitiés du protocole divergent sans le signaler.

Conséquence concrète : le rebranchement Cloudflare du runbook (pointer
`simulateurs.akimeo.xyz` sur `lts`) n'est pas cosmétique, il est obligatoire. Si
ce domaine cesse de servir `apps/simulateurs`, `embed` sur `main` devient un
client de rien — l'origine par défaut codée en dur pointe dans le vide.

C'est une perte réelle, assumée pour cette itération, symétrique à celle de la
documentation d'API ci-dessus. Cette spec ne tranche pas la résolution
(figer le protocole, le documenter comme contrat stable, ou le faire migrer
vers `main` un jour) : elle se limite à la documenter comme risque accepté.

## Rebranchement des déploiements

`simulateurs` (Cloudflare Pages) : la branche de production est réglée dans le
dashboard, pas dans le dépôt. Rien à committer — étape manuelle du runbook.

`docs` (GitHub Pages) : le commit sur `lts` change le déclencheur du workflow,
mais cela ne suffit pas. L'environnement `github-pages` restreint les branches
autorisées à déployer ; il faut y ajouter `lts` dans les réglages du dépôt.
Étape manuelle du runbook.

## Runbook (à exécuter par Gabin, hors de cette itération)

L'ordre est critique : il évite toute coupure de production.

1. GitHub → Settings → Environments → `github-pages` → autoriser `lts` à
   déployer (GitHub accepte une règle sur un nom de branche qui n'existe pas
   encore côté remote, donc cette étape peut précéder le push)
2. `git push origin lts`
3. Protéger `lts` contre la suppression
4. Cloudflare Pages → projet simulateurs → branche de production `main` →
   `lts` ; désactiver les « preview deployments » (une fois `lts` branche de
   production, elle n'est plus jamais une branche de preview : restreindre la
   liste des branches qui déclenchent un build à `lts` reviendrait au même) →
   redéployer → **vérifier l'URL de production**. Sans cette désactivation,
   après le merge, chaque push sur `main` déclenchera un build de preview pour
   `apps/simulateurs`, qui n'y existera plus, et ce build échouera en continu.
5. Le `git push origin lts` de l'étape 2 a déjà déclenché automatiquement le
   workflow `Deploy docs` (le trigger `on: push: branches: [lts]` est resté
   intact), et l'environnement autorisé à l'étape 1 permet à ce run
   d'aboutir. Vérifier ce run dans l'onglet Actions ; s'il a échoué ou doit
   être rejoué, utiliser « Re-run all jobs » depuis cet onglet, qui fonctionne
   quelle que soit la branche par défaut du dépôt → **vérifier
   akimeo.xyz/docs**

   Le `workflow_dispatch` ajouté sur `lts` reste inerte tant que `main` — la
   branche par défaut — n'en possède pas de copie ; il ne redevient utile que
   si `lts` devient un jour la branche par défaut, ou que la branche est
   extraite en dépôt séparé (cf. alternative écartée ci-dessus).
6. **Seulement une fois les deux productions vérifiées** : pousser la branche de
   suppression, ouvrir la PR, merger dans `main`
7. Après le merge : confirmer qu'aucun déploiement ne se déclenche depuis `main`

Inverser l'étape 6 et les étapes 4-5 ferait perdre les applications à `main`
alors que la production pointe encore dessus : le build suivant casserait.

## Vérification

Sur la branche de suppression :

- `pnpm install --frozen-lockfile`
- `pnpm run build`, `pnpm run typecheck`, `pnpm run ci:lint`, `pnpm run ci:test`
- `git grep` sur `apps/`, `@akimeo/ui`, `simulateurs` : aucune référence
  pendante

Les tests de `packages/fiscal` (le module impôt sur le revenu, consommateur de
`PILOTE_IR_API_KEY`) échoueront en local faute de cette variable. Si c'est le
cas, le signaler explicitement plutôt que de déclarer la vérification
complète.

Sur `lts` :

- `pnpm install --frozen-lockfile && pnpm run build` — la snapshot construit
- relecture du YAML de `deploy-docs.yml`

## Rollback

Avant push : tout est révocable localement, rien n'existe upstream.
Après merge : `git revert` du commit de merge, ou repointage des deux
déploiements sur `main`. Dans tous les cas, `lts` reste la source de vérité du
code en production.
