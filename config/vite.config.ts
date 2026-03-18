import path from 'path';

import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { resolveNetwork } from 'vite-plugin-playable';

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
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    assetsInlineLimit: 100_000_000,
  },
  plugins: [
    assetpackPlugin(),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
    ...resolveNetwork('develop').plugins,
  ],
});
