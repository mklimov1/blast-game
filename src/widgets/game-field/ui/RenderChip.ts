import { Easing, Tween } from '@tweenjs/tween.js';
import { Sprite, Texture } from 'pixi.js';

import { globalTweenGroup } from '@/shared';

import { ChipKind, ChipPower, Color, type Position } from '../types';

export class RenderChip extends Sprite {
  static SIZE = 200;

  readonly id: string;

  readonly kind: ChipKind;

  readonly power: Color | ChipPower;

  constructor(id: string, kind: ChipKind, power: Color | ChipPower) {
    const texture = Texture.from(`game/tile/${power.toLowerCase()}`);
    super(texture);
    this.anchor.set(0.5);
    this.id = id;
    this.kind = kind;
    this.power = power;
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
        .group(globalTweenGroup)
        .start();
    });
  }

  setGridPosition(row: number, col: number) {
    this.position.set(col * RenderChip.SIZE, row * RenderChip.SIZE);
    this.setZindexByRow(row);
  }

  setZindexByRow(row: number) {
    this.zIndex = -row;
  }

  show() {
    new Tween({ alpha: 0 })
      .to({ alpha: 1 })
      .easing(Easing.Quartic.InOut)
      .duration(50)
      .onUpdate(({ alpha }) => {
        this.alpha = alpha;
      })
      .group(globalTweenGroup)
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
        .group(globalTweenGroup)
        .start();
    });
  }

  move(to: Position, duration: number): Promise<void> {
    const fromY = this.y;
    const fromX = this.x;
    const targetY = to.row * RenderChip.SIZE;
    const targetX = to.col * RenderChip.SIZE;

    new Tween({ y: this.scale.x * 2, x: this.scale.x * 2 })
      .to({ y: this.scale.x, x: this.scale.x })
      .easing(Easing.Quartic.InOut)
      .duration(duration)
      .onUpdate(({ y, x }) => {
        this.scale.y = y;
        this.scale.x = x;
      })
      .group(globalTweenGroup)
      .start();

    return new Promise((resolve) => {
      new Tween({ y: fromY, x: fromX })
        .to({ y: targetY, x: targetX })
        .easing(Easing.Quartic.InOut)
        .duration(duration)
        .onUpdate(({ y, x }) => {
          this.y = y;
          this.x = x;
        })
        .onComplete(() => resolve())
        .group(globalTweenGroup)
        .start();
    });
  }

  private subcsribeEvents() {
    this.on('pointerenter', () => {
      this.tint = 0xcccccc;
    });
    this.on('pointerleave', () => {
      this.tint = 0xffffff;
    });
  }
}
