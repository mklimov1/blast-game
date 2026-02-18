import { sound } from '@pixi/sound';

const STORAGE_KEY = 'sound_enabled';

export class SoundSettings {
  private static _enabled: boolean = localStorage.getItem(STORAGE_KEY) !== 'false';

  static get enabled() {
    return this._enabled;
  }

  static toggle(): boolean {
    this._enabled = !this._enabled;
    localStorage.setItem(STORAGE_KEY, String(this._enabled));
    this._apply();
    return this._enabled;
  }

  private static _apply() {
    if (this._enabled) {
      sound.unmuteAll();
    } else {
      sound.muteAll();
    }
  }
}
