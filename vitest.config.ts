// vitest.config.ts
// import { defineConfig } from "vitest/config";
// import react from "@vitejs/plugin-react";
// import tsconfigPaths from "vite-tsconfig-paths";

// export default defineConfig({
//   plugins: [tsconfigPaths(), react()],
//   test: {
//     environment: "jsdom",
//     setupFiles: "./vitest.setup.ts",
//     globals: true,
//     include: [
//       // Update these paths to match your actual structure
//       "./__tests__/integration/**/*.test.{ts,tsx}",
//       "./__tests__/unit/**/*.test.{ts,tsx}",
//       // Or use a broader pattern:
//       "./__tests__/**/*.test.{ts,tsx}",
//       "./**/*.test.{ts,tsx}"  // This will find all test files
//     ],
//     reporters: "verbose",
//     clearMocks: true,
//     watch: false,
//   },
// });

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    globals: true,
    include: [
      "./__tests__/**/*.test.{ts,tsx}",
    ],
    // Add alias resolution
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@/components': path.resolve(__dirname, 'components'),
      '@/actions': path.resolve(__dirname, 'actions'),
      '@/lib': path.resolve(__dirname, 'lib'),
    },
    reporters: "verbose",
    clearMocks: true,
    watch: false,
  },
  // Add resolve configuration
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});

