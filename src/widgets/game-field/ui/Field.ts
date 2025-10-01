import { Container, type Size } from 'pixi.js';

import { BlockView } from '@/entities';
import { fieldStore, spawnNewBlocks, type Block } from '@/features';

import Background from './Background';

export class Field extends Container {

  private background = new Background();

  public blockContainer = new Container();

  constructor() {
    super();
    this.addChild(this.background, this.blockContainer);
    this.disable();
  }

  public disable() {
    this.eventMode = 'none';
    this.interactive = false;
    this.interactiveChildren = false;
  }

  public enable() {
    this.eventMode = 'auto';
    this.interactive = true;
    this.interactiveChildren = true;
  }

  public fill(...blocks: Block[]) {
    spawnNewBlocks(blocks, this.blockContainer);
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
