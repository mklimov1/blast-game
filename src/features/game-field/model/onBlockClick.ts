import { destroyBlocks } from "@/features/game-field/model/destroyBlocks";
import { findConnected } from "@/features/game-field/model/findConnected";
import type { Grid } from "@/widgets/game-field/model/types";

import { applyGravity } from "./applyGravity";

export const onBlockClick = (
  grid: Grid,
  row: number,
  col: number,
) => {
  if (!grid?.[row]?.[col]) return;

  // eslint-disable-next-line no-console
  console.log(`Clicked block at row=${row}, col=${col}`);
  const positions = findConnected(grid, row, col);
  destroyBlocks(positions, grid);
  applyGravity(grid);
};
