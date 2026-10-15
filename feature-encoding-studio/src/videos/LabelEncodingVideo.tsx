import React from 'react';
import {Scene, SceneDef, SceneFC, VideoShell, totalFrames} from '../components/SceneTransition';
import {ParticleField} from '../components/AnimatedBackground';
import {DatasetTable} from '../components/DatasetTable';
import {CodePanel, OutputPanel} from '../components/CodePanel';
import {NumberLine} from '../components/GraphAnimation';
import {Pipeline} from '../components/Pipeline';
import {MathBlock} from '../components/MathBlock';
import {Callout, Card, Chip, Hl, Mono, Reveal} from '../components/ui';
import {C, F, catColor} from '../theme';
import {lerp, prog, useSec} from '../anim';
import {COLORS, ILLUSTRATIVE_CODES, SKLEARN_LABEL_CLASSES, SKLEARN_LABEL_CODES, STUDENTS} from '../data/examples';

const abs = (top: number, left = 0): React.CSSProperties => ({position: 'absolute', top, left});

/* ───────── Scene 1 — Cinematic introduction ───────── */
const S1: SceneFC = ({dur}) => {
  const t = useSec();
  const chipNames = ['Red', 'Blue', 'Green', 'Red', 'Blue'];
  const reveal = prog(t, 9, 1.4);
  return (
    <Scene dur={dur} noPad>
      <ParticleField converge={prog(t, 2, 5.5)} clusterY={600} />
      {chipNames.map((n, i) => (
        <Reveal key={i} at={7.2 + i * 0.35} style={{position: 'absolute', left: 280 + i * 340 - 90, top: 430, width: 180, textAlign: 'center'}}>
          <Chip label={n} size={36} />
        </Reveal>
      ))}
      <div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', fontFamily: F.sans,
        opacity: reveal, filter: `blur(${(1 - reveal) * 14}px)`, transform: `scale(${lerp(1.12, 1, reveal)})`}}>
        <div style={{fontSize: 40, color: C.cyan, fontWeight: 600, letterSpacing: 8 * (1 - reveal) + 2}}>FEATURE ENCODING</div>
        <div style={{fontSize: 108, fontWeight: 800, color: C.text, letterSpacing: -2, lineHeight: 1.1}}>LABEL ENCODING</div>
      </div>
      <Reveal at={13} style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center', fontSize: 52, color: C.text, fontFamily: F.sans}}>
        How do machines understand <Hl>categorical data</Hl>?
      </Reveal>
    </Scene>
  );
};

/* ───────── Scene 2 — The problem ───────── */
const S2: SceneFC = ({dur}) => {
  const t = useSec();
  const k1 = prog(t, 7, 2.5);
  const k2 = prog(t, 12.8, 1.4);
  const shake = t > 10.4 && t < 12.6 ? Math.sin(t * 60) * 10 * (1 - prog(t, 10.4, 2.2)) : 0;
  const x = 1060 * (k1 - k2) + shake;
  const reject = prog(t, 10.4, 0.5) * (1 - prog(t, 13, 0.6));
  return (
    <Scene dur={dur} heading="The problem: models need numbers">
      <Reveal at={4} style={{...abs(0, 1000), width: 700, height: 440, borderRadius: 24, border: `3px solid ${C.blue}`, background: `${C.blue}18`,
        boxShadow: `0 0 50px ${C.blue}33`, fontFamily: F.sans, padding: 26}}>
        <div style={{fontSize: 34, fontWeight: 700, color: C.text}}>Numerical processing stage</div>
        <div style={{fontSize: 28, color: C.dim, marginTop: 8}}>expects numbers: 1.5, 42, 0.7 …</div>
      </Reveal>
      <div style={{...abs(70), transform: `translateX(${x}px)`}}>
        <DatasetTable columns={['Student', 'Favorite Color']} rows={STUDENTS} start={0.6} rowDelay={0.8} colWidth={[250, 290]} fontSize={32} />
      </div>
      <div style={{...abs(180, 1060), width: 560, opacity: reject, textAlign: 'center', fontFamily: F.sans, fontSize: 46, fontWeight: 800, color: C.red,
        border: `4px solid ${C.red}`, borderRadius: 16, padding: '12px 0', background: 'rgba(5,7,15,0.88)', transform: 'rotate(-4deg)'}}>
        ✕ Text rejected
      </div>
      <Callout at={14} accent={C.cyan} style={{...abs(500), width: 1740}}>Many machine learning algorithms require <Hl>numerical</Hl> feature representations.</Callout>
      <Callout at={21} accent={C.amber} style={{...abs(625), width: 1740}}>Not always: some algorithms and libraries <Hl color={C.amber}>can</Hl> handle categorical data directly, so encoding is not universally required.</Callout>
      <Callout at={28} accent={C.green} style={{...abs(750), width: 1740}}><Hl color={C.green}>Feature encoding</Hl> = turning categorical variables into a representation a model can use.</Callout>
    </Scene>
  );
};

