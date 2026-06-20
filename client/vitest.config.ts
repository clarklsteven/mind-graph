import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      provider: 'v8',
      reportOnFailure: true,
      reporter: ["text", "html"],
      include: [
        "src/**/*.ts",
        "src/**/*.tsx"
      ],
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/**/*.d.ts",
        "src/**/dist/**",
        "src/**/coverage/**"
      ],
      thresholds: {
        statements: 33,
        branches: 23,
        functions: 45,
        lines: 34
      }
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
