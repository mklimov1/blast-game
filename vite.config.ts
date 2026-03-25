import { playableConfig } from 'vite-plugin-playable';
import { assetpackPlugin, playablePipesConfig } from 'vite-plugin-playable/assetpack';

// export default defineConfig({
//   resolve: {
//     alias: {
//       '@': path.resolve(process.cwd(), '../src'),
//     },
//   },
//   server: {
//     open: false,
//     port: 3000,
//   },
//   build: {
//     target: 'esnext',
//     outDir: 'dist',
//     assetsDir: 'assets',
//     rollupOptions: {
//       output: {
//         inlineDynamicImports: true,
//       },
//     },
//     assetsInlineLimit: 100_000_000,
//   },
//   plugins: [
//     assetpackPlugin({ pixiPipes: playablePipesConfig }),
//     visualizer({
//       open: false,
//       gzipSize: true,
//       brotliSize: true,
//       filename: 'dist/stats.html',
//     }),
//     ...resolveNetwork('develop').plugins,
//   ],
// });

export default playableConfig({
  network: 'develop-inline',
  plugins: [assetpackPlugin({ pixiPipes: playablePipesConfig })],
});

// export default defaultConfig({
//   plugins: [
//     assetpackPlugin(),
//     visualizer({
//       open: false,
//       gzipSize: true,
//       brotliSize: true,
//       filename: 'dist/stats.html',
//     }),
//   ],
// });
