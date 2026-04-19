import { config } from "@akimeo/eslint-config/base";

export default [
  ...config,
  {
    ignores: ["eslint.config.mjs", "dist/**"],
  },
];
