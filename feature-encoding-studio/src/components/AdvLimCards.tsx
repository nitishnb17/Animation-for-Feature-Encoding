import React from 'react';
import {C} from '../theme';
import {Card, Reveal} from './ui';

/** Two animated cards (advantages / limitations) whose bullets reveal one at a time. */
export const AdvLimCards: React.FC<{adv: string[]; lim: string[]; advStart?: number; limStart?: number; bulletGap?: number; fontSize?: number}> = ({
  adv, lim, advStart = 3, limStart = 5, bulletGap = 2.4, fontSize = 36,
}) => (
  <div style={{display: 'flex', gap: 50, position: 'absolute', top: 0, left: 0}}>
    <Reveal at={1}>
      <Card accent={C.green} style={{width: 845, height: 640}}>
        <div style={{fontSize: 44, fontWeight: 800, color: C.green, marginBottom: 24}}>✓ Advantages</div>
        {adv.map((a, i) => (<Reveal key={a} at={advStart + i * bulletGap}><div style={{fontSize, margin: '20px 0', lineHeight: 1.3}}>• {a}</div></Reveal>))}
      </Card>
    </Reveal>
    <Reveal at={2}>
      <Card accent={C.amber} style={{width: 845, height: 640}}>
        <div style={{fontSize: 44, fontWeight: 800, color: C.amber, marginBottom: 24}}>! Limitations</div>
        {lim.map((a, i) => (<Reveal key={a} at={limStart + i * bulletGap}><div style={{fontSize, margin: '20px 0', lineHeight: 1.3}}>• {a}</div></Reveal>))}
      </Card>
    </Reveal>
  </div>
);
