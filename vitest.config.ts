import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components/ui/button': path.resolve(__dirname, './test/mocks/components/ui/button.tsx'),
      'sonner': path.resolve(__dirname, './test/mocks/sonner.ts'),
    },
  },
});
