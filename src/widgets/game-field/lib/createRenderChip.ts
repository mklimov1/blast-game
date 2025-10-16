import { RenderChip } from '../ui/RenderChip';

import type { Chip } from './entities/Chip';

export const createRenderChip = ({ id, color }: Chip): RenderChip => {
  const chip = new RenderChip(id, color);
  chip.scale.set(RenderChip.SIZE / chip.texture.width);
  return chip;
};
