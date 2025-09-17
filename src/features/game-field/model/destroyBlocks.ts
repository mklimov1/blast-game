import { BlockView } from "@/entities/ui/BlockView";
import type { Position } from "@/widgets/game-field/model/types";

import { fieldStore } from "./FieldStore";

export const destroyBlocks = async (
  positions: Position[],
  displayBlocks: BlockView[],
) => {
  const blocks = fieldStore.removeCluster(...positions);
  const promises: Promise<void>[] = displayBlocks
    .filter(block => blocks.includes(block.getBlock()))
    .map(block => block.destroyBlock());

  await Promise.all(promises);
};
