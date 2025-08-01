import { destroyBlocks } from "@/features/game-field/model/destroyBlocks";
import { findConnected } from "@/features/game-field/model/findConnected";
import type { Grid } from "@/widgets/game-field/model/types";

import { applyGravity } from "./applyGravity";
import { sortByDistance } from "./sortByDistance";
import { spawnNewBlocks } from "./spawnNewBlocks";

import type { Container } from "pixi.js";

export const onBlockClick = async (
  grid: Grid,
  row: number,
  col: number,
  blockContainer: Container,
  maxColors: number,
) => {
  if (!grid?.[row]?.[col]) return;

  // eslint-disable-next-line no-console
  console.log(`Clicked block at row=${row}, col=${col}`);
  const positions = findConnected(grid, row, col);
  const sortedPositions = sortByDistance(positions, { row, col });

  await destroyBlocks(sortedPositions, grid);
  applyGravity(grid);
  spawnNewBlocks(grid, blockContainer, maxColors, true);
};
