import { Container, Ticker, type Size } from 'pixi.js';

import { sceneManager } from '@/app';
import { delay, appEventEmitter, AssetsLoader, Scene, ShatterEffect, animations, tweenGroup, defer, type Defer, type Breakpoint, Mode, scoreStore } from '@/shared';
import { GameFieldController, type Chip, type RenderChip } from '@/widgets';

import type { IGameMode } from '../model/game-mode/types';

export class BlastGame<M extends Mode> extends Scene {
  protected mode!: IGameMode<M>;

  public view = new Container();

  protected wrapper!: Container;

  protected gameField!: GameFieldController;

  private destroyEffect!: ShatterEffect;

  private ticker = new Ticker();

  private deferred!: Defer;

  protected create() {
    this.wrapper = new Container();
    this.gameField = new GameFieldController();
    this.destroyEffect = new ShatterEffect();

    this.wrapper.addChild(this.gameField.view, this.destroyEffect);
    this.view.addChild(this.wrapper);
    this.destroyEffect.start();
  }

  protected async load() {
    await AssetsLoader.load('FONTS');
    await AssetsLoader.load('BUTTONS');
    await AssetsLoader.load('PROGRESS-BAR');
    await AssetsLoader.load('GAME');
    await AssetsLoader.load('UI');
  }

  public async init() {
    await super.init();
    this.gameField.setup({ rows: 8, cols: 8, uniqueChipsCount: 3 });
  }

  protected finishScene(isWin: boolean) {
    super.finishScene();
    sceneManager.changeScene(isWin ? 'gameWin' : 'gameLose');
    this.destroyEffect.stop();
  }

  protected show() {
    animations.show(this.view, tweenGroup);
  }

  protected unsubscribeEvents() {
    appEventEmitter.off('resize', this.resize, this);
    this.gameField.off('destroyedChips', this.onChipsDestroyed, this);
    this.gameField.off('updateField', this.onFieldUpdated, this);
  }

  protected resize(size: Size, breakpoint: Breakpoint) {
    this.gameField.resize(size, breakpoint);
  }

  private async win() {
    this.gameField.disable();
    await delay(1000);
    this.finishScene(true);
  }

  private async lose() {
    this.gameField.disable();
    await delay(1000);
    this.finishScene(false);
  }

  private async finish({ status, score }: {status: 'win' | 'lose', score: number}) {
    await this.deferred.promise;

    scoreStore.set(this.mode.type, score);

    if (status === 'win') {
      this.win();
      return;
    } else if (status === 'lose') {
      this.lose();
    }
  }

  private showDestroyEffect(...chips: Chip[]) {
    const displayBlocks = this.gameField.view.getChips();
    const displayBlockMap = new Map(displayBlocks.map(block => [block.id, block]));
    const destroyedBlocks: RenderChip[] = chips
      .map(chip => displayBlockMap.get(chip.id))
      .filter((b): b is RenderChip => b !== undefined);

    destroyedBlocks.forEach((block) => {
      const global = block.toGlobal({
        x: block.width * 0.5,
        y: block.height * 0.5,
      });
      this.destroyEffect.spawn(global.x, global.y, block.power);
    });
  }

  protected destroy() {
    this.ticker.stop();
    this.ticker.destroy();
    super.destroy();
  }

  private onChipsDestroyed(chips: Chip[]) {
    this.deferred = defer();
    this.showDestroyEffect(...chips);
    this.mode.update(chips.length);
  };

  private onFieldUpdated() {
    this.deferred.resolve();
  }

  protected subscribeEvents() {
    appEventEmitter.on('resize', this.resize, this);
    this.mode.on('finish', this.finish, this);
    this.gameField.on('destroyedChips', this.onChipsDestroyed, this);
    this.gameField.on('updateField', this.onFieldUpdated, this);
  }
}
