import { Container, Rectangle, type Size } from 'pixi.js';

import { BlockView } from '@/entities';
import { fieldStore, spawnNewBlocks, type Chip } from '@/features';

import Background from './Background';

export class Field extends Container {

  private background = new Background();

  public blockContainer = new Container<BlockView>();

  protected chipMap: Map<string, BlockView>;

  constructor() {
    super();
    this.addChild(this.background, this.blockContainer);
    this.disable();
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
    const chips = ids.map(id => this.chipMap.get(id)).filter(chip => !!chip);

    this.blockContainer.removeChild(...chips);
    ids.forEach(id => {
      this.chipMap.delete(id);
    });
  }

  public fill(...chips: Chip[]) {
    spawnNewBlocks(chips, this.blockContainer);

    this.blockContainer.children.forEach(block => {
      this.chipMap.set(block.id, block);
    });

    this.hitArea = new Rectangle(
      this.blockContainer.width * -0.5,
      this.blockContainer.height * -0.5,
      this.blockContainer.width,
      this.blockContainer.height,
    );
  }

  public getChipByPosition(globalPosition: {x: number; y: number}) {
    const chip = this.blockContainer.children.find(chip =>
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
