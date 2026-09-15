import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./src/vitest.setup.ts"],
    exclude: [...configDefaults.exclude, "**/*.integration.test.{ts,tsx}"],
  },
});
