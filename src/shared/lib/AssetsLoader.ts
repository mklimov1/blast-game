import { Assets } from 'pixi.js';

import { Bundles } from '../../generated';
import manifest from '../../generated/manifest.json';

export class AssetsLoader {
  private static loadedBundles = new Set<string>();

  private static inited = false;

  static async init(): Promise<void> {
    if (this.inited) return;

    await Assets.init({ manifest, basePath: 'assets/' });
    this.inited = true;
  }

  static async load(bundle: keyof typeof Bundles): Promise<void> {
    if (!this.inited) {
      throw new Error('AssetsLoader.init() must be called before load().');
    }

    const bundleName = Bundles[bundle];

    if (!this.loadedBundles.has(bundleName)) {
      await Assets.loadBundle(bundleName);
      this.loadedBundles.add(bundleName);
    }
  }

  static isLoaded(bundle: keyof typeof Bundles): boolean {
    const bundleName = Bundles[bundle];

    return this.loadedBundles.has(bundleName);
  }
}
