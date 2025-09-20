import type BlastGame from "@/pages/blast-game";
import type { GameLose } from "@/pages/game-lose/ui/GameLose";
import type { GameWin } from "@/pages/game-win/ui/GameWin";
import type { MainMenu } from "@/pages/main-menu/ui/MainMenu";

export type SceneMap = {
  mainMenu: typeof MainMenu;
  gameWin: typeof GameWin;
  gameLose: typeof GameLose;
  blastGame: typeof BlastGame;
};

export type SceneName = keyof SceneMap;
