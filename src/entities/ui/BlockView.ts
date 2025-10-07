import { Easing, Tween } from '@tweenjs/tween.js';
import { Sprite, Texture } from 'pixi.js';

import { type BlockColor, blockTweenGroup } from '@/entities';
import { type Block } from '@/features';
import type { Position } from '@/widgets';

export class BlockView extends Sprite {
  static SIZE = 200;

  private block: Block;

  row = -1;

  col = -1;

  color: BlockColor;

  constructor(block: Block) {
    const texture = Texture.from(`game/tile/${block.color}`);
    super(texture);
    this.block = block;
    this.color = block.color;
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
        .group(blockTweenGroup)
        .start();
    });
  }

  getBlock() {
    return this.block;
  }

  setGridPosition(row: number, col: number) {
    this.row = row;
    this.col = col;
    this.position.set(col * BlockView.SIZE, row * BlockView.SIZE);
  }

  show() {
    new Tween({ alpha: 0 })
      .to({ alpha: 1 })
      .easing(Easing.Quartic.InOut)
      .duration(50)
      .onUpdate(({ alpha }) => {
        this.alpha = alpha;
      })
      .group(blockTweenGroup)
      .start();
  }

  moveOnGrid(to: Position): Promise<void> {
    const duration = (to.row - this.row) * 50;
    const fromY = this.y;
    const targetY = to.row * BlockView.SIZE;

    this.position.x = to.col * BlockView.SIZE;
    this.row = to.row;
    this.col = to.col;

    return new Promise((resolve) => {
      new Tween({ y: fromY })
        .to({ y: targetY })
        .easing(Easing.Quartic.InOut)
        .duration(duration)
        .onUpdate(({ y }) => {
          this.y = y;
        })
        .onComplete(() => resolve())
        .group(blockTweenGroup)
        .start();
    });
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
