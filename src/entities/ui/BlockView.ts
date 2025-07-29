import { Sprite, Texture } from "pixi.js";

import type { BlockColor } from "@/entities/model/blockColors";

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

  destoryBlock() {
    this.parent.removeChild(this);
    this.destroy();
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
