import { Container, type Size } from "pixi.js";

import { createBlock } from "@/entities/lib/createBlock";
import { blockColors, type BlockColor } from "@/entities/model/blockColors";
import { BlockView } from "@/entities/ui/BlockView";
import { onBlockClick } from "@/features/game-field/model/onBlockClick";
import { appEventEmitter } from "@/shared/lib";

import Background from "./Background";

export default class Field extends Container {
  private grid: BlockView[][] = [];

  private background = new Background();

  private blockContainer = new Container();

  constructor(rows: number, cols: number, maxColors: number) {
    super();
    this.addChild(this.background, this.blockContainer);
    this.build(rows, cols, maxColors);
    this.subscribeEvents();
  }

  private build(rows: number, cols: number, maxColors: number) {
    const size: Size = {
      width: BlockView.SIZE * cols,
      height: BlockView.SIZE * rows,
    };

    for (let row = rows - 1; row >= 0; row--) {
      for (let col = cols - 1; col >= 0; col--) {
        this.grid[row] ??= [];

        const color = this.randomColor(maxColors);
        const block = createBlock(color);

        this.blockContainer.addChild(block);
        this.grid[row][col] = block;
        block.setGridPosition(row, col);
        block.on('pointertap', () => onBlockClick(this.grid, block.row, block.col));
      }
    }
    this.blockContainer.pivot.set(
      BlockView.SIZE * rows / 2,
      BlockView.SIZE * cols / 2,
    );
    this.background.width = size.width + 150;
    this.background.height = size.height + 150;
  }

  private randomColor(maxColors: number): BlockColor {
    return blockColors[Math.floor(Math.random() * maxColors)];
  }

  private resize({ width, height }: Size) {
    this.position.set(
      width * 0.5, height * 0.5,
    );

    this.scale.set(height * 0.5 / this.background.height);
  }

  private subscribeEvents() {
    appEventEmitter.on('resize', this.resize, this);
  }
}
