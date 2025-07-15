import { Assets } from "pixi.js";

import { Bundles } from "./generated";
import manifest from './generated/manifest.json';

export default class AssetsLoader {
  private static loaded = false;

  static async load() {
    if (AssetsLoader.loaded) return;

    await Assets.init({ manifest, basePath: 'assets/' });
    await Assets.loadBundle(Bundles.GAME);

    AssetsLoader.loaded = true;
  }
}
