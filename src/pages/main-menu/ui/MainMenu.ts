import { Tween } from "@tweenjs/tween.js";

import { appEventEmitter, AssetsLoader } from "@/shared/lib";
import { sceneGroup } from "@/shared/lib/tween";
import { Scene } from "@/shared/scene/Scene";
import { sceneManager } from "@/shared/scene/SceneManager";
import { Button } from "@/shared/ui/Button";

import type { Size } from "pixi.js";

export class MainMenu extends Scene {
  private playButton!: Button;

  protected create() {
    this.playButton = new Button('play', 2);

    this.view.addChild(this.playButton);
  }

  protected show() {
    this.view.alpha = 0;
    new Tween({ alpha: 0 })
      .to({ alpha: 1 })
      .onUpdate(({ alpha }) => {
        this.view.alpha = alpha;
      })
      .duration(300)
      .group(sceneGroup)
      .start();
  }

  protected async load() {
    await AssetsLoader.load('FONTS');
    await AssetsLoader.load('BUTTONS');
  }

  public destroy() {
    this.unsubscribeEvents();
    this.view.destroy();
  }

  private resize(size: Size) {
    this.playButton.x = size.width * 0.5;
    this.playButton.y = size.height * 0.5;

    this.playButton.scale.set(size.height * 0.2 / this.playButton.defaultSize.height);
  }

  finishScene() {
    super.finishScene();
    sceneManager.changeScene('blastGame');
  }

  protected unsubscribeEvents() {
    appEventEmitter.off('resize', this.resize, this);
    this.playButton.off('click', this.finishScene, this);
  }

  protected subscribeEvents() {
    appEventEmitter.on('resize', this.resize, this);
    this.playButton.on('click', this.finishScene, this);
  }
}
