import { Tween } from "@tweenjs/tween.js";
import { Sprite, Texture } from "pixi.js";

import type { BlockColor } from "@/entities/model/blockColors";
import { blockGroup } from "@/shared/lib/tween";

export class BlockView extends Sprite {
  static SIZE = 200;

  row = 0;

  col = 0;

  color: BlockColor;

  constructor(color: BlockColor) {
    const texture = Texture.from(`game/tile/${color}`);
    super(texture);
    this.cursor = 'pointer';
    this.eventMode = 'static';
    this.color = color;
    this.subcsribeEvents();
  }

  destroyBlock(delay = 0): Promise<void> {
    return new Promise((resolve) => {
      new Tween({ alpha: 1 })
        .to({ alpha: 0 })
        .duration(200)
        .delay(delay)
        .onUpdate(({ alpha }) => {
          this.alpha = alpha;
        })
        .onComplete(() => {
          this.parent.removeChild(this);
          this.destroy();
          resolve();
        })
        .group(blockGroup)
        .start();
    });
  }

  setGridPosition(row: number, col: number) {
    this.position.set(col * BlockView.SIZE, row * BlockView.SIZE);
    this.row = row;
    this.col = col;
  }

  private subcsribeEvents() {
    this.on('pointerenter', () => {
      this.tint = 0xCCCCCC;
    });
    this.on('pointerleave', () => {
      this.tint = 0xFFFFFF;
    });
  }
}
