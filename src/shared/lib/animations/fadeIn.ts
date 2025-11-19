import { Tween, type Group, Easing } from '@tweenjs/tween.js';

type Target = {
  alpha: number;
  scale: {
    x: number;
    y: number;
  }
}

export const fadeIn = (target: Target, group: Group): Promise<void> => {
  const toScale = target.scale.x;
  target.alpha = 0;

  return new Promise((resolve) => {
    new Tween({ alpha: 0, scale: 0.3 })
      .to({ alpha: 1, scale: toScale })
      .onUpdate(({ alpha, scale }) => {
        target.alpha = alpha;
        target.scale.x = scale;
        target.scale.y = scale;
      })
      .onComplete(() => resolve())
      .easing(Easing.Back.Out)
      .duration(100)
      .group(group)
      .start();
  });
};
