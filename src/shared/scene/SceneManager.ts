import { Container, type Size } from 'pixi.js';

import { appEventEmitter, delay } from '../lib';
import { detectBreakpoint } from '../lib/detectBreakpoint';

import type { Scene } from './Scene';

export class SceneManager<T extends Record<string, new () => Scene>> {
  private currentScene: Scene | null = null;

  private loadingScene: Scene | null = null;

  private scenes!: T;

  private stage!: Container;

  private node!: HTMLElement;

  public async init(scenes: T, stage: Container, node: HTMLElement, loadingSceneKey?: keyof T) {
    this.stage = stage;
    this.node = node;
    this.scenes = scenes;

    const resize = () => this.resize();

    window.addEventListener('resize', resize);

    if (loadingSceneKey) {
      this.loadingScene = new this.scenes[loadingSceneKey]();
      await this.loadingScene.init();
    }
  }

  public async changeScene(newScene: keyof T, minLoadingDelay = 300) {
    if (!this.stage || !this.scenes) return;

    this.showLoadingScene();

    const scene = new this.scenes[newScene]();
    await scene.init();

    if (this.loadingScene && minLoadingDelay > 0) {
      await delay(minLoadingDelay);
    }

    this.hideCurrentScene();
    this.currentScene = scene;
    this.stage.addChild(scene.view);
    this.resize();
  }

  private showLoadingScene() {
    if (!this.loadingScene) return;

    if (this.currentScene) {
      this.stage.removeChild(this.currentScene.view);
    }
    this.stage.addChild(this.loadingScene.view);
    this.resize();
  }

  private hideCurrentScene() {
    if (this.loadingScene) {
      this.stage.removeChild(this.loadingScene.view);
    } else if (this.currentScene) {
      this.stage.removeChild(this.currentScene.view);
    }
  }

  private resize() {
    if (!this.node) return;
    const size: Size = {
      width: this.node.clientWidth,
      height: this.node.clientHeight,
    };
    appEventEmitter.emit('resize', size, detectBreakpoint(size.width));
  }
}
