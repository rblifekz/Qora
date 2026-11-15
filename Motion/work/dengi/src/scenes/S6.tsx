import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, Pop, Big, at, clamp, fontFamily, Bill, usePop, Cam, easeIn} from '../lib';

export const S6_START = 36.0;
export const S6_END = 40.5;
const T = (s: number) => at(s, S6_START);

const DAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
const WHERE = ['еда', 'такси', 'кофе', 'доставка', 'подарок'];

export const S6: React.FC = () => {
  const frame = useCurrentFrame();
  const cashAt = T(37.6);
  const seeAt = T(38.54);
  const flyAt = T(39.3);
  const bright = interpolate(frame, [seeAt, seeAt + 8], [0.8, 1.25], clamp);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AbsoluteFill
        style={{background: `radial-gradient(circle at 50% 70%, ${C.green}26, transparent 55%)`, opacity: interpolate(frame, [seeAt, seeAt + 10], [0.3, 1], clamp)}}
      />
      <Cam dur={T(S6_END)} to={1.06}>
        <Pop start={T(36.1)} style={{position: 'absolute', top: 290, left: 0, right: 0}}>
          <Big size={150}>
            <span style={{color: C.green}}>1</span> неделя
          </Big>
        </Pop>
        <div style={{position: 'absolute', top: 470, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 14}}>
          {DAYS.map((d, i) => {
            const st = T(36.62) + i * 2;
            const s = usePop(st);
            if (frame < st) return null;
            return (
              <div
                key={d}
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: 24,
                  background: C.card,
                  border: `3px solid #2C2C34`,
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily,
                  fontWeight: 800,
                  fontSize: 38,
                  color: C.white,
                  transform: `scale(${0.5 + 0.5 * s})`,
                  opacity: s,
                }}
              >
                {d}
              </div>
            );
          })}
        </div>
        <Pop start={T(37.42)} style={{position: 'absolute', top: 640, left: 0, right: 0}}>
          <Big size={92} color={C.gray}>
            только <span style={{color: C.white}}>наличка</span>
          </Big>
        </Pop>

        {/* веер купюр */}
        {[0, 1, 2, 3, 4].map((i) => {
          const s = usePop(cashAt + i * 2, {damping: 12});
          if (frame < cashAt + i * 2) return null;
          const ang = (i - 2) * 12 * s;
          const k = frame - flyAt - i * 2;
          const p = k > 0 ? interpolate(k, [0, 14], [0, 1], {...clamp, easing: easeIn}) : 0;
          const dx = (i - 2) * 340 * p;
          const dy = -p * (300 + Math.abs(i - 2) * -80) + p * p * 900 * (i % 2 ? 1 : -0.2);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 540 - 210,
                top: 960,
                transformOrigin: '50% 140%',
                transform: `translate(${dx}px, ${dy}px) rotate(${ang + p * (i - 2) * 25}deg) scale(${0.6 + 0.4 * s})`,
                opacity: s * (1 - p * 0.9),
              }}
            >
              <Bill w={420} bright={bright} />
              {p > 0.05 && (
                <div
                  style={{
                    position: 'absolute',
                    top: -70,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    fontFamily,
                    fontWeight: 800,
                    fontSize: 54,
                    color: C.white,
                  }}
                >
                  {WHERE[i]}
                </div>
              )}
            </div>
          );
        })}
      </Cam>
    </AbsoluteFill>
  );
};
