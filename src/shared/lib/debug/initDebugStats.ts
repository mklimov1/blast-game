import type { Renderer } from 'pixi.js';

export const initDebugStats = (renderer: Renderer) => {
  if (!import.meta.env.DEV) return;

  import('pixi-stats').then(({ Stats }) => {
    const stats = new Stats(renderer);

    if (!stats.domElement) return;
    Object.assign(stats.domElement.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: '9999',
    });
  });
};
