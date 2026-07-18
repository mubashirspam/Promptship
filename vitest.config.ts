import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    env: {
      NEXT_PUBLIC_ROOT_DOMAIN: 'lvh.me:3000',
    },
  },
});
