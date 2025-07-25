import type { BlockColor } from "@/entities/model/blockColors";

import { BlockView } from "../ui/BlockView";

export const createBlock = (color: BlockColor, width: number): BlockView => {
  const block = new BlockView(color);
  block.scale.set(width / block.texture.width);
  return block;
};
