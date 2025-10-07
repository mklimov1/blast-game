import type { BlockView } from '@/entities';

export const syncBlocks = async (displayBlocks: BlockView[]) => {
  const promises: Promise<void>[] = displayBlocks
    .filter((displayBlock) => {
      const block = displayBlock.getBlock();
      return block.col !== displayBlock.col || block.row !== displayBlock.row;
    })
    .map(displayBlock => {
      const { row, col } = displayBlock.getBlock();
      return displayBlock.moveOnGrid({ row, col });
    });

  await Promise.all(promises);
};
