import type { RenderChip } from '../ui/RenderChip';
import type { Chip } from './entities/Chip';

export const moveChipOnGrid = async (chip: Chip, renderChip: RenderChip) => {
  const duration = (chip.row - chip.prevRow) * 50;
  const { y } = renderChip;
  renderChip.setGridPosition(chip.row, chip.col);
  renderChip.y = y;
  await renderChip.moveY(chip, duration);
};
