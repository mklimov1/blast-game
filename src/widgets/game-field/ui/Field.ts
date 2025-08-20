import { Container, type Size } from "pixi.js";

import { BlockView } from "@/entities/ui/BlockView";
import { createEmptyField } from "@/features/game-field/lib/createEmptyField";
import { spawnNewBlocks } from "@/features/game-field/model/spawnNewBlocks";
import { sceneEventEmitter } from "@/widgets/game-scene/model/sceneEventEmitter";

import Background from "./Background";

import type { Grid } from "../model/types";

export default class Field extends Container {
  private grid: Grid = [];

  private background = new Background();

  private blockContainer = new Container();

  constructor(rows: number, cols: number, maxColors: number) {
    super();
    this.addChild(this.background, this.blockContainer);
    this.build(rows, cols, maxColors);
    this.subscribeEvents();
    this.disable();
  }

  public disable() {
    this.eventMode = 'none';
  }

  public enable() {
    this.eventMode = 'auto';
  }

  private build(rows: number, cols: number, maxColors: number) {
    const size: Size = {
      width: BlockView.SIZE * cols,
      height: BlockView.SIZE * rows,
    };

    this.grid = createEmptyField<BlockView | null>(rows, cols);
    spawnNewBlocks(this.grid, this.blockContainer, maxColors);

    this.blockContainer.pivot.set(
      BlockView.SIZE * rows / 2,
      BlockView.SIZE * cols / 2,
    );
    this.background.width = size.width + 150;
    this.background.height = size.height + 150;
  }

  private resize({ width, height }: Size) {
    this.position.set(
      width * 0.5, height * 0.5,
    );

    this.scale.set(height * 0.5 / this.background.height);
  }

  private subscribeEvents() {
    sceneEventEmitter.on('scene:resize', this.resize, this);
  }
}
