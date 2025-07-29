# Guide de contribution

Merci pour ton intérêt 🙏 Toute contribution est la bienvenue, que ce soit pour signaler un bug, proposer une amélioration, poser une question ou simplement partager une idée.

Hésite pas à ouvrir la discussion en [créant une issue](https://github.com/zhouzi/akimeo/issues/new).

## Présentation

Ce dépôt est un monorepo [Turbo](https://turborepo.com/) qui utilise [pnpm](https://pnpm.io/) comme package manager.

Le code dans ./packages constitue les librairies utilisées dans les ./apps. Il y a pour l'instant deux applications principales :

1. Le site, qui est une application [Docusaurus](https://docusaurus.io/).
2. Les simulateurs à imbriquer en iframe, qui est une application [Vite](https://vite.dev/) avec [TanStack Router](https://tanstack.com/router/latest).

## Installation

1. [Installe pnpm](https://pnpm.io/installation)
2. [Installe nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
3. Clone le dépôt
4. Utilise la bonne version de Node avec `nvm use`
5. Installe les dépendances avec `pnpm i`
6. Lance le développement avec `pnpm dev`

Ce qui va démarrer deux applications :

- [docs](./apps/docs) sur http://localhost:3000
- [simulateurs](./apps/simulateurs/) sur http://localhost:3001

Simulateurs est une application React purement statique avec les simulateurs qui sont imbriqués dans la documentation. Donc le point d'entrée principale, c'est http://localhost:3000
