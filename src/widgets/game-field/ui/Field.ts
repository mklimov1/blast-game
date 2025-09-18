import { Container, type Size } from "pixi.js";

import { BlockView } from "@/entities/ui/BlockView";
import { fieldStore } from "@/features/game-field/model/FieldStore";
import { spawnNewBlocks } from "@/features/game-field/model/spawnNewBlocks";
import type { Block } from "@/features/game-field/model/types";

import Background from "./Background";

export default class Field extends Container {

  private background = new Background();

  private blockContainer = new Container();

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
