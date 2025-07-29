import type { BlockColor } from "@/entities/model/blockColors";

import { BlockView } from "../ui/BlockView";

export const createBlock = (color: BlockColor): BlockView => {
  const block = new BlockView(color);
  block.scale.set(BlockView.SIZE / block.texture.width);
  return block;
};
