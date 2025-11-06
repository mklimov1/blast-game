import type { Breakpoint } from '../types/responsive';

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export const detectBreakpoint = (width: number): Breakpoint => {
  if (width < MOBILE_BREAKPOINT) return 'mobile';
  if (width < TABLET_BREAKPOINT) return 'tablet';
  return 'desktop';
};