/* ───────── Scene 3 — Nominal vs ordinal ───────── */
const S3: SceneFC = ({dur}) => {
  const t = useSec();
  const names = ['Red', 'Blue', 'Green'];
  const shuffle = prog(t, 13, 1.6);
  const order = [0, 1, 2].map((i) => lerp(i, (i + 1) % 3, shuffle));
  const bars = [{l: 'Low', h: 110, c: C.cyan}, {l: 'Medium', h: 200, c: C.blue}, {l: 'High', h: 290, c: C.violet}];
  return (
    <Scene dur={dur} heading="Two kinds of categories">
      <Reveal at={1} style={abs(0, 0)}>
        <Card accent={C.magenta} style={{width: 840, height: 560}}>
          <div style={{fontSize: 42, fontWeight: 800}}>Nominal</div>
          <div style={{fontSize: 30, color: C.dim, marginBottom: 20}}>no inherent order</div>
          <div style={{position: 'relative', height: 330}}>
            {names.map((n, i) => (
              <div key={n} style={{position: 'absolute', left: 40 + order[i] * 245, top: 90 + Math.sin(t * 1.6 + i * 2) * 14}}>
                <Chip label={n} size={38} />
              </div>
            ))}
          </div>
          <div style={{fontSize: 30, color: C.text, opacity: prog(t, 15, 0.8)}}>Shuffle them: nothing changes. <Hl color={C.magenta}>No ranking.</Hl></div>
        </Card>
      </Reveal>
      <Reveal at={4} style={abs(0, 900)}>
        <Card accent={C.cyan} style={{width: 840, height: 560}}>
          <div style={{fontSize: 42, fontWeight: 800}}>Ordinal</div>
          <div style={{fontSize: 30, color: C.dim, marginBottom: 20}}>a meaningful order exists</div>
          <svg width={780} height={340}>
            {bars.map((b, i) => {
              const k = prog(t, 6 + i * 1.2, 0.9);
              return (
                <g key={b.l}>
                  <rect x={40 + i * 250} y={300 - b.h * k} width={200} height={b.h * k} rx={12} fill={`${b.c}55`} stroke={b.c} strokeWidth={3} />
                  <text x={140 + i * 250} y={335} fill={C.text} fontSize={34} fontWeight={700} fontFamily={F.sans} textAnchor="middle">{b.l}</text>
                </g>
              );
            })}
            <text x={390} y={60} fill={C.cyan} fontSize={34} fontWeight={800} fontFamily={F.sans} textAnchor="middle" opacity={prog(t, 10, 0.8)}>Low  &lt;  Medium  &lt;  High</text>
          </svg>
        </Card>
      </Reveal>
      <Callout at={19} accent={C.magenta} style={{...abs(620), width: 1740}}>Colors have <Hl color={C.magenta}>no natural ranking</Hl>: Red is not "less than" Blue.</Callout>
      <Callout at={24} accent={C.cyan} style={{...abs(745), width: 1740}}>Low, Medium, High <Hl>do</Hl> have an order, which a model could use.</Callout>
    </Scene>
  );
};

