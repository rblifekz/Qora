import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, Pop, Big, at, clamp, usePop, fontFamily, ease} from '../lib';

export const S2_START = 4.9;
export const S2_END = 8.4;
const T = (s: number) => at(s, S2_START);

export const CARD_W = 290;
export const CARD_H = 400;
export const cardX = (i: number) => 540 - CARD_W * 1.5 - 30 + i * (CARD_W + 30);
export const CARD_Y = 820;

export const Card: React.FC<{n: number; label?: string; open?: boolean}> = ({n, label, open}) => (
  <div
    style={{
      width: CARD_W,
      height: CARD_H,
      borderRadius: 36,
      background: C.card,
      border: `3px solid ${open ? C.green : '#2C2C34'}`,
      boxShadow: '0 30px 60px rgba(0,0,0,0.55)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily,
      gap: 10,
    }}
  >
    <div style={{fontSize: 190, fontWeight: 800, color: open ? C.green : C.white, lineHeight: 1}}>{n}</div>
    <div style={{fontSize: 70, fontWeight: 800, color: C.dim}}>{label ?? '?'}</div>
  </div>
);

// «Раньше так не было. И дело не только в тебе» → три карточки
export const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const zoomStart = T(8.05);
  const z = interpolate(frame, [zoomStart, T(S2_END)], [0, 1], {...clamp, easing: ease});
  const zeroOut = interpolate(frame, [0, 8], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {/* 0 ₸ уезжает вверх и гаснет — стык с S1 */}
      <div
        style={{
          position: 'absolute',
          top: interpolate(frame, [0, 8], [905, 700], clamp),
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily,
          fontSize: 200,
          fontWeight: 800,
          color: C.red,
          letterSpacing: -6,
          opacity: zeroOut,
          transform: `scale(${1 - (1 - zeroOut) * 0.4})`,
        }}
      >
        0&nbsp;₸
      </div>

      <Pop start={T(5.02)} end={T(6.3)} style={{position: 'absolute', top: 600, left: 0, right: 0}}>
        <Big size={130} color={C.gray}>
          Раньше
        </Big>
        <Big size={130}>так не было</Big>
      </Pop>

      <Pop start={T(6.58)} style={{position: 'absolute', top: 400, left: 0, right: 0}}>
        <div style={{opacity: 1 - z}}>
          <Big size={92}>не только</Big>
          <Big size={92} color={C.green}>
            в тебе
          </Big>
        </div>
      </Pop>

      {[0, 1, 2].map((i) => {
        const s = usePop(T(6.86) + i * 4);
        if (frame < T(6.86) + i * 4) return null;
        // карточка 1 летит на весь экран
        const isFirst = i === 0;
        const scale = isFirst ? interpolate(z, [0, 1], [1, 4.2]) : 1;
        const x = isFirst ? interpolate(z, [0, 1], [cardX(0), 540 - CARD_W / 2]) : cardX(i);
        const y = isFirst ? interpolate(z, [0, 1], [CARD_Y, 960 - CARD_H / 2]) : CARD_Y;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y + (1 - s) * 120,
              transform: `scale(${scale * (0.6 + 0.4 * s)}) rotate(${(1 - s) * (i - 1) * 10}deg)`,
              opacity: (isFirst ? 1 : 1 - z) * Math.min(1, s * 1.5),
              zIndex: isFirst ? 2 : 1,
            }}
          >
            <Card n={i + 1} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
