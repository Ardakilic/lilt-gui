import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData.ts",
        "dist/",
        "src/main.tsx", // Entry point, can't test in JSDOM
        "src/i18n.ts", // i18n initialization, tested implicitly
        "src/**/index.ts", // Export-only files
        "src/services/tauri.ts", // Tauri API wrapper, mocked in tests
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  server: {
    host: "0.0.0.0", // Listen on all network interfaces (required for Docker)
    port: 51204,
  },
});
