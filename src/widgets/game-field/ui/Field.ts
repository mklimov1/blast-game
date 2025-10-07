import { Container, Rectangle, type Size } from 'pixi.js';

import { BlockView } from '@/entities';
import { fieldStore, spawnNewBlocks, type Block } from '@/features';

import Background from './Background';

export class Field extends Container {

  private background = new Background();

  public blockContainer = new Container<BlockView>();

  constructor() {
    super();
    this.addChild(this.background, this.blockContainer);
    this.disable();
    this.interactiveChildren = false;
    this.eventMode = 'static';
    this.cursor = 'pointer';
  }

  public disable() {
    this.interactive = false;
  }

  public enable() {
    this.interactive = true;
  }

  public fill(...blocks: Block[]) {
    spawnNewBlocks(blocks, this.blockContainer);

    this.hitArea = new Rectangle(
      this.blockContainer.width * -0.5,
      this.blockContainer.height * -0.5,
      this.blockContainer.width,
      this.blockContainer.height,
    );
  }

  public getChipByPosition(globalPosition: {x: number; y: number}): BlockView | undefined {
    const [chip] = this.blockContainer.children.filter(chip =>
      chip.getBounds().containsPoint(globalPosition.x, globalPosition.y),
    );
    return chip;
  }

  public setup() {
    const { cols, rows } = fieldStore.getGridSettings();
    const size: Size = {
      width: BlockView.SIZE * cols,
      height: BlockView.SIZE * rows,
    };

    this.blockContainer.pivot.set(
      BlockView.SIZE * rows / 2,
      BlockView.SIZE * cols / 2,
    );
    this.background.width = size.width + 150;
    this.background.height = size.height + 150;
  }

  public resize({ width, height }: Size) {
    this.position.set(
      width * 0.5, height * 0.5,
    );

    this.scale.set(height * 0.5 / this.background.height);
  }
}
