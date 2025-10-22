import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 80,
        statements: 90,
      },
      all: false,
      exclude: [
        "node_modules/",
        "src/test/",
        "*.config.ts",
        "**/*.test.{ts,tsx}",
        "**/types/**",
        "**/*.d.ts",
        "**/index.ts",
        "src/app/api/**",
        "src/lib/auth.ts",
        "src/app/layout.tsx",
        "src/components/providers/**",
      ],
    },
    css: true,
    restoreMocks: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
