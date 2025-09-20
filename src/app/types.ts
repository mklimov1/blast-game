import type { MainMenu } from "@/pages/main-menu/ui/MainMenu";

export type SceneMap = {
  mainMenu: typeof MainMenu;
};

export type SceneName = keyof SceneMap;
