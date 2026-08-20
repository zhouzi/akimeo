# Guide de contribution

Merci pour ton intérêt 🙏 Toute contribution est la bienvenue, que ce soit pour signaler un bug, proposer une amélioration, poser une question ou simplement partager une idée.

Hésite pas à ouvrir la discussion en [créant une issue](https://github.com/zhouzi/akimeo/issues/new).

## Présentation

Ce dépôt est un monorepo [Turbo](https://turborepo.com/) qui utilise [pnpm](https://pnpm.io/) comme package manager.

Le code dans ./packages constitue les librairies publiées sous le nom `@akimeo/*`.

Les applications qui les consomment — le site de documentation et les simulateurs — vivent désormais sur la branche `lts`, d'où elles sont déployées.

## Installation

1. [Installe pnpm](https://pnpm.io/installation)
2. [Installe nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
3. Clone le dépôt
4. Utilise la bonne version de Node avec `nvm use`
5. Installe les dépendances avec `pnpm i`
6. Lance le build puis les tests avec `pnpm run build && pnpm run ci:test`
   (`PILOTE_IR_API_KEY` est requise pour les tests impôt sur le revenu de
   `packages/fiscal` ; elle est fournie en CI comme secret du dépôt, donc ces
   tests échoueront en local sans elle — c'est attendu)
7. Lance le développement avec `pnpm dev`