/* ───────── Scene 4 — What is label encoding? ───────── */
const S4: SceneFC = ({dur}) => {
  const t = useSec();
  const names = ['Red', 'Blue', 'Green'];
  const rows = COLORS.map((c) => [c, ILLUSTRATIVE_CODES[c]]);
  return (
    <Scene dur={dur} heading="What is label encoding?">
      <Callout at={0.8} accent={C.cyan} size={42} style={{...abs(0), width: 1740}}>Label encoding assigns a <Hl>numerical code</Hl> to each category.</Callout>
      {names.map((n, i) => {
        const k = prog(t, 5 + i * 1.6, 1.0);
        return (
          <div key={n} style={{...abs(170 + i * 125), display: 'flex', alignItems: 'center', gap: 28}}>
            <Reveal at={4 + i * 1.6}><div style={{width: 190}}><Chip label={n} size={36} /></div></Reveal>
            <svg width={120} height={40} style={{opacity: k}}><line x1={0} y1={20} x2={90} y2={20} stroke={C.cyan} strokeWidth={5} /><polygon points="88,8 110,20 88,32" fill={C.cyan} /></svg>
            <div style={{fontSize: 80, fontWeight: 800, fontFamily: F.mono, color: catColor[n], opacity: k, transform: `scale(${lerp(0.4, 1, k)})`}}>{ILLUSTRATIVE_CODES[n]}</div>
          </div>
        );
      })}
      <div style={abs(170, 800)}>
        <DatasetTable columns={['Color', 'Encoded Value']} rows={rows} start={13} rowDelay={2.4} colWidth={[300, 360]} fontSize={38}
          render={(r, c, tt) => {
            if (c === 0) return rows[r][0];
            const k = prog(tt, 14.2 + r * 2.4, 0.9);
            return <span style={{opacity: k, display: 'inline-block', transform: `scale(${lerp(0.3, 1, k)})`, fontFamily: F.mono, fontWeight: 800, color: C.cyan}}>{k < 0.05 ? '?' : rows[r][1]}</span>;
          }}
          cellStyle={(r, c, tt) => (c === 1 && tt > 14.2 + r * 2.4 && tt < 16.2 + r * 2.4 ? {background: 'rgba(47,227,255,0.18)'} : {})} />
      </div>
      <Callout at={26} accent={C.amber} size={32} style={{...abs(600), width: 1740}}>
        The same input value always gets the same code. Red → <Mono color={C.amber} size={32}>0</Mono> in <Hl color={C.amber}>both</Hl> rows where it appears.
      </Callout>
      <Callout at={31} accent={C.violet} size={32} style={{...abs(720), width: 1740}}>
        This 0, 1, 2 assignment is <Hl color={C.violet}>illustrative</Hl>. We will see which codes scikit-learn actually assigns later.
      </Callout>
    </Scene>
  );
};

/* ───────── Scene 5 — Mathematical representation ───────── */
const S5: SceneFC = ({dur}) => {
  const lines = [
    String.raw`C = \{\,\text{Red},\ \text{Blue},\ \text{Green}\,\}`,
    String.raw`f : C \longrightarrow \{0,\,1,\,2\}`,
    String.raw`f(\text{Red}) = 0,\quad f(\text{Blue}) = 1,\quad f(\text{Green}) = 2`,
    String.raw`x = [\text{Red},\,\text{Blue},\,\text{Green},\,\text{Red}] \;\Longrightarrow\; f(x) = [0,\,1,\,2,\,0]`,
  ];
  return (
    <Scene dur={dur} heading="The idea as a mapping">
      <div style={{...abs(0, 120)}}>
        {lines.map((l, i) => (
          <Reveal key={i} at={1 + i * 3.2} style={{marginBottom: 18}}><MathBlock tex={l} size={58} /></Reveal>
        ))}
      </div>
      <Callout at={15} accent={C.cyan} style={{...abs(520), width: 1740}}>A categorical feature <Hl>x</Hl> becomes a numerical feature <Hl>f(x)</Hl>: one function, applied to every row.</Callout>
      <Callout at={20} accent={C.amber} style={{...abs(650), width: 1740}}>The numbers are <Hl color={C.amber}>codes</Hl>, not measurements. Code 2 does not mean "twice as much" as code 1.</Callout>
    </Scene>
  );
};

