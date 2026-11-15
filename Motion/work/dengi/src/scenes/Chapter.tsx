import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, Big, clamp, ease, fontFamily, usePop} from '../lib';
import {Card} from './S2';

/** Заголовок главы. fly=true — карточка с номером влетает и раскрывается на весь экран */
export const ChapterHead: React.FC<{n: number; title: string; titleAt: number; fly?: boolean}> = ({
  n,
  title,
  titleAt,
  fly,
}) => {
  const frame = useCurrentFrame();
  const z = fly ? interpolate(frame, [4, 14], [0, 1], {...clamp, easing: ease}) : 1;
  const s = usePop(0);
  const titleS = usePop(titleAt);
  // номер «садится» в бейдж слева сверху
  const numY = interpolate(z, [0, 1], [760, 300]);
  const numSize = interpolate(z, [0, 1], [190, 120]);
  return (
    <>
      {fly && z < 1 && (
        <div
          style={{
            position: 'absolute',
            left: 540 - 145,
            top: 960 - 200,
            transform: `scale(${interpolate(z, [0, 1], [0.6 + 0.4 * s, 4.2])})`,
            opacity: interpolate(z, [0.8, 1], [1, 0], clamp),
          }}
        >
          <Card n={n} />
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          top: numY,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily,
          fontWeight: 800,
          fontSize: numSize,
          lineHeight: 1,
          color: C.green,
          opacity: z,
        }}
      >
        {n}
      </div>
      {frame >= titleAt && (
        <div
          style={{
            position: 'absolute',
            top: 430,
            left: 0,
            right: 0,
            transform: `scale(${0.6 + 0.4 * titleS})`,
            opacity: titleS,
          }}
        >
          <Big size={title.length > 8 ? 120 : 160}>{title}</Big>
        </div>
      )}
    </>
  );
};

export const ChapterBg: React.FC<{children: React.ReactNode; fly?: boolean}> = ({children, fly}) => {
  const frame = useCurrentFrame();
  const z = fly ? interpolate(frame, [4, 14], [0, 1], {...clamp, easing: ease}) : 1;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 20%, #24242C, ${C.card} 45%, #121216 100%)`,
          opacity: z,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};
