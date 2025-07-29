import { Container, type Size } from "pixi.js";

import { createBlock } from "@/entities/lib/createBlock";
import { blockColors, type BlockColor } from "@/entities/model/blockColors";
import type { BlockView } from "@/entities/ui/BlockView";
import { onBlockClick } from "@/features/handle-block-click/model/onBlockClick";
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
    const BLOCK_SIZE = 200;

    const size: Size = {
      width: BLOCK_SIZE * cols,
      height: BLOCK_SIZE * rows,
    };

    for (let row = rows - 1; row >= 0; row--) {
      for (let col = cols - 1; col >= 0; col--) {
        this.grid[row] ??= [];

        const color = this.randomColor(maxColors);
        const block = createBlock(color, BLOCK_SIZE);

        this.blockContainer.addChild(block);
        this.grid[row][col] = block;

        block.position.set(col * BLOCK_SIZE, row * BLOCK_SIZE);
        block.on('pointertap', () => onBlockClick(this.grid, row, col));
      }
    }
    this.blockContainer.pivot.set(
      BLOCK_SIZE * rows / 2,
      BLOCK_SIZE * cols / 2,
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
