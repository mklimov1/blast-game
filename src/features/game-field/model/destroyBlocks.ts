import type { Grid, Position } from "@/widgets/game-field/model/types";

import { gameFieldEventEmitter } from "../lib/gameFieldEventEmitter";

export const destroyBlocks = async (
  positions: Position[],
  grid: Grid,
) => {
  if (positions.length < 3) return;

  const promises: Promise<void>[] = [];
  let delay = 0;

  for (const { row, col } of positions) {
    const block = grid[row][col];
    if (!block) continue;

    grid[row][col] = null;

    promises.push(block.destroyBlock(delay));
    delay += 10;
  }

  gameFieldEventEmitter.emit("blocks:destroyed", positions);

  await Promise.all(promises);
};
