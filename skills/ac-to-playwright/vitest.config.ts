import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      provider: "istanbul",
      reporter: ["text", "html", "lcov", "cobertura"],
    },
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.spec.ts"
    ]
  }
});
