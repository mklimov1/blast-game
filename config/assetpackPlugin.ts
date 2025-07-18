import fs from 'fs/promises';
import path from 'path';

import { AssetPack, type AssetPackConfig  } from '@assetpack/core';
import { pixiPipes } from '@assetpack/core/pixi';
import { type Plugin, type ResolvedConfig } from 'vite';

import { generateAssetTypesPipe } from './generateAssetTypesPipe';

const GENERATED_DIR = path.resolve('./src/generated');

export const assetpackPlugin = (): Plugin => {
  const apConfig: AssetPackConfig = {
    entry: './raw-assets',
    output: './public/assets',
    logLevel: 'warn',
    pipes: [
      ...pixiPipes({
        cacheBust: false,
        resolutions: { default: 1 },
        manifest: {
          output: 'src/generated/manifest.json',
          trimExtensions: true,
          nameStyle: 'relative',
          createShortcuts: true,
        },
        compression: {
          png: true,
          webp: true,
          avif: true,
          jpg: true,
          bc7: false,
          astc: false,
          basis: false,
          etc: false,
        },
      }),
    ],
  };

  apConfig.pipes?.push(generateAssetTypesPipe());

  let mode: ResolvedConfig['command'];

  let ap: AssetPack | undefined;

  return {
    name: 'vite-plugin-assetpack',
    configResolved(resolvedConfig) {
      mode = resolvedConfig.command;
      if (!resolvedConfig.publicDir) return;
      if (apConfig.output) return;
      const publicDir = resolvedConfig.publicDir.replace(process.cwd(), '');

      apConfig.output = `.${publicDir}/assets/`;
    },
    buildStart: async () => {
      await fs.mkdir(GENERATED_DIR, { recursive: true });

      if (mode === 'serve') {
        if (ap) return;
        ap = new AssetPack(apConfig);
        void ap.watch();
      } else {
        await new AssetPack(apConfig).run();
      }
    },
    buildEnd: async () => {
      if (ap) {
        await ap.stop();
        ap = undefined;
      }
    },
  };
};