/* ───────── Scene 6 — The nominal-encoding problem ───────── */
const S6: SceneFC = ({dur}) => {
  const t = useSec();
  return (
    <Scene dur={dur} heading="The nominal-encoding problem">
      <div style={{...abs(0, 0), display: 'flex', gap: 40}}>
        {['Red', 'Blue', 'Green'].map((n, i) => (
          <Reveal key={n} at={0.8 + i * 0.6}><span style={{fontSize: 52, fontFamily: F.mono, fontWeight: 800, color: catColor[n]}}>{n} = {ILLUSTRATIVE_CODES[n]}</span></Reveal>
        ))}
      </div>
      <div style={abs(80, 170)}>
        <NumberLine points={[{value: 0, label: 'Red', color: catColor.Red}, {value: 1, label: 'Blue', color: catColor.Blue}, {value: 2, label: 'Green', color: catColor.Green}]}
          min={0} max={2} start={4} width={1400} gapsAt={11} gapLabel={(a, b) => `distance ${Math.abs(b - a)}`} />
      </div>
      <Callout at={17} accent={C.red} size={31} style={{...abs(470), width: 1740}}>
        On this line a model can "see" Red &lt; Blue &lt; Green and equal gaps. <Hl color={C.red}>No such order or distance exists</Hl> among colors.
      </Callout>
      <Callout at={23} accent={C.amber} size={31} style={{...abs(580), width: 1740}}>
        Misleading arithmetic: the average of Red (0) and Green (2) is 1, which is the code for <Hl color={C.amber}>Blue</Hl>.
      </Callout>
      <Callout at={29} accent={C.cyan} size={31} style={{...abs(690), width: 1740}}>
        For nominal categories, arbitrary integer codes <Hl>may</Hl> introduce misleading ordinal relationships for some models.
      </Callout>
      <Callout at={35} accent={C.green} size={29} style={{...abs(800), width: 1740}}>
        It depends on the model and how the feature is used. Linear and distance-based models read codes as magnitudes; label encoding does not <Hl color={C.green}>always</Hl> cause errors.
      </Callout>
      <div style={{...abs(10, 1480), opacity: prog(t, 17, 0.6), fontSize: 120, color: C.red}}>≠</div>
    </Scene>
  );
};

/* ───────── Scene 7 — Correct use cases ───────── */
const S7: SceneFC = ({dur}) => {
  const cards = [
    {title: 'Ordered categories', accent: C.cyan, body: ['Low → 0', 'Medium → 1', 'High → 2'], note: 'when the order is explicitly defined'},
    {title: 'Target labels (y)', accent: C.green, body: ['Not Spam → 0', 'Spam → 1'], note: 'class IDs, not a ranking'},
    {title: 'Native categorical support', accent: C.violet, body: ['Model reads', 'categories directly'], note: 'some algorithms handle them internally'},
  ];
  return (
    <Scene dur={dur} heading="Where integer codes are useful">
      <div style={{...abs(0), display: 'flex', gap: 36}}>
        {cards.map((c, i) => (
          <Reveal key={c.title} at={1 + i * 4}>
            <Card accent={c.accent} style={{width: 556, height: 470}}>
              <div style={{fontSize: 38, fontWeight: 800, color: c.accent, marginBottom: 20}}>{c.title}</div>
              {c.body.map((b) => (<div key={b} style={{fontSize: 44, fontFamily: F.mono, fontWeight: 700, margin: '10px 0'}}>{b}</div>))}
              <div style={{fontSize: 28, color: C.dim, marginTop: 24}}>{c.note}</div>
            </Card>
          </Reveal>
        ))}
      </div>
      <Callout at={15} accent={C.green} size={32} style={{...abs(520), width: 1740}}>
        <Hl color={C.green}>Target-label encoding</Hl> (y) and <Hl color={C.green}>input-feature encoding</Hl> (X) are different tasks.
      </Callout>
      <Callout at={22} accent={C.cyan} size={32} style={{...abs(650), width: 1740}}>
        Spam and Not Spam can be stored as class IDs without implying that one class is "greater" than the other.
      </Callout>
    </Scene>
  );
};

