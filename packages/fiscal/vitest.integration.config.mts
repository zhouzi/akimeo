import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./src/vitest.setup.ts"],
    include: ["**/*.integration.test.{ts,tsx}"],
  },
});
