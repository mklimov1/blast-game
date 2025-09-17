import { createBlockView } from "@/entities/lib/createBlockView";

import { onBlockClick } from "./onBlockClick";

import type { Block } from "./types";
import type { Container } from "pixi.js";

export const spawnNewBlocks = async (
  newBlocks: Block[],
  container: Container,
  animated = false,
): Promise<void> => {
  const promises: Promise<void>[] = [];

  const viewBlocks = newBlocks.map(block => {
    const viewBlock = createBlockView(block);

    viewBlock.on('pointertap', () =>
      onBlockClick(block.row, block.col, container),
    );

    if (!animated) {
      viewBlock.setGridPosition(block.row, block.col);
    } else {
      viewBlock.setGridPosition(-1, block.col);
      const p = (async () => {
        viewBlock.show();
        await viewBlock.animateToGridPosition(block.row, block.col);
      })();

      promises.push(p);
    }

    return viewBlock;
  });

  container.addChild(...viewBlocks.reverse());

  await Promise.all(promises);
};
