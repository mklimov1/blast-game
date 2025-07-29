import { Sprite, Texture } from "pixi.js";

import type { BlockColor } from "@/entities/model/blockColors";

export class BlockView extends Sprite {
  color: BlockColor;

  constructor(color: BlockColor) {
    super(Texture.from(`game/tile/${color}`));
    this.interactive = true;
    this.cursor = 'pointer';
    this.color = color;
  }

  destoryBlock() {
    this.parent.removeChild(this);
    this.destroy();
  }
}
