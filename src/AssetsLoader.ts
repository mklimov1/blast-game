import { Assets } from "pixi.js";

import { Bundles } from "./generated";
import manifest from './generated/manifest.json';

export default class AssetsLoader {
  private static bundles: Record<string, boolean>;

  private static inited = false;

  static async init() {
    if (this.inited) return;
    await Assets.init({ manifest, basePath: 'assets/' });
    this.bundles = Object.keys(Bundles).reduce((prev, bundleName) => ({
      ...prev,
      [bundleName]: false,
    }), {});
    this.inited = true;
  }

  static async load(bundle: keyof typeof Bundles) {
    if (!this.inited) return;
    const bundleName = Bundles[bundle];

    await Assets.loadBundle(bundleName);
    this.bundles[bundle] = true;
  }
}
