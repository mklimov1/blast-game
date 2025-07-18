import fs from 'fs';

import { AssetPipe } from '@assetpack/core';

import { generateAssetTypes } from './generateAssetTypes';

export function generateAssetTypesPipe(): AssetPipe {
  return {
    name: 'generate-asset-types',

    defaultOptions: {},

    async finish(asset, options, pipeSystem): Promise<void> {
      try {
        const manifestPath = pipeSystem.getPipe('pixi-manifest').defaultOptions.output;

        const stat = fs.statSync(manifestPath);

        if (stat.isFile()) {
          // eslint-disable-next-line no-console
          console.log('generate types...');
          await generateAssetTypes({});
        }
      } catch {
        throw new Error('manifest.json not found');
      }
    },
  };
};
