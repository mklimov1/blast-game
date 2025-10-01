import type { Block } from '@/features';

import { BlockView } from '../ui/BlockView';

export const createBlockView = (block: Block): BlockView => {
  const blockView = new BlockView(block);
  blockView.scale.set(BlockView.SIZE / blockView.texture.width);
  return blockView;
};
