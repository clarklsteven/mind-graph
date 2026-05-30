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
      thresholds: {
        statements: 92,
        branches: 80,
        functions: 94,
        lines: 92
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
