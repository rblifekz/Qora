import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, random} from 'remotion';
import {C, Pop, Big, Notif, at, fmt, clamp, easeIn, usePop, useShake, fontFamily, Cam} from '../lib';

export const S1_START = 0;
export const S1_END = 4.9;
const T = (s: number) => at(s, S1_START);

// Хук: зачисление → баланс тает → 0
export const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [0, 24], [1, 0], clamp);
  const meltStart = T(1.34);
  const zero = T(4.22);
  const p = interpolate(frame, [meltStart, zero], [0, 1], {...clamp, easing: (x: number) => Math.pow(x, 1.6)});
  const balance = 250000 * (1 - p);
  const isZero = frame >= zero;
  const color = isZero ? C.red : interpolate(p, [0, 1], [0, 1]) > 0.6 ? C.gray : C.green;
  const balPop = usePop(2);
  const zeroPop = usePop(zero, {damping: 8, stiffness: 260});
  const shake = useShake(zero, 10, 22);
  const heroOut = T(1.25);

  // осыпающиеся цифры
  const debris = isZero
    ? new Array(14).fill(0).map((_, i) => {
        const k = frame - zero;
        const x = (random(`dx${i}`) - 0.5) * 760;
        const vy = 6 + random(`dv${i}`) * 10;
        const y = k * vy + 0.9 * k * k;
        const r = (random(`dr${i}`) - 0.5) * k * 12;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 540 + x - 40,
              top: 1130 + y,
              fontFamily,
              fontWeight: 800,
              fontSize: 80,
              color: C.green,
              opacity: interpolate(k, [0, 18], [0.6, 0], clamp),
              transform: `rotate(${r}deg)`,
            }}
          >
            {String(Math.floor(random(`dd${i}`) * 10))}
          </div>
        );
      })
    : null;

  const days = ['ПН', 'ВТ', 'СР'];
  const dayTimes = [T(2.94), T(3.26), T(3.5)];

  return (
    <Cam dur={T(S1_END)} from={1} to={1.08}>
      <AbsoluteFill style={{background: C.bg, transform: `translate(${shake.x}px, ${shake.y}px)`}}>
        {/* красная вспышка на ноль */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% 55%, ${C.red}55, transparent 60%)`,
            opacity: interpolate(frame, [zero, zero + 3, zero + 16], [0, 1, 0], clamp),
          }}
        />
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% 30%, ${C.green}22, transparent 55%)`,
            opacity: 1 - p,
          }}
        />
        {/* уведомление */}
        <div style={{position: 'absolute', top: 270, left: 80, transform: `scale(${1 + glow * 0.03})`}}>
          <Notif title="Зачисление +250 000 ₸" body="Заработная плата" glow={glow} />
        </div>

        {/* ТЫ ЗАМЕТИЛ? */}
        <Pop start={2} end={heroOut} style={{position: 'absolute', top: 560, left: 0, right: 0}}>
          <Big size={170}>Ты</Big>
          <Big size={170} color={C.green}>
            заметил?
          </Big>
        </Pop>

        {/* дни */}
        <div
          style={{
            position: 'absolute',
            top: 700,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          {days.map((d, i) => {
            const on = frame >= dayTimes[i];
            if (frame < dayTimes[0]) return null;
            return (
              <div
                key={d}
                style={{
                  fontFamily,
                  fontWeight: 800,
                  fontSize: 52,
                  padding: '14px 30px',
                  borderRadius: 20,
                  color: on ? C.bg : C.dim,
                  background: on ? C.white : 'transparent',
                  border: `3px solid ${on ? C.white : C.dim}`,
                  transform: `scale(${on ? interpolate(frame - dayTimes[i], [0, 4], [1.25, 1], clamp) : 1})`,
                  opacity: isZero ? 0.4 : 1,
                }}
              >
                {d}
              </div>
            );
          })}
        </div>

        {/* баланс */}
        <div
          style={{
            position: 'absolute',
            top: frame < heroOut ? 930 : interpolate(frame, [heroOut, heroOut + 10], [930, 860], clamp),
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily,
          }}
        >
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: C.gray,
              letterSpacing: 6,
              opacity: balPop,
            }}
          >
            БАЛАНС
          </div>
          <div
            style={{
              fontSize: frame < heroOut ? 150 : interpolate(frame, [heroOut, heroOut + 10], [150, 200], clamp),
              fontWeight: 800,
              letterSpacing: -6,
              color,
              fontVariantNumeric: 'tabular-nums',
              transform: `scale(${isZero ? 0.7 + zeroPop * 0.3 : balPop})`,
              textShadow: isZero ? `0 0 60px ${C.red}88` : `0 0 60px ${C.green}44`,
            }}
          >
            {fmt(isZero ? 0 : Math.ceil(balance / 10) * 10)}&nbsp;₸
          </div>
        </div>
        {debris}
      </AbsoluteFill>
    </Cam>
  );
};
