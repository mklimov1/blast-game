import { createBlock } from "@/entities/lib/createBlock";
import { getRandomBlockColor } from "@/entities/lib/getRandomBlockColor";
import { BlockView } from "@/entities/ui/BlockView";

import { onBlockClick } from "./onBlockClick";
import { forEachGridBottomRight } from "../lib/forEachGridBottomRight";

import type { Container } from "pixi.js";

export const spawnNewBlocks = async (
  grid: (BlockView | null)[][],
  container: Container,
  maxColors: number,
  animated = false,
): Promise<void> => {
  const promises: Promise<void>[] = [];

  forEachGridBottomRight(grid, (row, col, item) => {
    if (!item) {
      const color = getRandomBlockColor(maxColors);
      const block = createBlock(color);

      block.on('pointertap', () =>
        onBlockClick(grid, block.row, block.col, container, maxColors),
      );
      grid[row][col] = block;
      container.addChild(block);

      if (!animated) {
        block.setGridPosition(row, col);
        return;
      }
      block.setGridPosition(-1, col);
      block.show();
      promises.push(block.animateToGridPosition(row, col));
    }
  });

  await Promise.all(promises);
};
