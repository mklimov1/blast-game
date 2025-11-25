import path from 'path';

import { defineConfig } from 'vite';

import { assetpackPlugin } from './assetpackPlugin';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  server: {
    open: false,
    port: 3000,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
  },
  plugins: [assetpackPlugin()],
});
