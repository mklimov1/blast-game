import { Container } from "pixi.js";

import type { SceneMap, SceneName } from "@/app/types";

import { appEventEmitter } from "../lib";

import type { Scene } from "./Scene";

class SceneManager {
  private currentScene: Scene | null = null;

  private scenes!: SceneMap;

  private stage!: Container;

  private node!: HTMLElement;

  public init(scenes: SceneMap, stage: Container, node: HTMLElement) {
    this.stage = stage;
    this.node = node;
    this.scenes = scenes;
  }

  public async changeScene(newScene: SceneName) {
    if (!this.stage || !this.scenes) return;

    if (this.currentScene) {
      this.stage.removeChild(this.currentScene.view);
      this.currentScene.destroy();
    }
    const scene = new this.scenes[newScene]();
    this.currentScene = scene;
    await scene.init();
    this.stage.addChild(this.currentScene.view);
    this.resize();
  }

  private resize() {
    if (!this.node) return;
    appEventEmitter.emit('resize', {
      width: this.node.clientWidth,
      height: this.node.clientHeight,
    });
  }
}

export const sceneManager = new SceneManager();
