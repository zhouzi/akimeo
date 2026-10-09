# Akimeo

Les briques de calcul d'**Akimeo** : des calculs fiscaux, sociaux et financiers
de base (impôt sur le revenu, cotisations sociales, placements…), et les données
réglementaires qui les alimentent.

Ce code est ouvert par souci de transparence — un chiffre doit pouvoir s'auditer
jusqu'à la règle qui l'établit — et pour être partagé. Il est fourni tel quel :
pas de support, pas de stabilité d'API garantie.

## Contenu

Un monorepo [Turbo](https://turborepo.com/) géré avec [pnpm](https://pnpm.io/).
Les paquets `@akimeo/*`, organisés par domaine, vivent dans `packages/` et se
consomment directement depuis leurs sources : il n'y a rien à construire.

```sh
nvm use
pnpm i
pnpm run test
```

Les tests d'impôt sur le revenu de `packages/fiscal` demandent
`PILOTE_IR_API_KEY` ; sans elle, ils échouent en local.

---

Si tu utilises ces briques dans un projet, fais-moi signe sur
[LinkedIn](https://go.gabin.app/linkedin).
