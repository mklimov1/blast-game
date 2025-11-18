import { Graphics, Ticker } from 'pixi.js';

import { ChipPower, Color } from '@/widgets';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

const colorMap: Record<Color | ChipPower, string> = {
  [Color.BLUE]: '#0098E8',
  [Color.GREEN]: '#3BBD23',
  [Color.ORANGE]: '#F19E00',
  [Color.PURPLE]: '#C8399D',
  [Color.RED]: '#EC2C44',
  [ChipPower.BOMB]: '#4a4a4a',
};

export class ShatterEffect extends Graphics {
  private particles: Particle[] = [];

  private gravity = 0.5;

  private friction = 0.98;

  private life = 50;

  private ticker: Ticker;

  constructor() {
    super();
    this.ticker = new Ticker();
  }

  spawn(x: number, y: number, color: Color | ChipPower) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: this.life,
        size: 8 + Math.random() * 3,
        color: colorMap[color] || '#ffffff',
      });
    }
  }

  update(ticker: Ticker) {
    const dt = ticker.deltaTime;

    this.clear();

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
      this.rect(p.x, p.y, p.size, p.size);
      this.fill({
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
