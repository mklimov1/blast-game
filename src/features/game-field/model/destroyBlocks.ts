import { BlockView } from '@/entities';
import type { Position } from '@/widgets';

import { fieldStore } from './FieldStore';

export const destroyBlocks = async (
  positions: Position[],
  displayBlocks: BlockView[],
) => {
  const blocks = fieldStore.removeCluster(...positions);
  const promises: Promise<void>[] = displayBlocks
    .filter(block => blocks.includes(block.getBlock()))
    .map(block => block.destroyBlock());

  await Promise.all(promises);
};
