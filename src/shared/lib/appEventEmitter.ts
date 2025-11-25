import EventEmitter from 'eventemitter3';
import { type Size } from 'pixi.js';

import type { Breakpoint } from '@/shared';

type TEvents = {
  resize: (size: Size, breakpoint: Breakpoint) => void;
};

export const appEventEmitter = new EventEmitter<TEvents>();
