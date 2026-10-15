import React from 'react';
import {Scene, SceneDef, SceneFC, VideoShell, totalFrames} from '../components/SceneTransition';
import {DatasetTable} from '../components/DatasetTable';
import {CodePanel, OutputPanel} from '../components/CodePanel';
import {NumberLine, SparseMatrix} from '../components/GraphAnimation';
import {Pipeline} from '../components/Pipeline';
import {MathBlock} from '../components/MathBlock';
import {AdvLimCards} from '../components/AdvLimCards';
import {Callout, Card, Chip, Hl, Mono, Reveal} from '../components/ui';
import {C, F, catColor} from '../theme';
import {lerp, prog, rand, useSec} from '../anim';
import {COLORS, ONE_HOT} from '../data/examples';

const abs = (top: number, left = 0): React.CSSProperties => ({position: 'absolute', top, left});
const CATS = ['Red', 'Blue', 'Green'];

/** A row of binary blocks, e.g. [1, 0, 0]; the active bit glows. */
const BitBlocks: React.FC<{bits: number[]; size?: number; color?: string; fill?: number}> = ({bits, size = 110, color = C.cyan, fill = 1}) => (
  <div style={{display: 'flex', gap: 14}}>
    {bits.map((b, i) => (
      <div key={i} style={{width: size, height: size, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: F.mono, fontSize: size * 0.5, fontWeight: 800, color: b ? C.bg0 : C.dim,
        background: b ? color : 'rgba(42,58,116,0.35)', border: `3px solid ${b ? color : C.line}`,
        boxShadow: b ? `0 0 ${34 * fill}px ${color}` : 'none'}}>{b}</div>
    ))}
  </div>
);

