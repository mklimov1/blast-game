import { sound } from '@pixi/sound';

const STORAGE_KEY = 'sound_enabled';

export class SoundSettings {
  private static _enabled: boolean = localStorage.getItem(STORAGE_KEY) !== 'false';

  static get enabled() {
    return SoundSettings._enabled;
  }

  static toggle(): boolean {
    SoundSettings._enabled = !SoundSettings._enabled;
    localStorage.setItem(STORAGE_KEY, String(SoundSettings._enabled));
    SoundSettings._apply();
    return SoundSettings._enabled;
  }

  static init() {
    sound.volumeAll = 0.5;
    sound.disableAutoPause = false;
    SoundSettings._apply();
  }

  private static _apply() {
    if (SoundSettings._enabled) {
      sound.unmuteAll();
    } else {
      sound.muteAll();
    }
  }
}
