import { createBlockView } from '@/entities/lib/createBlockView';
import type { BlockView } from '@/entities/ui/BlockView';

import { animateSpawnBlocks } from './animateSpawnBlocks';
import { fieldStore } from './FieldStore';
import { onBlockClick } from './onBlockClick';

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

    viewBlock.on('pointertap', () =>
      onBlockClick(block.row, block.col, container),
    );
    viewBlock.setGridPosition(block.row, block.col);

    return viewBlock;
  });

  container.addChild(...viewBlocks.reverse());

  if (animated) {
    animateSpawnBlocks(viewBlocks);
  } else {
    viewBlocks.forEach((block) => block.show());
  }

  await Promise.all(promises);
  fieldStore.emit('blocks:added');
};