/* ───────── S1 — Introduction ───────── */
const S1: SceneFC = ({dur}) => {
  const t = useSec();
  const into = prog(t, 1, 3.5);
  const split = prog(t, 6, 2.5);
  const title = prog(t, 8, 1.4);
  const colX = [480, 960, 1440];
  return (
    <Scene dur={dur} noPad>
      <div style={{...abs(380, 760), width: 400, height: 280, borderRadius: 28, border: `4px solid ${C.violet}`, background: `${C.violet}22`,
        boxShadow: `0 0 ${60 + 30 * Math.sin(t * 3)}px ${C.violet}77`, opacity: prog(t, 0.2, 0.8), display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: F.sans, fontSize: 34, fontWeight: 700, color: C.text, textAlign: 'center'}}>Transformation<br />chamber</div>
      {COLORS.map((c, i) => {
        const x = lerp(-200 + i * 20, 900 + (i % 2) * 40, into);
        const out = 1 - prog(t, 5.2, 0.8);
        return (<div key={i} style={{...abs(445 + i * 28 - 40, x), opacity: into * out}}><Chip label={c} size={30} /></div>);
      })}
      {CATS.map((c, i) => {
        const k = prog(t, 6 + i * 0.5, 1.2);
        const x = lerp(960, colX[i], split);
        return (
          <div key={c} style={{...abs(lerp(480, 740, split), x - 110), width: 220, opacity: k, textAlign: 'center'}}>
            <div style={{height: 230, borderRadius: 18, border: `3px solid ${catColor[c]}`, background: `${catColor[c]}22`, boxShadow: `0 0 36px ${catColor[c]}66`}} />
            <div style={{marginTop: 16, fontSize: 40, fontWeight: 800, color: catColor[c], fontFamily: F.sans}}>{c}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', fontFamily: F.sans, opacity: title, filter: `blur(${(1 - title) * 14}px)`, transform: `scale(${lerp(1.1, 1, title)})`}}>
        <div style={{fontSize: 40, color: C.cyan, fontWeight: 600, letterSpacing: 8 * (1 - title) + 2}}>FEATURE ENCODING</div>
        <div style={{fontSize: 108, fontWeight: 800, color: C.text, letterSpacing: -2}}>ONE-HOT ENCODING</div>
      </div>
      <Reveal at={11.5} style={{position: 'absolute', left: 0, right: 0, top: 1000, textAlign: 'center', fontSize: 48, color: C.text, fontFamily: F.sans}}>
        Represent categories <Hl>without inventing a ranking</Hl>.
      </Reveal>
    </Scene>
  );
};

/* ───────── S2 — The basic idea ───────── */
const S2: SceneFC = ({dur}) => (
  <Scene dur={dur} heading="The basic idea">
    <div style={abs(0)}><DatasetTable columns={['Color']} rows={COLORS.map((c) => [c])} start={0.8} rowDelay={0.7} colWidth={260} fontSize={40} /></div>
    <Callout at={5} accent={C.cyan} style={{...abs(0, 420), width: 1320}}>Each <Hl>unique category</Hl> receives its <Hl>own binary feature</Hl>.</Callout>
    <Reveal at={7.5} style={{...abs(125, 420), fontSize: 34, color: C.dim, fontFamily: F.sans}}>Unique categories in this column: Red, Blue, Green → 3 new columns</Reveal>
    <div style={{...abs(210, 440), display: 'flex', gap: 40}}>
      {CATS.map((c, i) => (
        <Reveal key={c} at={9 + i * 2.2} scale={0.9}>
          <div style={{width: 280}}>
            <div style={{fontSize: 40, fontWeight: 800, textAlign: 'center', color: catColor[c], marginBottom: 12, fontFamily: F.sans}}>{c}</div>
            {[0, 1, 2, 3].map((r) => (<div key={r} style={{height: 68, marginBottom: 8, borderRadius: 12, border: `2px dashed ${catColor[c]}88`, background: `${catColor[c]}11`}} />))}
          </div>
        </Reveal>
      ))}
    </div>
    <Callout at={16} accent={C.violet} style={{...abs(640), width: 1740}}>New columns: <Hl color={C.violet}>Red</Hl>, <Hl color={C.violet}>Blue</Hl>, <Hl color={C.violet}>Green</Hl>. Next, we fill them with 1s and 0s.</Callout>
  </Scene>
);

/* ───────── S3 — Animated transformation ───────── */
const S3: SceneFC = ({dur}) => {
  const rowGap = 6;
  const T = (r: number) => 1.5 + r * rowGap;
  const rows = COLORS.map((c) => [c, ...ONE_HOT[c]]);
  const hits = COLORS.map((c) => CATS.indexOf(c) + 1);
  return (
    <Scene dur={dur} heading="From one column to three">
      <div style={abs(0)}>
        <DatasetTable columns={['Color', 'Red', 'Blue', 'Green']} headerColors={[C.cyan, catColor.Red, catColor.Blue, catColor.Green]}
          rows={rows} start={0.6} rowDelay={rowGap} colWidth={230} fontSize={42}
          render={(r, c, tt) => {
            if (c === 0) return rows[r][0];
            const isHit = c === hits[r];
            const at = T(r) + (isHit ? 1.5 : 3);
            const k = prog(tt, at, 0.7);
            return <span style={{opacity: k, display: 'inline-block', transform: `scale(${lerp(0.3, 1, k)})`, fontFamily: F.mono, fontWeight: 800, color: isHit ? C.green : C.dim}}>{k < 0.05 ? '·' : rows[r][c]}</span>;
          }}
          cellStyle={(r, c, tt) => {
            const live = tt > T(r) && tt < T(r) + rowGap - 0.5;
            if (live && c === 0) return {background: `${catColor[COLORS[r]]}33`};
            if (live && c === hits[r] && tt > T(r) + 0.6) return {background: 'rgba(52,245,164,0.2)'};
            return {};
          }} />
      </div>
      {COLORS.map((c, i) => (
        <Reveal key={i} at={T(i)} until={T(i) + rowGap - 0.3} style={{...abs(30, 1040), width: 700}}>
          <Card accent={catColor[c]} style={{fontSize: 34, lineHeight: 1.45}}>
            Row {i + 1} is <Hl color={catColor[c]}>{c}</Hl>.<br />
            The <Hl color={catColor[c]}>{c}</Hl> column lights up and becomes <Mono color={C.green}>1</Mono>.<br />
            The other two become <Mono color={C.dim}>0</Mono>.
          </Card>
        </Reveal>
      ))}
      <Callout at={T(3) + 4.5} accent={C.cyan} style={{...abs(610), width: 1740}}>Each row still represents <Hl>one original observation</Hl>. Only the way we write it changed.</Callout>
    </Scene>
  );
};

/* ───────── S4 — Binary vectors ───────── */
const S4: SceneFC = ({dur}) => {
  const t = useSec();
  const idx = Math.min(2, Math.max(0, Math.floor((t - 13) / 3)));
  const name = CATS[idx];
  return (
    <Scene dur={dur} heading="Each category becomes a vector">
      {CATS.map((c, i) => (
        <Reveal key={c} at={1 + i * 2.2} style={{...abs(i * 150), display: 'flex', alignItems: 'center', gap: 36}}>
          <div style={{width: 250, fontSize: 52, fontWeight: 800, color: catColor[c], fontFamily: F.mono}}>{c} =</div>
          <BitBlocks bits={ONE_HOT[c]} size={100} color={catColor[c]} />
        </Reveal>
      ))}
      <Reveal at={12} style={{...abs(0, 1020), width: 700}}>
        <Card accent={C.cyan} style={{height: 420, textAlign: 'center'}}>
          <div style={{fontSize: 36, color: C.dim, marginBottom: 14}}>The active bit moves:</div>
          <div style={{fontSize: 64, fontWeight: 800, color: catColor[name], fontFamily: F.mono, marginBottom: 24}}>{name}</div>
          <div style={{display: 'flex', justifyContent: 'center'}}><BitBlocks bits={ONE_HOT[name]} size={130} color={catColor[name]} /></div>
        </Card>
      </Reveal>
      <Callout at={17} accent={C.green} style={{...abs(510), width: 1740}}><Mono color={C.green}>1</Mono> means "this is the category". <Mono color={C.dim}>0</Mono> means "this is not the category".</Callout>
      <Callout at={23} accent={C.violet} style={{...abs(650), width: 1740}}>Exactly <Hl color={C.violet}>one</Hl> bit is "hot" (on) in every vector. That is where the name comes from.</Callout>
    </Scene>
  );
};

/* ───────── S5 — Why it is useful ───────── */
const S5: SceneFC = ({dur}) => {
  const t = useSec();
  const k = prog(t, 10, 1);
  const tri = [{x: 690, y: 110, c: 'Red'}, {x: 520, y: 400, c: 'Blue'}, {x: 860, y: 400, c: 'Green'}];
  return (
    <Scene dur={dur} heading="Why one-hot encoding helps">
      <Reveal at={0.8} style={abs(0)}>
        <Card accent={C.red} style={{width: 840, height: 540}}>
          <div style={{fontSize: 36, fontWeight: 800, color: C.red, marginBottom: 10}}>A: integer codes</div>
          <div style={{fontFamily: F.mono, fontSize: 34, lineHeight: 1.5}}>Red = 0 · Blue = 1 · Green = 2</div>
          <div style={{marginLeft: -50, marginTop: 20}}>
            <NumberLine width={780} min={0} max={2} start={3} gapsAt={7} gapLabel={(a, b) => `${Math.abs(b - a)}`}
              points={[{value: 0, label: 'Red', color: catColor.Red}, {value: 1, label: 'Blue', color: catColor.Blue}, {value: 2, label: 'Green', color: catColor.Green}]} />
          </div>
          <div style={{fontSize: 28, color: C.dim, opacity: prog(t, 9, 0.6)}}>Red–Green looks 2× farther than Red–Blue.</div>
        </Card>
      </Reveal>
      <Reveal at={2} style={abs(0, 900)}>
        <Card accent={C.green} style={{width: 840, height: 540}}>
          <div style={{fontSize: 36, fontWeight: 800, color: C.green, marginBottom: 10}}>B: one-hot vectors</div>
          <div style={{fontFamily: F.mono, fontSize: 34, lineHeight: 1.5}}>Red = [1,0,0] · Blue = [0,1,0] · Green = [0,0,1]</div>
          <svg width={780} height={380}>
            <g opacity={k}>
              <polygon points={`${tri[0].x - 450},${tri[0].y} ${tri[1].x - 450},${tri[1].y} ${tri[2].x - 450},${tri[2].y}`} fill="none" stroke={C.amber} strokeWidth={4} strokeDasharray="10 8" />
              <text x={tri[0].x - 450 + 40} y={tri[0].y + 150} fill={C.amber} fontSize={30} fontFamily={F.mono}>√2</text>
              <text x={tri[0].x - 450 - 70} y={tri[0].y + 150} fill={C.amber} fontSize={30} fontFamily={F.mono}>√2</text>
              <text x={tri[1].x - 450 + 130} y={tri[1].y + 40} fill={C.amber} fontSize={30} fontFamily={F.mono}>√2</text>
            </g>
            {tri.map((p, i) => (<circle key={p.c} cx={p.x - 450} cy={p.y} r={20} fill={catColor[p.c]} opacity={prog(t, 5 + i * 0.8, 0.7)} style={{filter: `drop-shadow(0 0 14px ${catColor[p.c]})`}} />))}
            {tri.map((p, i) => (<text key={p.c} x={p.x - 450} y={p.y + (i === 0 ? -32 : 60)} fill={catColor[p.c]} fontSize={32} fontWeight={800} fontFamily={F.sans} textAnchor="middle" opacity={prog(t, 5 + i * 0.8, 0.7)}>{p.c}</text>))}
          </svg>
        </Card>
      </Reveal>
      <Callout at={13} accent={C.green} size={32} style={{...abs(600), width: 1740}}>With one-hot vectors, every pair of categories is the <Hl color={C.green}>same distance apart</Hl> (√2). No ranking is invented.</Callout>
      <Callout at={20} accent={C.amber} size={32} style={{...abs(725), width: 1740}}>One-hot encoding is <Hl color={C.amber}>not automatically better</Hl>. It depends on the data, the model, and how many categories there are.</Callout>
    </Scene>
  );
};

/* ───────── S6 — Number of features ───────── */
const S6: SceneFC = ({dur}) => {
  const t = useSec();
  const phase = [{k: 3, at: 1.5}, {k: 5, at: 7.5}, {k: 10, at: 13.5}];
  const hi = prog(t, 20, 1.5);
  return (
    <Scene dur={dur} heading="How many columns?">
      <Reveal at={0.5} style={{...abs(0), fontSize: 38, color: C.text, fontFamily: F.sans}}>A feature with <Hl>k categories</Hl> becomes <Hl>k binary columns</Hl> (full one-hot encoding).</Reveal>
      <div style={{...abs(110), opacity: 1 - prog(t, 19, 0.8)}}>
        <div style={{display: 'flex', gap: 14, height: 240}}>
          {Array.from({length: 10}, (_, i) => {
            const ph = i < 3 ? phase[0].at : i < 5 ? phase[1].at : phase[2].at;
            const k = prog(t, ph + (i < 3 ? i : i < 5 ? i - 3 : i - 5) * 0.4, 0.7);
            const col = [C.cyan, C.blue, C.violet, C.magenta, C.green, C.amber, C.red, C.cyan, C.blue, C.violet][i];
            return (
              <div key={i} style={{width: 150, opacity: k, transform: `scaleY(${lerp(0.2, 1, k)})`, transformOrigin: 'bottom'}}>
                <div style={{height: 180, borderRadius: 14, border: `3px solid ${col}`, background: `${col}22`, boxShadow: `0 0 24px ${col}55`}} />
                <div style={{textAlign: 'center', marginTop: 8, fontFamily: F.mono, fontSize: 28, color: col}}>c{i + 1}</div>
              </div>
            );
          })}
        </div>
        {phase.map((p, i) => (
          <Reveal key={p.k} at={p.at + 0.3} until={i < 2 ? phase[i + 1].at : 19} style={{...abs(330), fontSize: 64, fontWeight: 800, fontFamily: F.sans, color: C.text}}>
            {p.k} categories <span style={{color: C.cyan}}>→ {p.k} columns</span>
          </Reveal>
        ))}
      </div>
      <div style={{...abs(110), opacity: hi}}>
        <svg width={1740} height={260}>
          {Array.from({length: 200}, (_, i) => {
            const k = prog(t, 21 + (i / 200) * 4, 0.3);
            return <rect key={i} x={i * 8.6} y={40 + (1 - k) * 30} width={6} height={150} rx={2} fill={i % 7 === 0 ? C.cyan : C.line} opacity={0.35 + 0.65 * k * (i % 7 === 0 ? 1 : 0.5)} />;
          })}
        </svg>
        <div style={{fontSize: 52, fontWeight: 800, fontFamily: F.sans}}>Hundreds of unique product IDs <span style={{color: C.amber}}>→ hundreds of columns</span></div>
      </div>
      <Callout at={26} accent={C.amber} style={{...abs(560), width: 1740}}>Features with many unique values are called <Hl color={C.amber}>high-cardinality</Hl> features.</Callout>
      <Callout at={29} accent={C.red} style={{...abs(690), width: 1740}}>One-hot encoding them can create a <Hl color={C.red}>very large, sparse</Hl> feature matrix.</Callout>
    </Scene>
  );
};

/* ───────── S7 — Sparse representation ───────── */
const S7: SceneFC = ({dur}) => {
  const t = useSec();
  const cols = 40;
  const zoomRow = 12;
  const hotCol = Math.floor(rand(zoomRow * 13 + 3) * cols);
  const zoom = prog(t, 11, 1.2);
  return (
    <Scene dur={dur} heading="Sparse matrices">
      <div style={abs(0, 0)}><SparseMatrix rows={34} cols={cols} cell={14} start={1} rowSpeed={0.12} /></div>
      <div style={{...abs((zoomRow) * 17 - 4, -8), width: cols * 17 + 16, height: 22, border: `3px solid ${C.amber}`, borderRadius: 6, opacity: zoom}} />
      <Reveal at={11} style={{...abs(0, 760), width: 980}}>
        <Card accent={C.amber}>
          <div style={{fontSize: 34, fontFamily: F.sans, marginBottom: 16}}>Zoom into row {zoomRow + 1}:</div>
          <svg width={900} height={80}>
            {Array.from({length: cols}, (_, i) => (
              <g key={i}>
                <rect x={i * 22} y={10} width={19} height={60} rx={4} fill={i === hotCol ? C.cyan : C.line} opacity={i === hotCol ? 1 : 0.5} />
                <text x={i * 22 + 9.5} y={52} fontSize={24} textAnchor="middle" fontFamily={F.mono} fontWeight={800} fill={i === hotCol ? C.bg0 : C.dim}>{i === hotCol ? 1 : 0}</text>
              </g>
            ))}
          </svg>
          <div style={{fontSize: 30, color: C.dim, fontFamily: F.sans}}>{cols - 1} zeros and a single 1.</div>
        </Card>
      </Reveal>
      <Callout at={5} accent={C.cyan} size={32} style={{...abs(250, 760), width: 980}}>A <Hl>sparse matrix</Hl> is mostly zeros, with relatively few non-zero entries.</Callout>
      <Callout at={17} accent={C.green} size={32} style={{...abs(400, 760), width: 980}}>Sparse storage can keep <Hl color={C.green}>only the non-zero entries</Hl> and their positions, instead of every zero.</Callout>
      <Callout at={23} accent={C.amber} size={32} style={{...abs(550, 760), width: 980}}>Actual memory use depends on the <Hl color={C.amber}>representation and implementation</Hl>.</Callout>
    </Scene>
  );
};

/* ───────── S8 — Dummy variable trap ───────── */
const S8: SceneFC = ({dur}) => {
  const t = useSec();
  return (
    <Scene dur={dur} heading="The dummy variable trap">
      <Callout at={0.6} accent={C.cyan} size={32} style={{...abs(0), width: 1740}}>A binary feature with two categories: <Hl>Yes</Hl> and <Hl>No</Hl>. Full one-hot encoding uses 2 columns.</Callout>
      <div style={abs(120)}>
        <DatasetTable columns={['Answer', 'is_Yes', 'is_No']} rows={[['Yes', 1, 0], ['No', 0, 1]]} start={2} rowDelay={1.2} colWidth={[200, 190, 190]} fontSize={38} />
      </div>
      <Reveal at={8} style={{...abs(120, 780), width: 960}}><MathBlock tex={String.raw`\text{is\_Yes} + \text{is\_No} = 1 \quad \text{for every row}`} size={46} /></Reveal>
      <Callout at={11} accent={C.red} size={31} style={{...abs(260, 780), width: 960}}>One column can be predicted from the other. With an intercept (a column of 1s), some <Hl color={C.red}>linear models</Hl> then face <Hl color={C.red}>perfect multicollinearity</Hl>.</Callout>
      <Reveal at={19} style={abs(440)}>
        <div style={{display: 'flex', alignItems: 'center', gap: 40, fontFamily: F.sans}}>
          <div style={{fontSize: 34, color: C.amber, fontWeight: 800, width: 330}}>Drop a reference category:</div>
          <DatasetTable columns={['Answer', 'is_Yes']} rows={[['Yes', 1], ['No', 0]]} start={20} rowDelay={1} colWidth={[200, 190]} fontSize={38} />
          <div style={{fontSize: 32, color: C.text, width: 600, opacity: prog(t, 24, 0.7)}}>Yes → [1] <br />No → [0] (the reference)</div>
        </div>
      </Reveal>
      <Callout at={27} accent={C.green} size={30} style={{...abs(700), width: 1740}}>Dropping one category helps in some statistical and linear-model settings, but it is <Hl color={C.green}>not always necessary or preferable</Hl>. Many models (e.g. tree-based) do not need it.</Callout>
    </Scene>
  );
};

/* ───────── S9 — Unseen categories ───────── */
const CODE_IGNORE = ['from sklearn.preprocessing import OneHotEncoder', '', 'encoder = OneHotEncoder(', '    handle_unknown="ignore",', '    sparse_output=True', ')'];
const S9: SceneFC = ({dur}) => {
  const t = useSec();
  const fly = prog(t, 5, 1.8);
  return (
    <Scene dur={dur} heading="Unseen categories">
      <div style={{opacity: 1 - prog(t, 16, 0.7)}}>
        <Reveal at={0.6} style={{...abs(0), fontSize: 36, fontFamily: F.sans}}>Training data: {CATS.map((c) => <span key={c} style={{marginRight: 14}}><Chip label={c} size={28} /></span>)}</Reveal>
        <Reveal at={3} style={{...abs(80), fontSize: 36, fontFamily: F.sans}}>New data arrives: <Chip label="Yellow" size={28} /></Reveal>
        <div style={{...abs(220, 200), width: 700, height: 200, borderRadius: 24, border: `4px solid ${C.violet}`, background: `${C.violet}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 700, fontFamily: F.sans, opacity: prog(t, 3, 0.7)}}>
          Encoder knows: Blue, Green, Red
        </div>
        <div style={{...abs(lerp(280, 270, fly), lerp(1100, 700, fly)), opacity: prog(t, 4.5, 0.5)}}><Chip label="Yellow" size={34} /></div>
        <Reveal at={8} style={{...abs(450), width: 1740}}>
          <Card accent={C.red} style={{padding: 24}}>
            <div style={{fontSize: 36, fontWeight: 800, color: C.red}}>⚠ Unseen category</div>
            <div style={{fontFamily: F.mono, fontSize: 30, color: C.text, marginTop: 10}}>ValueError: Found unknown categories ['Yellow'] in column 0 during transform</div>
          </Card>
        </Reveal>
        <Callout at={11} accent={C.amber} size={32} style={{...abs(680), width: 1740}}>By default, the encoder raises an error for a category it did not see during <Hl color={C.amber}>fit</Hl>.</Callout>
      </div>
      <div style={{opacity: prog(t, 16.5, 0.7) * (1 - prog(t, 27, 0.7))}}>
        <div style={{...abs(30), display: 'flex', alignItems: 'center', gap: 30}}>
          {[{l: 'Training data', c: C.cyan}, {l: 'fit()', c: C.violet}, {l: 'Fitted encoder', c: C.blue}, {l: 'transform()', c: C.violet}, {l: 'Validation / Test', c: C.green}].map((s, i) => (
            <Reveal key={s.l} at={17 + i * 1.2}>
              <div style={{padding: '24px 22px', width: 290, textAlign: 'center', borderRadius: 18, border: `3px solid ${s.c}`, background: `${s.c}22`, fontSize: 32, fontWeight: 700, fontFamily: F.sans}}>{s.l}</div>
            </Reveal>
          ))}
        </div>
        <Callout at={23} accent={C.cyan} style={{...abs(250), width: 1740}}>Fit the encoder on the <Hl>training data only</Hl>. Then apply the <Hl>same fitted encoder</Hl> to validation and test data.</Callout>
      </div>
      <div style={{opacity: prog(t, 27.5, 0.7)}}>
        <div style={abs(0)}><CodePanel lines={CODE_IGNORE} start={28} lineDelay={1} fontSize={28} width={940} /></div>
        <div style={abs(40, 1000)}><OutputPanel width={740} fontSize={28} lines={[{text: 'Yellow → [0. 0. 0.]', at: 35, color: C.green}]} /></div>
        <Callout at={32} accent={C.green} size={30} style={{...abs(400, 1000), width: 740}}><Mono color={C.green} size={30}>handle_unknown="ignore"</Mono> lets unseen categories pass without the usual error. Yellow becomes all zeros.</Callout>
        <Callout at={36} accent={C.amber} size={30} style={{...abs(600), width: 1740}}>The exact output depends on the fitted categories and the configuration.</Callout>
      </div>
    </Scene>
  );
};

/* ───────── S10 — Practical Python ───────── */
const CODE_FULL = [
  'from sklearn.preprocessing import OneHotEncoder',
  '',
  'X = [["Red"], ["Blue"], ["Green"], ["Red"]]',
  '',
  'encoder = OneHotEncoder(sparse_output=False)',
  'encoded = encoder.fit_transform(X)',
  '',
  'print(encoder.categories_)',
  'print(encoder.get_feature_names_out(["color"]))',
  'print(encoded)',
];
const S10: SceneFC = ({dur}) => {
  const delay = 1.5, start = 1.5;
  const at = (i: number) => start + i * delay;
  return (
    <Scene dur={dur} heading="Python: OneHotEncoder">
      <div style={abs(0)}><CodePanel lines={CODE_FULL} start={start} lineDelay={delay} fontSize={26} width={1000} /></div>
      <div style={abs(0, 1050)}>
        <OutputPanel width={690} fontSize={26} lines={[
          {text: "[array(['Blue', 'Green', 'Red'],", at: at(7) + 0.4, color: C.green},
          {text: "       dtype=object)]", at: at(7) + 0.4, color: C.green},
          {text: "['color_Blue' 'color_Green' 'color_Red']", at: at(8) + 0.4, color: C.cyan},
          {text: '[[0. 0. 1.]', at: at(9) + 0.4}, {text: ' [1. 0. 0.]', at: at(9) + 0.7}, {text: ' [0. 1. 0.]', at: at(9) + 1.0}, {text: ' [0. 0. 1.]]', at: at(9) + 1.3},
        ]} />
      </div>
      <Callout at={20} accent={C.cyan} size={30} style={{...abs(600), width: 1000}}>Learned categories are <Hl>sorted alphabetically</Hl>: Blue, Green, Red.</Callout>
      <Callout at={26} accent={C.violet} size={30} style={{...abs(600, 1050), width: 690}}>Feature names combine the input name and category: <Hl color={C.violet}>color_Red</Hl>.</Callout>
      <Callout at={32} accent={C.green} size={30} style={{...abs(745), width: 1000}}>Row 1 (Red) → <Mono color={C.green} size={30}>[0, 0, 1]</Mono>: the 1 sits in the <Hl color={C.green}>color_Red</Hl> column.</Callout>
      <Callout at={37} accent={C.amber} size={30} style={{...abs(745, 1050), width: 690}}>By default the output is a <Hl color={C.amber}>sparse matrix</Hl>. We used <Mono color={C.amber} size={28}>sparse_output=False</Mono> only to print it.</Callout>
    </Scene>
  );
};

/* ───────── S11 / S12 ───────── */
const S11: SceneFC = ({dur}) => (
  <Scene dur={dur} heading="Advantages and limitations">
    <AdvLimCards
      adv={['Avoids artificial ordinal relationships for nominal features', 'Clear, easy-to-read representation', 'Works well for many categorical features and models']}
      lim={['Can increase feature dimensionality', 'High-cardinality features may create huge matrices', 'Unseen categories need deliberate handling', 'Suitability depends on the dataset and model']}
      bulletGap={2.2} fontSize={33} />
  </Scene>
);

const S12: SceneFC = ({dur}) => {
  const t = useSec();
  return (
    <Scene dur={dur} heading="Summary">
      <div style={abs(0, 75)}>
        <Pipeline start={0.8} step={1.0} boxWidth={330} stages={[
          {label: 'Category', color: C.magenta}, {label: 'Dedicated Binary Columns', color: C.blue}, {label: 'Encoded Matrix', color: C.cyan}, {label: 'Model Input', color: C.green}]} />
      </div>
      <Reveal at={9} scale={0.9} style={{...abs(330), width: 1740, textAlign: 'center'}}>
        <div style={{fontSize: 84, fontWeight: 800, fontFamily: F.sans, color: C.text, textShadow: `0 0 ${30 + 10 * Math.sin(t * 3)}px ${C.cyan}`}}>
          One category = one <span style={{color: C.cyan}}>dedicated column</span>.
        </div>
      </Reveal>
      <Callout at={14} accent={C.amber} size={32} style={{...abs(580), width: 1740}}>Remember: watch the column count for high-cardinality features, and always plan for unseen categories.</Callout>
    </Scene>
  );
};

export const oneHotScenes: SceneDef[] = [
  {name: 'intro', dur: 16, Comp: S1},
  {name: 'basic-idea', dur: 24, Comp: S2},
  {name: 'transformation', dur: 36, Comp: S3},
  {name: 'vectors', dur: 28, Comp: S4},
  {name: 'why-useful', dur: 28, Comp: S5},
  {name: 'num-features', dur: 34, Comp: S6},
  {name: 'sparse', dur: 28, Comp: S7},
  {name: 'dummy-trap', dur: 36, Comp: S8},
  {name: 'unseen', dur: 40, Comp: S9},
  {name: 'python', dur: 44, Comp: S10},
  {name: 'adv-lim', dur: 26, Comp: S11},
  {name: 'summary', dur: 20, Comp: S12},
];
export const oneHotFrames = totalFrames(oneHotScenes);
export const OneHotEncodingVideo: React.FC = () => <VideoShell scenes={oneHotScenes} label="Feature Encoding · One-Hot Encoding" />;
