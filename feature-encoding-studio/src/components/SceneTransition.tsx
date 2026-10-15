import React from 'react';
import {AbsoluteFill, Series, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, VIDEO} from '../theme';
import {prog} from '../anim';
import {AnimatedBackground} from './AnimatedBackground';

export type SceneFC = React.FC<{dur: number}>;
export type SceneDef = {name: string; dur: number; Comp: SceneFC};

/** Total length in frames of a scene list (durations are in seconds). */
export const totalFrames = (scenes: SceneDef[]): number =>
  scenes.reduce((sum, s) => sum + Math.round(s.dur * VIDEO.fps), 0);

/**
 * Scene wrapper: fades in/out, applies a slow camera push-in, draws the scene heading,
 * and gives children a padded absolute content area.
 */
export const Scene: React.FC<{
  dur: number;
  heading?: string;
  children?: React.ReactNode;
  noPad?: boolean;
}> = ({dur, heading, children, noPad}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const opacity = Math.min(prog(t, 0, 0.6), 1 - prog(t, dur - 0.6, 0.6));
  const zoom = 1 + 0.03 * (t / dur);
  const head = prog(t, 0.2, 0.7);
  return (
    <AbsoluteFill style={{opacity, transform: `scale(${zoom})`, transformOrigin: '50% 45%'}}>
      {heading && (
        <div style={{position: 'absolute', left: 90, top: 52, opacity: head, transform: `translateX(${(1 - head) * -30}px)`,
          display: 'flex', alignItems: 'center', gap: 22, fontFamily: F.sans}}>
          <div style={{width: 8, height: 54, background: `linear-gradient(${C.cyan}, ${C.violet})`, borderRadius: 4}} />
          <div style={{fontSize: 52, fontWeight: 700, color: C.text, letterSpacing: -0.5}}>{heading}</div>
        </div>
      )}
      <div style={{position: 'absolute', left: noPad ? 0 : 90, right: noPad ? 0 : 90, top: noPad ? 0 : heading ? 160 : 70, bottom: noPad ? 0 : 70}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

/** Runs a list of scenes back to back on top of the continuous background, with a slim progress bar. */
export const VideoShell: React.FC<{scenes: SceneDef[]; label: string}> = ({scenes, label}) => {
  const frame = useCurrentFrame();
  const total = totalFrames(scenes);
  return (
    <AbsoluteFill style={{background: C.bg0, fontFamily: F.sans}}>
      <AnimatedBackground />
      <Series>
        {scenes.map((s) => (
          <Series.Sequence key={s.name} durationInFrames={Math.round(s.dur * VIDEO.fps)}>
            <s.Comp dur={s.dur} />
          </Series.Sequence>
        ))}
      </Series>
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 6, width: `${(frame / total) * 100}%`,
        background: `linear-gradient(90deg, ${C.blue}, ${C.cyan}, ${C.violet})`}} />
      <div style={{position: 'absolute', right: 40, bottom: 18, fontSize: 22, color: C.dim, fontFamily: F.sans}}>{label}</div>
    </AbsoluteFill>
  );
};
