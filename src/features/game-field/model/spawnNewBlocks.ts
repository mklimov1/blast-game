import { createBlockView } from '@/entities';
import type { BlockView } from '@/entities';

import { animateSpawnBlocks } from './animateSpawnBlocks';
import { fieldStore } from './FieldStore';

import type { Block } from './types';
import type { Container } from 'pixi.js';

export const spawnNewBlocks = async (
  newBlocks: Block[],
  container: Container,
  animated = false,
): Promise<void> => {
  const promises: Promise<void>[] = [];

  const viewBlocks: BlockView[] = newBlocks.map(block => {
    const viewBlock = createBlockView(block);
    viewBlock.setGridPosition(block.row, block.col);
    return viewBlock;
  });

  container.addChild(...viewBlocks.reverse());

  if (animated) {
    promises.push(animateSpawnBlocks(viewBlocks));
  } else {
    viewBlocks.forEach((block) => block.show());
  }

  await Promise.all(promises);
  fieldStore.emit('blocks:added');
};
