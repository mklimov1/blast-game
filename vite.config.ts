import { defineConfig } from "vite";
import { playableConfig } from "@mklimov1/vite-playable";
import {
  assetpackPlugin,
  defaultPipesConfig,
} from "@mklimov1/vite-playable/assetpack";

export default defineConfig(({ mode }) =>
    playableConfig({
      network: mode,
      plugins: [assetpackPlugin({ pixiPipes: defaultPipesConfig })],
    }),
);