/* ───────── Scene 8 — Practical Python ───────── */
const CODE = [
  'from sklearn.preprocessing import LabelEncoder',
  '',
  'encoder = LabelEncoder()',
  '',
  'colors = ["Red", "Blue", "Green", "Red"]',
  '',
  'encoded_colors = encoder.fit_transform(colors)',
  'print(encoded_colors)',
  'print(encoder.classes_)',
];
const S8: SceneFC = ({dur}) => {
  const t = useSec();
  const start = 2;
  const delay = 1.5;
  const lineAt = (i: number) => start + i * delay;
  const active = [8, 6, 4, 2, 0].find((i) => t >= lineAt(i)) ?? -1;
  const encoded = [2, 0, 1, 2];
  return (
    <Scene dur={dur} heading="Python: LabelEncoder">
      <div style={abs(0)}><CodePanel lines={CODE} start={start} lineDelay={delay} active={t < lineAt(8) + 2 ? active : -1} fontSize={28} width={1010} /></div>
      <div style={abs(0, 1060)}>
        <OutputPanel width={680} fontSize={30} lines={[
          {text: '[2 0 1 2]', at: lineAt(7) + 0.3, color: C.cyan},
          {text: "['Blue' 'Green' 'Red']", at: lineAt(8) + 0.3, color: C.green},
        ]} />
      </div>
      <div style={abs(215, 1060)}>
        <div style={{display: 'flex', gap: 14}}>
          {COLORS.map((c, i) => (<Reveal key={i} at={lineAt(6) + 0.2 + i * 0.3} style={{width: 150, textAlign: 'center'}}><Chip label={c} size={26} /></Reveal>))}
        </div>
        <div style={{display: 'flex', gap: 14, marginTop: 14}}>
          {encoded.map((e, i) => (<Reveal key={i} at={lineAt(7) + 0.6 + i * 0.3} style={{width: 150, textAlign: 'center', fontFamily: F.mono, fontSize: 56, fontWeight: 800, color: C.cyan}}>{e}</Reveal>))}
        </div>
      </div>
      <Reveal at={lineAt(8) + 2} style={abs(410, 1060)}>
        <div style={{fontSize: 28, color: C.dim, fontFamily: F.sans, marginBottom: 10}}>classes_ are sorted alphabetically, so:</div>
        <div style={{display: 'flex', gap: 22, fontFamily: F.mono, fontSize: 34, fontWeight: 700}}>
          {SKLEARN_LABEL_CLASSES.map((c) => (<span key={c} style={{color: catColor[c]}}>{c}={SKLEARN_LABEL_CODES[c]}</span>))}
        </div>
      </Reveal>
      <Callout at={22} accent={C.amber} size={30} style={{...abs(590, 0), width: 1010}}>
        Red is <Hl color={C.amber}>2</Hl> here, not 0: scikit-learn sorts the classes alphabetically. Our earlier 0, 1, 2 was only illustrative.
      </Callout>
      <Callout at={29} accent={C.red} size={30} style={{...abs(590, 1060), width: 680}}>
        <Hl color={C.red}>LabelEncoder is meant for target labels y</Hl>, not input features X.
      </Callout>
      <Callout at={36} accent={C.green} size={30} style={{...abs(745, 0), width: 1740}}>
        For nominal input features, <Hl color={C.green}>OneHotEncoder</Hl> (or another categorical-feature encoder) is often more suitable.
      </Callout>
    </Scene>
  );
};

