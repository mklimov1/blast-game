import { createBlockView } from '@/entities';
import type { BlockView } from '@/entities';

import { animateSpawnBlocks } from './animateSpawnBlocks';
import { fieldStore } from './FieldStore';

import type { Chip } from './Chip';
import type { Container } from 'pixi.js';

export const spawnNewBlocks = async (
  newBlocks: Chip[],
  container: Container,
  animated = false,
): Promise<void> => {
  const promises: Promise<void>[] = [];
  const blockMap = new Map(newBlocks.map(block => [block.id, block]));

  const viewBlocks: BlockView[] = newBlocks.map(block => {
    const viewBlock = createBlockView(block);
    viewBlock.setGridPosition(block.row, block.col);
    return viewBlock;
  });

  container.addChild(...viewBlocks.reverse());

  if (animated) {
    promises.push(animateSpawnBlocks(viewBlocks, blockMap));
  } else {
    viewBlocks.forEach((block) => block.show());
  }

  await Promise.all(promises);
  fieldStore.emit('blocks:added');
};
