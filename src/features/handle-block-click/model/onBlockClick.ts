import type { BlockView } from "@/entities/ui/BlockView";
import { destroyBlocks } from "@/features/remove-cluster/model/destroyBlocks";
import { findConnected } from "@/features/remove-cluster/model/findConnected";

export const onBlockClick = (
  grid: BlockView[][],
  row: number,
  col: number,
) => {
  if (!grid?.[row]?.[col]) return;

  // eslint-disable-next-line no-console
  console.log(`Clicked block at row=${row}, col=${col}`);
  const positions = findConnected(grid, row, col);
  destroyBlocks(positions, grid);
};
