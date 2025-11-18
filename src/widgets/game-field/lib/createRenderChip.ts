import { RenderChip } from '../ui/RenderChip';

import type { Chip } from './entities/Chip';

export const createRenderChip = ({ id, kind, type }: Chip): RenderChip => {
  const chip = new RenderChip(id, kind, type);
  chip.scale.set(RenderChip.SIZE / chip.texture.width);
  return chip;
};
