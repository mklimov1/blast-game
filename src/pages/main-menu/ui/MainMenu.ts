import { Graphics, type Size } from 'pixi.js';

import { appEventEmitter, AssetsLoader } from '@/shared/lib';
import { show } from '@/shared/lib/animations';
import { Scene } from '@/shared/scene/Scene';
import { sceneManager } from '@/shared/scene/SceneManager';
import { Button } from '@/shared/ui/Button';

export class MainMenu extends Scene {
  private playClassicButton!: Button;

  private playTimerButton!: Button;

  private background = this.createBackground();

  protected create() {
    this.playClassicButton = new Button('classic mode', 2);
    this.playTimerButton = new Button('timer mode', 2);

    this.view.addChild(this.background, this.playClassicButton, this.playTimerButton);
  }

  private createBackground() {
    const g = new Graphics()
      .rect(0, 0, 100, 100)
      .fill('#1b1b21');

    return g;
  }

  protected show() {
    show(this.view);
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
    this.background.width = size.width;
    this.background.height = size.height;

    this.playClassicButton.scale.set(size.height * 0.2 / this.playClassicButton.defaultSize.height);
    this.playClassicButton.x = size.width * 0.5;
    this.playClassicButton.y = size.height * 0.5 + this.playClassicButton.height;

    this.playTimerButton.scale.set(size.height * 0.2 / this.playTimerButton.defaultSize.height);
    this.playTimerButton.x = size.width * 0.5;
    this.playTimerButton.y = size.height * 0.5 - this.playTimerButton.height;

  }

  playClassicBlastGame() {
    super.finishScene();
    sceneManager.changeScene('classicBlastGame');
  }

  playTimerBlastGame() {
    super.finishScene();
    sceneManager.changeScene('timerBlastGame');
  }

  protected unsubscribeEvents() {
    appEventEmitter.off('resize', this.resize, this);
    this.playClassicButton.off('click', this.playClassicBlastGame, this);
    this.playTimerButton.off('click', this.playTimerBlastGame, this);
  }

  protected subscribeEvents() {
    appEventEmitter.on('resize', this.resize, this);
    this.playClassicButton.on('click', this.playClassicBlastGame, this);
    this.playTimerButton.on('click', this.playTimerBlastGame, this);
  }
}
