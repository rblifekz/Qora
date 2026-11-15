import React from 'react';
import {Audio, Sequence, staticFile, interpolate, useVideoConfig} from 'remotion';
import {FPS} from './lib';
import {warp} from './lang';

// [файл, секунда ролика, громкость] — эффекты заметно тише голоса
const CUES: [string, number, number][] = [
  ['ding', 0.0, 0.55],
  ['key', 2.94, 0.3],
  ['key', 3.26, 0.3],
  ['key', 3.5, 0.3],
  ['impact', 4.22, 0.6],
  ['pop', 6.86, 0.35],
  ['pop', 7.0, 0.35],
  ['pop', 7.13, 0.35],
  ['whoosh', 8.0, 0.3],
  ['pop', 9.98, 0.3],
  ['impact', 12.06, 0.4],
  ['pop', 13.34, 0.25],
  ['blip', 14.33, 0.3],
  ['blip', 14.58, 0.3],
  ['blip', 14.85, 0.3],
  ['whoosh', 15.45, 0.3],
  ['shimmer', 17.3, 0.3],
  ['flick', 18.82, 0.45],
  ['flick', 19.18, 0.45],
  ['flick', 19.9, 0.45],
  ['flick', 20.7, 0.45],
  ['flick', 21.26, 0.45],
  ['whoosh', 21.8, 0.25],
  ['tap', 22.75, 0.6],
  ['shimmer', 22.78, 0.4],
  ['chime', 23.25, 0.35],
  ['whoosh', 25.15, 0.3],
  ['blip', 27.1, 0.4],
  ['blip', 28.06, 0.4],
  ['blip', 29.05, 0.4],
  ['blip', 29.78, 0.4],
  ['blip', 30.38, 0.4],
  // ливень списаний
  ...new Array(30).fill(0).map((_, i) => ['blip', 33.17 + (i * 1.3) / FPS, 0.12 + (i % 3) * 0.04] as [string, number, number]),
  ['impact', 35.0, 0.5],
  ...new Array(7).fill(0).map((_, i) => ['key', 36.62 + (i * 2) / FPS, 0.25] as [string, number, number]),
  ['flick', 37.6, 0.35],
  ['flick', 37.75, 0.3],
  ['chime', 38.54, 0.25],
  ['whoosh', 39.3, 0.35],
  ['pop', 40.62, 0.3],
  ['impact', 41.06, 0.3],
  ['pop', 42.6, 0.3],
  ...new Array(7).fill(0).map((_, i) => ['key', 42.95 + (i * 4) / FPS, 0.22] as [string, number, number]),
  ['whoosh', 44.35, 0.3],
];

export const Sfx: React.FC = () => {
  const {durationInFrames: d} = useVideoConfig();
  return (
  <>
    <Audio src={staticFile('sfx/drone.wav')} volume={(f) => interpolate(f, [0, 45, d - 60, d], [0, 0.22, 0.22, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
    {CUES.map(([f, t, v], i) => (
      <Sequence key={i} from={Math.round(warp(t) * FPS)}>
        <Audio src={staticFile(`sfx/${f}.wav`)} volume={v} />
      </Sequence>
    ))}
  </>
  );
};
