import { Sound, sound } from '@pixi/sound';
import { Assets } from 'pixi.js';

import { Bundles } from '@/shared/generated';
import manifest from '@/shared/generated/manifest.json';

export class AssetsLoader {
  private static loadedBundles = new Set<string>();

  private static inited = false;

  static async init(): Promise<void> {
    if (AssetsLoader.inited) return;

    await Assets.init({ manifest, basePath: 'assets/' });
    AssetsLoader.inited = true;
  }

  private static registerSounds(loaded: Record<string, unknown>): void {
    Object.entries(loaded)
      .filter(([key, asset]) => asset instanceof Sound && !sound.exists(key))
      .forEach(([key, asset]) => sound.add(key, asset as Sound));
  }

  static async load(bundle: keyof typeof Bundles): Promise<void> {
    if (!AssetsLoader.inited) {
      throw new Error('AssetsLoader.init() must be called before load().');
    }

    const bundleName = Bundles[bundle];

    if (!AssetsLoader.loadedBundles.has(bundleName)) {
      const loaded = await Assets.loadBundle(bundleName);
      AssetsLoader.loadedBundles.add(bundleName);
      AssetsLoader.registerSounds(loaded);
    }
  }

  static isLoaded(bundle: keyof typeof Bundles): boolean {
    const bundleName = Bundles[bundle];

    return AssetsLoader.loadedBundles.has(bundleName);
  }
}
