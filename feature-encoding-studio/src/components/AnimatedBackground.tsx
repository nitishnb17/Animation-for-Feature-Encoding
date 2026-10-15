import React, {useEffect, useRef} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, VIDEO, catColor} from '../theme';
import {ease, lerp, rand} from '../anim';

/** Continuous dark-navy backdrop: drifting grid, soft glows, and a faint neural-network of nodes. */
export const AnimatedBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const nodes = Array.from({length: 26}, (_, i) => ({
    x: rand(i + 1) * VIDEO.width,
    y: rand(i + 77) * VIDEO.height,
    px: rand(i + 5) * 6.28,
    r: 3 + rand(i + 9) * 4,
  }));
  const pos = nodes.map((n, i) => ({
    x: n.x + Math.sin(t * 0.25 + n.px) * 40,
    y: n.y + Math.cos(t * 0.21 + n.px + i) * 30,
    r: n.r,
  }));
  const links: React.ReactNode[] = [];
  for (let i = 0; i < pos.length; i++) {
    for (let j = i + 1; j < pos.length; j++) {
      const d = Math.hypot(pos[i].x - pos[j].x, pos[i].y - pos[j].y);
      if (d < 300) {
        links.push(
          <line key={`${i}-${j}`} x1={pos[i].x} y1={pos[i].y} x2={pos[j].x} y2={pos[j].y}
            stroke={C.blue} strokeOpacity={(1 - d / 300) * 0.18} strokeWidth={1.5} />,
        );
      }
    }
  }
  const gridShift = (t * 12) % 80;
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 30% 20%, ${C.bg1} 0%, ${C.bg0} 70%)`}}>
      <svg width={VIDEO.width} height={VIDEO.height} style={{position: 'absolute'}}>
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"
            patternTransform={`translate(${gridShift} ${gridShift})`}>
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke={C.line} strokeOpacity="0.22" strokeWidth="1" />
          </pattern>
          <radialGradient id="glowA"><stop offset="0%" stopColor={C.violet} stopOpacity="0.22" /><stop offset="100%" stopColor={C.violet} stopOpacity="0" /></radialGradient>
          <radialGradient id="glowB"><stop offset="0%" stopColor={C.cyan} stopOpacity="0.16" /><stop offset="100%" stopColor={C.cyan} stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <circle cx={1500 + Math.sin(t * 0.2) * 80} cy={250} r={520} fill="url(#glowA)" />
        <circle cx={360 + Math.cos(t * 0.17) * 80} cy={880} r={520} fill="url(#glowB)" />
        {links}
        {pos.map((p, i) => (<circle key={i} cx={p.x} cy={p.y} r={p.r} fill={C.cyan} fillOpacity={0.28} />))}
      </svg>
    </AbsoluteFill>
  );
};

const CLUSTER_NAMES = ['Red', 'Blue', 'Green', 'Red', 'Blue'];

/**
 * Canvas particle field. `converge` (0→1) pulls thousands of points into five colour clusters.
 * Everything is a pure function of the frame, so renders are deterministic.
 */
export const ParticleField: React.FC<{count?: number; converge: number; clusterY?: number}> = ({
  count = 3000,
  converge,
  clusterY = 540,
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const t = frame / fps;
    ctx.clearRect(0, 0, VIDEO.width, VIDEO.height);
    const k = ease(Math.min(1, Math.max(0, converge)));
    for (let i = 0; i < count; i++) {
      const sx = rand(i * 3 + 1) * VIDEO.width;
      const sy = rand(i * 3 + 2) * VIDEO.height;
      const speed = 20 + rand(i * 3 + 3) * 60;
      const driftX = (sx + t * speed) % VIDEO.width;
      const driftY = sy + Math.sin(t * 0.8 + i) * 18;
      const cl = i % 5;
      const cx = 280 + cl * 340;
      const ang = rand(i * 7 + 4) * 6.283;
      const rad = Math.sqrt(rand(i * 7 + 5)) * 120;
      const tx = cx + Math.cos(ang + t * 0.4) * rad;
      const ty = clusterY + Math.sin(ang + t * 0.4) * rad;
      const x = lerp(driftX, tx, k);
      const y = lerp(driftY, ty, k);
      const base = catColor[CLUSTER_NAMES[cl]];
      ctx.fillStyle = k > 0.25 ? base : C.cyan;
      ctx.globalAlpha = 0.25 + 0.5 * rand(i * 3 + 9) * (0.6 + 0.4 * k);
      ctx.fillRect(x, y, 2.4, 2.4);
    }
    ctx.globalAlpha = 1;
  }, [frame, fps, converge, count, clusterY]);
  return <canvas ref={ref} width={VIDEO.width} height={VIDEO.height} style={{position: 'absolute', left: 0, top: 0}} />;
};
