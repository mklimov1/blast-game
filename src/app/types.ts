import type { ClassicBlastGame, TimerBlastGame, GameLose, GameWin, MainMenu } from '@/pages';
import type { LoadingScreen } from '@/pages/loading-screen';

export type SceneMap = {
  mainMenu: typeof MainMenu;
  gameWin: typeof GameWin;
  gameLose: typeof GameLose;
  classicBlastGame: typeof ClassicBlastGame;
  timerBlastGame: typeof TimerBlastGame;
  loading: typeof LoadingScreen;
};

export type SceneName = keyof SceneMap;
