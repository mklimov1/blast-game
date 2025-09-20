import { Tween } from '@tweenjs/tween.js';

import { tweenGroup } from '../tween';

import type { Container } from 'pixi.js';

export const show = (target: Container) => {
  target.alpha = 0;
  return new Tween({ alpha: 0 })
    .to({ alpha: 1 })
    .onUpdate(({ alpha }) => {
      target.alpha = alpha;
    })
    .duration(300)
    .group(tweenGroup)
    .start();
};
