import { Sprite, Texture } from "pixi.js";

import type { BlockColor } from "@/entities/model/blockColors";

export class BlockView extends Sprite {
  constructor(color: BlockColor) {
    super(Texture.from(`game/tile/${color}`));
    this.eventMode = 'auto';
    this.cursor = 'pointer';
  }
}
