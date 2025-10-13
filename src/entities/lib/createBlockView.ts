import type { Chip } from '@/features';

import { BlockView } from '../ui/BlockView';

export const createBlockView = (block: Chip): BlockView => {
  const blockView = new BlockView(block.id, block.color);
  blockView.scale.set(BlockView.SIZE / blockView.texture.width);
  return blockView;
};
