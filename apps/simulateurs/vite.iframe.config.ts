import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src", "lib", "iframe.ts"),
      name: "akimeo",
      fileName(format, entryName) {
        switch (format) {
          case "iife":
            return `${entryName}.js`;
          default:
            return `${entryName}.${format}.js`;
        }
      },
      formats: ["iife"],
    },
    outDir: path.resolve(__dirname, "public"),
    emptyOutDir: false,
  },
});
