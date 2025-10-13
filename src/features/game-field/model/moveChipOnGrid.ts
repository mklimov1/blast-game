import type { BlockView } from '@/entities';

import type { Chip } from './Chip';

export const moveChipOnGrid = async (chip: Chip, renderChip: BlockView) => {
  const duration = (chip.row - chip.prevRow) * 50;
  await renderChip.moveY(chip, duration);
};
