import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@cac/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
      '@cac/logger': path.resolve(__dirname, '../../packages/logger/src/logger.ts'),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    watch: false,
    passWithNoTests: false,
  },
});
