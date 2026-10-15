import React from 'react';
import {C, F} from '../theme';
import {prog, useSec} from '../anim';

export type Stage = {label: string; sub?: string; color?: string};

/** Left-to-right pipeline. Boxes and arrows reveal in sequence; a glowing packet travels through once built. */
export const Pipeline: React.FC<{stages: Stage[]; start: number; step?: number; boxWidth?: number; fontSize?: number}> = ({stages, start, step = 1.2, boxWidth = 330, fontSize = 32}) => {
  const t = useSec();
  const gap = 90;
  const total = stages.length * boxWidth + (stages.length - 1) * gap;
  const done = start + stages.length * step;
  const travel = prog(t, done + 0.3, stages.length * 0.9);
  const px = travel * (total - 40);
  return (
    <div style={{position: 'relative', width: total, height: 200}}>
      <div style={{display: 'flex', alignItems: 'center', gap}}>
        {stages.map((s, i) => {
          const k = prog(t, start + i * step, 0.7);
          const col = s.color ?? C.blue;
          return (
            <React.Fragment key={i}>
              <div style={{width: boxWidth, minHeight: 150, padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', textAlign: 'center', borderRadius: 20, border: `3px solid ${col}`, background: `${col}22`,
                boxShadow: `0 0 36px ${col}44`, color: C.text, fontFamily: F.sans, fontSize, fontWeight: 700, opacity: k, transform: `translateY(${(1 - k) * 30}px)`}}>
                {s.label}
                {s.sub && <div style={{fontSize: fontSize * 0.72, fontWeight: 500, color: C.dim, marginTop: 6}}>{s.sub}</div>}
              </div>
              {i < stages.length - 1 && (
                <svg width={gap} height={40} style={{opacity: prog(t, start + i * step + 0.5, 0.5)}}>
                  <line x1={4} y1={20} x2={gap - 16} y2={20} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" />
                  <polygon points={`${gap - 18},8 ${gap - 2},20 ${gap - 18},32`} fill={C.cyan} />
                </svg>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {travel > 0 && travel < 1 && (
        <div style={{position: 'absolute', left: px, top: 88, width: 24, height: 24, borderRadius: 12, background: C.cyan, boxShadow: `0 0 30px 10px ${C.cyan}88`}} />
      )}
    </div>
  );
};
