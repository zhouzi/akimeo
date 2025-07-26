import { config } from "@akimeo/eslint-config/react";

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    ignores: ["dist/**", "public/**"],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            "reportWebVitals.ts",
            "vite.config.ts",
            "vite.iframe.config.ts",
            "eslint.config.mjs",
          ],
          defaultProject: "./tsconfig.json",
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
