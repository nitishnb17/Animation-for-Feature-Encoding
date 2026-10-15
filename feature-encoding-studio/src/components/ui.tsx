import React from 'react';
import {C, F, catColor} from '../theme';
import {lerp, prog, useSec} from '../anim';

type RevealProps = {
  at: number;
  dur?: number;
  dy?: number;
  scale?: number;
  until?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/** The workhorse entrance: fade + rise (+ optional scale) at a given second. */
export const Reveal: React.FC<RevealProps> = ({at, dur = 0.7, dy = 24, scale = 1, until, style, children}) => {
  const t = useSec();
  const k = prog(t, at, dur);
  const out = until === undefined ? 1 : 1 - prog(t, until, 0.5);
  return (
    <div style={{opacity: k * out, transform: `translateY(${(1 - k) * dy}px) scale(${lerp(scale, 1, k)})`, ...style}}>
      {children}
    </div>
  );
};

export const Hl: React.FC<{color?: string; children?: React.ReactNode}> = ({color = C.cyan, children}) => (
  <span style={{color, fontWeight: 700}}>{children}</span>
);

export const Chip: React.FC<{label: string; color?: string; size?: number}> = ({label, color, size = 34}) => {
  const col = color ?? catColor[label] ?? C.blue;
  return (
    <span
      style={{
        display: 'inline-block',
        padding: `${size * 0.22}px ${size * 0.6}px`,
        borderRadius: 999,
        border: `2px solid ${col}`,
        background: `${col}22`,
        color: C.text,
        fontSize: size,
        fontWeight: 700,
        fontFamily: F.sans,
        boxShadow: `0 0 24px ${col}44`,
      }}
    >
      {label}
    </span>
  );
};

/** A readable explanation block with an accent bar. */
export const Callout: React.FC<{
  at: number;
  accent?: string;
  size?: number;
  width?: number;
  until?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({at, accent = C.cyan, size = 36, width, until, style, children}) => (
  <Reveal at={at} until={until} style={{width, ...style}}>
    <div
      style={{
        borderLeft: `6px solid ${accent}`,
        background: 'rgba(16,26,56,0.82)',
        padding: '20px 30px',
        borderRadius: '0 14px 14px 0',
        fontSize: size,
        lineHeight: 1.4,
        color: C.text,
        fontFamily: F.sans,
      }}
    >
      {children}
    </div>
  </Reveal>
);

/** Rounded glowing panel used for cards. */
export const Card: React.FC<{accent?: string; style?: React.CSSProperties; children?: React.ReactNode}> = ({
  accent = C.blue,
  style,
  children,
}) => (
  <div
    style={{
      background: 'linear-gradient(160deg, rgba(22,34,74,0.95), rgba(12,20,46,0.95))',
      border: `2px solid ${accent}66`,
      borderRadius: 22,
      padding: 30,
      boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${accent}22`,
      fontFamily: F.sans,
      color: C.text,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Mono: React.FC<{color?: string; size?: number; children?: React.ReactNode}> = ({
  color = C.cyan,
  size = 34,
  children,
}) => <span style={{fontFamily: F.mono, color, fontSize: size, fontWeight: 600}}>{children}</span>;
