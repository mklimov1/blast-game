import type { ClassicBlastGame } from '@/pages/blast-game/ui/ClassicBlastGame';
import type { TimerBlastGame } from '@/pages/blast-game/ui/TimerBlastGame';
import type { GameLose } from '@/pages/game-lose/ui/GameLose';
import type { GameWin } from '@/pages/game-win/ui/GameWin';
import type { MainMenu } from '@/pages/main-menu/ui/MainMenu';

export type SceneMap = {
  mainMenu: typeof MainMenu;
  gameWin: typeof GameWin;
  gameLose: typeof GameLose;
  classicBlastGame: typeof ClassicBlastGame;
  timerBlastGame: typeof TimerBlastGame;
};

export type SceneName = keyof SceneMap;
