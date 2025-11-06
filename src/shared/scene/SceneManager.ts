import { Container, type Size } from 'pixi.js';

import { appEventEmitter } from '../lib';

import type { Scene } from './Scene';
import type { Breakpoint } from '../types/responsive';

export class SceneManager<T extends Record<string, new () => Scene>> {
  private currentScene: Scene | null = null;

  private scenes!: T;

  private stage!: Container;

  private node!: HTMLElement;

  public init(scenes: T, stage: Container, node: HTMLElement) {
    this.stage = stage;
    this.node = node;
    this.scenes = scenes;

    const resize = () => this.resize();

    window.addEventListener('resize', resize);
  }

  public async changeScene(newScene: keyof T) {
    if (!this.stage || !this.scenes) return;

    if (this.currentScene) {
      this.stage.removeChild(this.currentScene.view);
    }

    const scene = new this.scenes[newScene]();

    this.currentScene = scene;
    await scene.init();
    this.stage.addChild(this.currentScene.view);
    this.resize();
  }

  private resize() {
    if (!this.node) return;
    const size: Size = {
      width: this.node.clientWidth,
      height: this.node.clientHeight,
    };
    const breakpoint: Breakpoint = size.width < 768 ? 'mobile' : 'desktop';

    appEventEmitter.emit('resize', size, breakpoint);
  }
}
