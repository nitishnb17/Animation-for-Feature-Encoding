import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

/** Seconds elapsed inside the current <Sequence>. */
export const useSec = (): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

export const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** 0 → 1 progress between `start` and `start + dur` seconds, eased and clamped. */
export const prog = (t: number, start: number, dur = 0.8): number =>
  interpolate(t, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

export const lerp = (a: number, b: number, k: number): number => a + (b - a) * k;

/** Deterministic pseudo-random in [0, 1) so every render frame is reproducible. */
export const rand = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
