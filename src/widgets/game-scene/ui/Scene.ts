import { Container } from "pixi.js";

import Field from "@/widgets/game-field";
import { GameStats } from "@/widgets/game-stats/ui/GameStats";

import { Progress } from "./Progress";

export default class Scene {
  public view = new Container();

  private chipField!: Field;

  private create() {
    const progress = new Progress();
    const gameStats = new GameStats(50);

    this.chipField = new Field(8, 8, 3);

    this.view.addChild(this.chipField, progress, gameStats);
  }

  public init() {
    this.create();
  }
}
