import type { RenderChip } from '../ui/RenderChip';
import type { Chip } from './entities/Chip';

export const moveChipOnGrid = async (chip: Chip, renderChip: RenderChip) => {
  const duration = (chip.row - chip.prevRow) * 50;
  await renderChip.moveY(chip, duration);
};
