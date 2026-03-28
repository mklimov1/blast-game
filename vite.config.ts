import { defaultConfig } from '@mklimov1/vite-game-forge';
import { assetpackPlugin, defaultPipesConfig } from '@mklimov1/vite-game-forge/assetpack';

export default defaultConfig({
  plugins: [assetpackPlugin({ pixiPipes: defaultPipesConfig })],
});
