import type { ClassicBlastGame, TimerBlastGame, GameLose, GameWin, MainMenu } from '@/pages';

export type SceneMap = {
  mainMenu: typeof MainMenu;
  gameWin: typeof GameWin;
  gameLose: typeof GameLose;
  classicBlastGame: typeof ClassicBlastGame;
  timerBlastGame: typeof TimerBlastGame;
};

export type SceneName = keyof SceneMap;
