import { Easing, Tween } from '@tweenjs/tween.js';
import { Sprite, Texture } from 'pixi.js';

import { blockTweenGroup } from '../lib';
import { BlockColor, type Position } from '../types';

export class RenderChip extends Sprite {
  static SIZE = 200;

  readonly id: string;

  color: BlockColor;

  constructor(id: string, color: BlockColor) {
    const texture = Texture.from(`game/tile/${color.toLowerCase()}`);
    super(texture);
    this.id = id;
    this.color = color;
    this.subcsribeEvents();
  }

  hide(delay = 0): Promise<void> {
    return new Promise((resolve) => {
      new Tween({ alpha: 1 })
        .to({ alpha: 0 })
        .duration(200)
        .delay(delay)
        .onUpdate(({ alpha }) => {
          this.alpha = alpha;
        })
        .onComplete(() => {
          resolve();
        })
        .group(blockTweenGroup)
        .start();
    });
  }

  setGridPosition(row: number, col: number) {
    this.position.set(col * RenderChip.SIZE, row * RenderChip.SIZE);
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

  moveY(to: Position, duration: number): Promise<void> {
    const fromY = this.y;
    const targetY = to.row * RenderChip.SIZE;

    this.position.x = to.col * RenderChip.SIZE;

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
