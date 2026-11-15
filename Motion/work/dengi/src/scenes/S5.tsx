import React from 'react';
import {interpolate, useCurrentFrame, random} from 'remotion';
import {C, Pop, Big, at, clamp, fmt, fontFamily, Notif, ease, Cam} from '../lib';
import {ChapterBg, ChapterHead} from './Chapter';

export const S5_START = 25.1;
export const S5_END = 36.0;
const T = (s: number) => at(s, S5_START);

const FIRST = [
  {t: 27.1, title: '−2 000 ₸', body: 'Покупка', icon: '−'},
  {t: 28.06, title: '−5 000 ₸', body: 'Перевод', icon: '−'},
  {t: 29.05, title: 'Доставка −3 490 ₸', body: 'Еда за 30 минут', icon: 'Д'},
  {t: 29.78, title: 'Подписка −2 990 ₸', body: 'Автосписание', icon: 'П'},
  {t: 30.38, title: 'Рассрочка −18 500 ₸', body: 'Платёж 4 из 12', icon: 'Р'},
];
const LABELS = ['Такси', 'Кофе', 'Доставка', 'Подписка', 'Рассрочка', 'Перевод', 'Магазин', 'Аптека', 'Заказ'];
const AMOUNTS = [890, 1290, 1990, 2490, 3490, 4990, 6500, 9900, 12000, 15000];
const RAIN_N = 30;
const ROW = 150;
const TOP = 300;

export const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const rainAt = T(33.17);
  const items = [
    ...FIRST.map((f) => ({...f, at: T(f.t)})),
    ...new Array(RAIN_N).fill(0).map((_, i) => {
      const a = AMOUNTS[Math.floor(random(`a${i}`) * AMOUNTS.length)];
      const l = LABELS[Math.floor(random(`l${i}`) * LABELS.length)];
      return {t: 0, title: `${l} −${fmt(a)} ₸`, body: '', icon: '−', at: rainAt + Math.round(i * 1.3)};
    }),
  ];
  const visible = items.filter((it) => frame >= it.at);
  const n = visible.length;
  const headOut = interpolate(frame, [T(26.95) - 4, T(26.95) + 4], [1, 0], clamp);

  // по отдельности — фокус на одном
  const focusIn = interpolate(frame, [T(31.3), T(31.6)], [0, 1], clamp);
  const focusOut = interpolate(frame, [rainAt - 3, rainAt + 3], [1, 0], clamp);
  const focus = focusIn * focusOut;

  // отъезд камеры — видно всю «стопку»
  const zoom = interpolate(frame, [rainAt, T(34.6)], [1, 0.34], {...clamp, easing: ease});
  const sumP = interpolate(frame, [rainAt + 4, T(35.0)], [0, 1], clamp);
  const finalAt = T(35.0);

  return (
    <ChapterBg fly>
      <Cam dur={T(S5_END)} to={1.03}>
        <div style={{opacity: headOut}}>
          <ChapterHead n={3} title="Мелочь" titleAt={T(25.4)} fly />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: TOP,
            transformOrigin: '50% 0',
            transform: `scale(${zoom})`,
          }}
        >
          {visible.map((it, vi) => {
            // новые сверху, старые сдвигаются вниз
            const idxFromTop = n - 1 - vi;
            const k = frame - it.at;
            const drop = interpolate(k, [0, 7], [-160, 0], {...clamp, easing: ease});
            const isFocus = vi === 2; // доставка
            const dim = focus > 0 && !isFocus ? 1 - focus * 0.75 : 1;
            const sc = isFocus ? 1 + focus * 0.08 : 1 - focus * 0.04;
            return (
              <div
                key={vi}
                style={{
                  position: 'absolute',
                  left: 80,
                  top: idxFromTop * ROW + (idxFromTop === 0 ? drop : 0),
                  opacity: Math.min(1, k / 4) * dim,
                  transform: `scale(${sc})`,
                  transition: 'none',
                  zIndex: isFocus ? 50 : 10,
                }}
              >
                <Notif compact title={it.title} body={it.body || undefined} icon={it.icon} color={C.red} />
              </div>
            );
          })}
        </div>

        {FIRST.map((f, i) => {
          const st = T(f.t);
          const next = i < FIRST.length - 1 ? T(FIRST[i + 1].t) : T(31.2);
          if (frame < st || frame >= next) return null;
          const word = ['−2 000', '−5 000', 'доставка', 'подписки', 'рассрочка'][i];
          return (
            <Pop key={i} start={st} from={1.4} y={0} style={{position: 'absolute', top: 1100, left: 0, right: 0}}>
              <Big size={i < 2 ? 170 : 120} color={i < 2 ? C.red : C.white}>
                {word}
              </Big>
            </Pop>
          );
        })}

        {focus > 0.01 && (
          <div style={{position: 'absolute', top: 1180, left: 0, right: 0, opacity: focus}}>
            <Big size={120} color={C.gray}>
              ерунда?
            </Big>
          </div>
        )}

        {/* итог */}
        {frame >= rainAt + 4 && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 620,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                padding: '40px 50px',
                borderRadius: 50,
                background: 'rgba(10,10,12,0.82)',
                boxShadow: `0 0 120px 40px rgba(10,10,12,0.85)`,
                textAlign: 'center',
                fontFamily,
                transform: `scale(${frame >= finalAt ? interpolate(frame - finalAt, [0, 5], [1.12, 1], clamp) : 1})`,
              }}
            >
              <div style={{fontSize: 46, fontWeight: 700, color: C.gray, letterSpacing: 4}}>
                {frame >= T(34.7) ? 'ТВОЯ ЗАРПЛАТА' : 'ВМЕСТЕ'}
              </div>
              <div
                style={{
                  fontSize: 160,
                  fontWeight: 800,
                  color: C.red,
                  letterSpacing: -6,
                  fontVariantNumeric: 'tabular-nums',
                  textShadow: `0 0 60px ${C.red}66`,
                }}
              >
                −{fmt(Math.round((250000 * sumP) / 10) * 10)}&nbsp;₸
              </div>
            </div>
          </div>
        )}
      </Cam>
    </ChapterBg>
  );
};
