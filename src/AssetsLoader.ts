import { Assets } from "pixi.js";
import fieldImg from '/field.png';

const textures = {
  field: {
    alias: "field",
    src: fieldImg,
  },
};

export default class AssetsLoader {
  private static loaded = false;

  static async load() {
    if (AssetsLoader.loaded) return;

    await Assets.addBundle("main", textures);
    await Assets.loadBundle("main");

    AssetsLoader.loaded = true;
  }
}
