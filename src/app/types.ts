import type { DefaultBlastGame } from '@/pages/blast-game/ui/DefaultBlastGame';
import type { TimedBlastGame } from '@/pages/blast-game/ui/TimedBlastGame';
import type { GameLose } from '@/pages/game-lose/ui/GameLose';
import type { GameWin } from '@/pages/game-win/ui/GameWin';
import type { MainMenu } from '@/pages/main-menu/ui/MainMenu';

export type SceneMap = {
  mainMenu: typeof MainMenu;
  gameWin: typeof GameWin;
  gameLose: typeof GameLose;
  defaultBlastGame: typeof DefaultBlastGame;
  timedBlastGame: typeof TimedBlastGame;
};

export type SceneName = keyof SceneMap;