/* ───────── Scene 9 — Advantages & limitations ───────── */
const S9: SceneFC = ({dur}) => {
  const adv = ['Simple representation', 'Compact: a single column', 'Useful for class labels', 'Easy to understand and implement'];
  const lim = ['May imply an artificial order for nominal inputs', 'Codes do not automatically mean real distances', 'Suitability depends on the model and the feature'];
  return (
    <Scene dur={dur} heading="Advantages and limitations">
      <div style={{...abs(0), display: 'flex', gap: 50}}>
        <Reveal at={1}>
          <Card accent={C.green} style={{width: 845, height: 640}}>
            <div style={{fontSize: 44, fontWeight: 800, color: C.green, marginBottom: 24}}>✓ Advantages</div>
            {adv.map((a, i) => (<Reveal key={a} at={3 + i * 2.2}><div style={{fontSize: 36, margin: '22px 0', lineHeight: 1.3}}>• {a}</div></Reveal>))}
          </Card>
        </Reveal>
        <Reveal at={2}>
          <Card accent={C.amber} style={{width: 845, height: 640}}>
            <div style={{fontSize: 44, fontWeight: 800, color: C.amber, marginBottom: 24}}>! Limitations</div>
            {lim.map((a, i) => (<Reveal key={a} at={5 + i * 2.8}><div style={{fontSize: 36, margin: '22px 0', lineHeight: 1.3}}>• {a}</div></Reveal>))}
          </Card>
        </Reveal>
      </div>
    </Scene>
  );
};

/* ───────── Scene 10 — Summary ───────── */
const S10: SceneFC = ({dur}) => {
  const takeaways = [
    'Label encoding maps each category to one integer code.',
    'Codes are labels, not measurements, so nominal inputs can look ordered.',
    'Best suited to target labels (y). For nominal inputs, consider One-Hot Encoding.',
  ];
  return (
    <Scene dur={dur} heading="Summary">
      <div style={abs(0, 75)}>
        <Pipeline start={0.8} step={1.0} boxWidth={330} stages={[
          {label: 'Categorical Data', color: C.magenta}, {label: 'Mapping', color: C.blue}, {label: 'Integer Codes', color: C.cyan}, {label: 'Model Input', color: C.green}]} />
      </div>
      {takeaways.map((tk, i) => (
        <Callout key={i} at={8 + i * 3.5} accent={[C.cyan, C.amber, C.green][i]} size={34} style={{...abs(300 + i * 130), width: 1740}}>
          <Hl color={[C.cyan, C.amber, C.green][i]}>{i + 1}.</Hl> {tk}
        </Callout>
      ))}
    </Scene>
  );
};

export const labelScenes: SceneDef[] = [
  {name: 'intro', dur: 18, Comp: S1},
  {name: 'problem', dur: 36, Comp: S2},
  {name: 'types', dur: 30, Comp: S3},
  {name: 'what-is', dur: 36, Comp: S4},
  {name: 'math', dur: 28, Comp: S5},
  {name: 'nominal-problem', dur: 42, Comp: S6},
  {name: 'use-cases', dur: 32, Comp: S7},
  {name: 'python', dur: 46, Comp: S8},
  {name: 'adv-lim', dur: 28, Comp: S9},
  {name: 'summary', dur: 24, Comp: S10},
];
export const labelFrames = totalFrames(labelScenes);
export const LabelEncodingVideo: React.FC = () => <VideoShell scenes={labelScenes} label="Feature Encoding · Label Encoding" />;
