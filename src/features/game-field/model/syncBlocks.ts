import type { BlockView } from "@/entities/ui/BlockView";

export const syncBlocks = async (displayBlocks: BlockView[]) => {
  const promises: Promise<void>[] = displayBlocks
    .filter((displayBlock) => {
      const block = displayBlock.getBlock();
      return block.col !== displayBlock.col || block.row !== displayBlock.row;
    })
    .map(displayBlock => {
      const block = displayBlock.getBlock();
      return displayBlock.animateToGridPosition(block.row, block.col);
    });

  await Promise.all(promises);
};
