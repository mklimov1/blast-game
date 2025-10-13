import { BlockView } from '@/entities';
import type { Field } from '@/widgets';

import { fieldStore } from './FieldStore';

import type { Chip } from './Chip';

export const destroyBlocks = async (
  blocks: Chip[],
  displayBlocks: BlockView[],
  field: Field,
) => {
  const removedBlocks = fieldStore.removeCluster(...blocks);

  const promises: Promise<void>[] = displayBlocks
    .filter(block => removedBlocks.some(({ id }) => block.id === id))
    .map(block => block.destroyBlock());

  field.removeChips(...blocks.map(({ id }) => id));

  await Promise.all(promises);
};
