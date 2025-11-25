import { Container, Rectangle, type Size } from 'pixi.js';

import type { Breakpoint } from '@/shared';

import Background from './Background';
import { RenderChip } from './RenderChip';

export class Field extends Container {
  private background = new Background();

  public blockContainer = new Container<RenderChip>();

  protected chipMap: Map<string, RenderChip>;

  constructor() {
    super();
    this.addChild(this.background, this.blockContainer);
    this.disable();
    this.blockContainer.sortableChildren = true;
    this.interactiveChildren = false;
    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.chipMap = new Map();
  }

  public disable() {
    this.interactive = false;
  }

  public enable() {
    this.interactive = true;
  }

  public getChipById(id: string) {
    return this.chipMap.get(id);
  }

  removeChips(...ids: string[]) {
    const chips = ids.map((id) => this.chipMap.get(id)).filter((chip) => !!chip);

    this.blockContainer.removeChild(...chips);
    chips.forEach((chip) => chip.destroy());
    ids.forEach((id) => {
      this.chipMap.delete(id);
    });
  }

  public updateHitArea() {
    this.hitArea = new Rectangle(
      this.blockContainer.width * -0.5,
      this.blockContainer.height * -0.5,
      this.blockContainer.width,
      this.blockContainer.height,
    );
  }

  public addChips(...chips: RenderChip[]) {
    this.blockContainer.addChild(...chips);

    chips.forEach((chip) => {
      this.chipMap.set(chip.id, chip);
    });
  }

  public getChipByPosition(globalPosition: { x: number; y: number }) {
    const chip = this.blockContainer.children.find((chip) =>
      chip.getBounds().containsPoint(globalPosition.x, globalPosition.y),
    );
    return chip;
  }

  public getChips() {
    return this.blockContainer.children;
  }

  public setup(rows: number, cols: number) {
    const size: Size = {
      width: RenderChip.SIZE * cols,
      height: RenderChip.SIZE * rows,
    };
    const chipPivotOffset = RenderChip.SIZE * -0.5;

    this.blockContainer.pivot.set(
      (RenderChip.SIZE * rows) / 2 + chipPivotOffset,
      (RenderChip.SIZE * cols) / 2 + chipPivotOffset,
    );
    this.background.width = size.width + 150;
    this.background.height = size.height + 150;
  }

  public resize({ width, height }: Size, breakpoint: Breakpoint) {
    const scale = Math.min(
      (height * 0.5) / this.background.height,
      (width * 0.95) / this.background.width,
    );

    if (breakpoint === 'mobile' || breakpoint === 'tablet') {
      this.position.set(width * 0.5, height * 0.45);
    } else {
      this.position.set(width * 0.45, height * 0.5);
    }

    this.scale.set(scale);
  }
}
