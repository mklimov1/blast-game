import {
  Container,
  FederatedPointerEvent,
  Sprite,
  Texture,
  type DestroyOptions,
  type Size,
} from 'pixi.js';

import { GlitchFilter } from '../lib';

interface ParallaxSprite extends Sprite {
  speedFactor: number;
}

export class ParallaxBackground extends Container {
  private layers: ParallaxSprite[] = [];

  private defaultSize: Size = { width: 0, height: 0 };

  private maxOffset: number = 5;

  private glitch = new GlitchFilter({ autoPlay: false });

  private glitchTimerId?: NodeJS.Timeout;

  private isGlitching = false;

  constructor(sources: (Texture | string)[]) {
    super();

    const layerCount = sources.length;

    sources.forEach((source, index) => {
      const sprite = Sprite.from(source) as ParallaxSprite;
      sprite.x = 0;
      sprite.y = 0;
      sprite.speedFactor = (index + 1) / layerCount;

      this.addChild(sprite);
      this.layers.push(sprite);
    });

    this.defaultSize.width = this.layers?.[0].width || 0;
    this.defaultSize.height = this.layers?.[0].height || 0;

    this.pivot.set(this.defaultSize.width * 0.5, this.defaultSize.height * 0.5);
    this.interactive = true;
    this.on('globalpointermove', this.onMouseMove, this);
    window.addEventListener('pointerdown', this.onPointerDown);

    this.playGlitch();
  }

  private playGlitch() {
    this.glitchTimerId = setTimeout(() => {
      this.isGlitching = true;
      this.filters = [this.glitch];
      this.glitch.play();
    }, 5000);
  }

  private stopGlitch() {
    clearTimeout(this.glitchTimerId);

    if (this.isGlitching) {
      this.filters = [];
      this.glitch.stop();
      this.isGlitching = false;
    }
  }

  private onPointerDown = () => {
    this.stopGlitch();
    this.playGlitch();
  };

  private onMouseMove(event: FederatedPointerEvent) {
    const { x, y } = event.global;
    this.updateMouseParallax(x, y);
  }

  public move(deltaX: number, deltaY: number) {
    for (const sprite of this.layers) {
      sprite.x -= deltaX * sprite.speedFactor;
      sprite.y -= deltaY * sprite.speedFactor;
    }
  }

  private updateMouseParallax(mouseX: number, mouseY: number) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const offsetX = (mouseX - centerX) / centerX;
    const offsetY = (mouseY - centerY) / centerY;

    for (let i = 1; i < this.layers.length; i++) {
      const sprite = this.layers[i];
      sprite.x = -offsetX * this.maxOffset * sprite.speedFactor;
      sprite.y = -offsetY * this.maxOffset * sprite.speedFactor;
    }
  }

  public resize({ width, height }: Size) {
    const { defaultSize } = this;
    const scale = Math.max(width / defaultSize.width, height / defaultSize.height) * 1.05;

    this.x = width * 0.5;
    this.y = height * 0.5;
    this.scale.set(scale);
  }

  override destroy(options?: DestroyOptions): void {
    clearTimeout(this.glitchTimerId);
    this.off('globalpointermove', this.onMouseMove, this);
    window.removeEventListener('pointerdown', this.onPointerDown);
    this.glitch.destroy();
    super.destroy(options);
  }
}
