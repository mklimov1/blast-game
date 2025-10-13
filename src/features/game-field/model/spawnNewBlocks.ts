import { createBlockView } from '@/entities';
import type { BlockView } from '@/entities';
import type { Field } from '@/widgets';

import { animateSpawnBlocks } from './animateSpawnBlocks';
import { fieldStore } from './FieldStore';

import type { Chip } from './Chip';

export const spawnNewBlocks = async (
  newBlocks: Chip[],
  field: Field,
  animated = false,
): Promise<void> => {
  const promises: Promise<void>[] = [];
  const blockMap = new Map(newBlocks.map(block => [block.id, block]));

  const viewBlocks: BlockView[] = newBlocks.map(block => {
    const viewBlock = createBlockView(block);
    viewBlock.setGridPosition(block.row, block.col);
    return viewBlock;
  });

  field.addChips(...viewBlocks.reverse());

  if (animated) {
    promises.push(animateSpawnBlocks(viewBlocks, blockMap));
  } else {
    viewBlocks.forEach((block) => block.show());
  }

  await Promise.all(promises);
  fieldStore.emit('blocks:added');
};
