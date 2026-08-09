import { defineConfig } from "vite";
import { createConfig } from "@mklimov1/vite-playable";
import {
  assetpackPlugin,
  defaultPipesConfig,
} from "@mklimov1/vite-playable/assetpack";

export default defineConfig(() =>
    createConfig({
      plugins: [assetpackPlugin({ pixiPipes: defaultPipesConfig })],
    }),
);