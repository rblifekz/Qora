import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import dataRu from '../words.json';
import dataKk from '../words_kk.json';
import {LANG, Lang} from './lang';
import {C, FPS, VOICE_OFFSET, fontFamily, clamp} from './lib';

type W = {text: string; start: number; end: number};

const build = (data: {words: W[]}) => {
const words: W[] = data.words
  .filter((w) => !w.text.startsWith('[') && !w.text.endsWith(']') && w.text !== '—')
  .map((w) => ({...w, start: w.start + VOICE_OFFSET, end: w.end + VOICE_OFFSET}));

// группы по 2–3 слова, разрыв на знаках препинания
const chunks: W[][] = [];
let cur: W[] = [];
for (const w of words) {
  cur.push(w);
  if (/[.?!:…,]$/.test(w.text) || cur.length >= 3) {
    chunks.push(cur);
    cur = [];
  }
}
if (cur.length) chunks.push(cur);
return chunks;
};
const CHUNKS: Record<Lang, W[][]> = {ru: build(dataRu as any), kk: build(dataKk as any)};

const clean = (t: string) => t.replace(/[.,:!?…]+$/g, '').replace(/…/g, '');

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const chunks = CHUNKS[LANG.current];
  const idx = chunks.findIndex((c, i) => {
    const next = chunks[i + 1];
    const endT = next ? Math.min(next[0].start, c[c.length - 1].end + 0.5) : c[c.length - 1].end + 0.5;
    return t >= c[0].start - 0.05 && t < endT;
  });
  if (idx < 0) return null;
  const c = chunks[idx];
  const local = frame - Math.round((c[0].start - 0.05) * FPS);
  const s = interpolate(local, [0, 4], [0.85, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        right: 150,
        top: 1395,
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '0 18px',
        fontFamily,
        fontWeight: 800,
        fontSize: 64,
        transform: `scale(${s})`,
        textShadow: '0 4px 0 rgba(0,0,0,0.8), 0 0 24px rgba(0,0,0,0.9)',
      }}
    >
      {c.map((w, i) => {
        const on = t >= w.start - 0.03;
        return (
          <span key={i} style={{color: on ? C.white : 'rgba(244,244,240,0.38)'}}>
            {clean(w.text)}
          </span>
        );
      })}
    </div>
  );
};
