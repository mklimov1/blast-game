import { Container, Graphics, Ticker } from 'pixi.js';

import type { BlockColor } from '@/entities';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

const colorMap: Record<BlockColor, string> = {
  blue: '#0098E8',
  green: '#3BBD23',
  orange: '#F19E00',
  purple: '#C8399D',
  red: '#EC2C44',
};

export class ShatterEffect extends Container {
  private g: Graphics;

  private particles: Particle[] = [];

  private gravity = 0.5;

  private friction = 0.98;

  private life = 50;

  private ticker: Ticker;

  constructor() {
    super();
    this.ticker = new Ticker();
    this.g = new Graphics();
    this.addChild(this.g);
  }

  spawn(x: number, y: number, color: BlockColor) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: this.life,
        size: 8 + Math.random() * 3,
        color: colorMap[color],
      });
    }
  }

  update(ticker: Ticker) {
    const dt = ticker.deltaTime;

    this.g.clear();

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.vx *= Math.pow(this.friction, dt);
      p.vy *= Math.pow(this.friction, dt);
      p.vy += this.gravity;

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      p.life -= dt;

      if (p.life <= 0 || p.y > window.innerHeight + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      const alpha = p.life / this.life;
      this.g.rect(p.x, p.y, p.size, p.size);
      this.g.fill({
        alpha,
        color: p.color,
      });
    }
  }

  public start() {
    this.ticker.add(this.update, this);
    this.ticker.start();
  }

  public stop() {
    this.ticker.stop();
    this.ticker.remove(this.update, this);
  }
}
