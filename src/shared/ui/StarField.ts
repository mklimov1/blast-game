import { Graphics, type FillInput, type Size } from 'pixi.js';

import { globalTicker } from '../lib';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  alpha: number;
}

export class StarField extends Graphics {
  private stars: Star[] = [];

  private backgroundColor: FillInput;

  private starCount: number;

  private screenSize: Size = { width: 0, height: 0 };

  constructor(backgroundColor: FillInput = { color: '#000000' }, starCount: number = 200) {
    super();
    this.starCount = starCount;
    this.backgroundColor = backgroundColor;
  }

  private createStars() {
    this.stars = [];
    for (let i = 0; i < this.starCount; i++) {
      this.stars.push({
        x: Math.random() * this.screenSize.width,
        y: Math.random() * this.screenSize.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.2 + 0.05,
        alpha: Math.random() * 0.8 + 0.2,
      });
    }
  }

  private update() {
    this.clear();
    this.rect(0, 0, this.screenSize.width, this.screenSize.height);
    this.fill(this.backgroundColor);

    for (const star of this.stars) {
      star.y += star.speed;
      if (star.y > this.screenSize.height) {
        star.y = 0;
        star.x = Math.random() * this.screenSize.width;
      }

      this.rect(star.x, star.y, star.size, star.size);
    }
    this.fill('#ffffff');
  }

  public start() {
    globalTicker.add(this.update, this);
  }

  public stop() {
    globalTicker.remove(this.update, this);
  }

  public resize(size: Size) {
    this.screenSize = size;
    this.createStars();
  }
}
