import { Graphics, type Size } from 'pixi.js';

import { appEventEmitter, AssetsLoader } from '@/shared/lib';
import { show } from '@/shared/lib/animations';
import { Scene } from '@/shared/scene/Scene';
import { sceneManager } from '@/shared/scene/SceneManager';
import { Button } from '@/shared/ui/Button';

export class MainMenu extends Scene {
  private playDefaultButton!: Button;

  private playTimedButton!: Button;

  private background = this.createBackground();

  protected create() {
    this.playDefaultButton = new Button('default mode', 2);
    this.playTimedButton = new Button('timed mode', 2);

    this.view.addChild(this.background, this.playDefaultButton, this.playTimedButton);
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

    this.playDefaultButton.scale.set(size.height * 0.2 / this.playDefaultButton.defaultSize.height);
    this.playDefaultButton.x = size.width * 0.5;
    this.playDefaultButton.y = size.height * 0.5 + this.playDefaultButton.height;

    this.playTimedButton.scale.set(size.height * 0.2 / this.playTimedButton.defaultSize.height);
    this.playTimedButton.x = size.width * 0.5;
    this.playTimedButton.y = size.height * 0.5 - this.playTimedButton.height;

  }

  playDefaultBlastGame() {
    super.finishScene();
    sceneManager.changeScene('defaultBlastGame');
  }

  playTimedBlastGame() {
    super.finishScene();
    sceneManager.changeScene('timedBlastGame');
  }

  protected unsubscribeEvents() {
    appEventEmitter.off('resize', this.resize, this);
    this.playDefaultButton.off('click', this.playDefaultBlastGame, this);
    this.playTimedButton.off('click', this.playTimedBlastGame, this);
  }

  protected subscribeEvents() {
    appEventEmitter.on('resize', this.resize, this);
    this.playDefaultButton.on('click', this.playDefaultBlastGame, this);
    this.playTimedButton.on('click', this.playTimedBlastGame, this);
  }
}
