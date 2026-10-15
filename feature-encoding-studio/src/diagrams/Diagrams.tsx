import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AnimatedBackground} from '../components/AnimatedBackground';
import {DatasetTable} from '../components/DatasetTable';
import {NumberLine, Staircase} from '../components/GraphAnimation';
import {Callout, Hl} from '../components/ui';
import {C, F, catColor} from '../theme';
import {ONE_HOT} from '../data/examples';

const Frame: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
  <AbsoluteFill style={{background: C.bg0, fontFamily: F.sans}}>
    <AnimatedBackground />
    <div style={{position: 'absolute', left: 90, top: 60, fontSize: 56, fontWeight: 800, color: C.text}}>{title}</div>
    <div style={{position: 'absolute', left: 90, right: 90, top: 190, bottom: 60}}>{children}</div>
  </AbsoluteFill>
);

/** Diagram 1 — integer codes place categories on a line, implying distances. */
export const DiagramNumberLine: React.FC = () => (
  <Frame title="Diagram 1 · Integer codes imply distance">
    <div style={{position: 'absolute', left: 170, top: 40}}>
      <NumberLine min={0} max={2} start={0.3} gapsAt={3.5} width={1400} gapLabel={(a, b) => `gap ${Math.abs(b - a)}`}
        points={[{value: 0, label: 'Red = 0', color: catColor.Red}, {value: 1, label: 'Blue = 1', color: catColor.Blue}, {value: 2, label: 'Green = 2', color: catColor.Green}]} />
    </div>
    <Callout at={0.5} accent={C.amber} size={36} style={{position: 'absolute', top: 520, left: 0, width: 1740}}>
      Colors have no real order or distance, yet the codes place them on a line with equal <Hl color={C.amber}>gaps</Hl>.
    </Callout>
  </Frame>
);

/** Diagram 2 — one-hot encoding turns one column into three binary columns. */
export const DiagramOneHot: React.FC = () => {
  const colors = ['Red', 'Blue', 'Green', 'Red'];
  return (
    <Frame title="Diagram 2 · One-hot: one category, one column">
      <div style={{position: 'absolute', top: 20, left: 80}}>
        <DatasetTable columns={['Color', 'Red', 'Blue', 'Green']} headerColors={[C.cyan, catColor.Red, catColor.Blue, catColor.Green]}
          rows={colors.map((c) => [c, ...ONE_HOT[c]])} start={0.2} rowDelay={0.4} colWidth={250} fontSize={46} />
      </div>
      <Callout at={0.5} accent={C.cyan} size={36} style={{position: 'absolute', top: 540, left: 0, width: 1740}}>
        Every row has exactly one <Hl>1</Hl>. The position of the 1 identifies the category.
      </Callout>
    </Frame>
  );
};

/** Diagram 3 — ordinal codes follow order, but real gaps can be uneven. */
export const DiagramStaircase: React.FC = () => (
  <Frame title="Diagram 3 · Ordinal codes keep order, not distance">
    <div style={{position: 'absolute', top: 10, left: 200}}>
      <Staircase items={[
        {label: 'Small', code: 0, color: C.cyan, size: 44}, {label: 'Medium', code: 1, color: C.blue, size: 76}, {label: 'Large', code: 2, color: C.violet, size: 108}]}
        heights={[70, 150, 360]} start={0.3} showCodesAt={2.5} showGapsAt={4.5} width={1300} />
    </div>
  </Frame>
);
