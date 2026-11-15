import React from 'react';
import {interpolate, useCurrentFrame, random} from 'remotion';
import {useTxt} from '../lang';
import {C, Pop, Big, at, clamp, fontFamily, usePop, Bill, Phone, Cam, ease, easeIn} from '../lib';
import {ChapterBg, ChapterHead} from './Chapter';

export const S4_START = 15.4;
export const S4_END = 25.1;
const T = (s: number) => at(s, S4_START);

const COLS = 16;
const ROWS = 8;
const BILL_W = 520;
const BILL_H = BILL_W * 0.486;
const BILL_X = 540 - BILL_W / 2;
const BILL_Y = 380;
const TARGET = {x: 540, y: 1155};

// «НЕВИДИМЫМИ» — буквы растворяются
const Dissolve: React.FC<{text: string; start: number}> = ({text, start}) => {
  const frame = useCurrentFrame();
  return (
    <Big size={text.length > 9 ? 108 : 130}>
      {text.split('').map((ch, i) => {
        const d = start + Math.floor(random(`l${i}`) * 14);
        const o = interpolate(frame, [d, d + 10], [1, 0.08], clamp);
        const b = interpolate(frame, [d, d + 10], [0, 14], clamp);
        return (
          <span key={i} style={{opacity: o, filter: `blur(${b}px)`, display: 'inline-block'}}>
            {ch}
          </span>
        );
      })}
    </Big>
  );
};

export const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const tx = useTxt();
  const stackAt = T(18.38);
  const counts = [T(18.82), T(19.18), T(19.9), T(20.7), T(21.26)];
  const phoneAt = T(21.85);
  const tap = T(22.75);
  const calm = T(23.9);
  const phoneS = usePop(phoneAt, {damping: 16});
  const titleOut = interpolate(frame, [stackAt - 6, stackAt], [1, 0], clamp);

  // стопка купюр: 6 шт; верхняя улетает на каждое слово, нижняя (i=0) остаётся
  const flown = counts.filter((c) => frame >= c).length;
  const stack = new Array(6).fill(0).map((_, i) => {
    const flyAt = i > 0 ? counts[5 - i] : undefined;
    const k = flyAt !== undefined ? frame - flyAt : -1;
    const p = k >= 0 ? interpolate(k, [0, 10], [0, 1], {...clamp, easing: easeIn}) : 0;
    const dir = i % 2 === 0 ? -1 : 1;
    const baseY = 720 - i * 22;
    if (p >= 1) return null;
    const last = i === 0;
    if (last && frame >= tap) return null;
    const y = last ? interpolate(frame, [phoneAt, phoneAt + 10], [baseY, BILL_Y], {...clamp, easing: ease}) : baseY;
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: BILL_X + p * dir * 950,
          top: y - p * 260,
          transform: `rotate(${(random(`r${i}`) - 0.5) * 7 + p * dir * 40}deg) scale(${1 + p * 0.15})`,
          opacity: 1 - p * 0.7,
          zIndex: i,
        }}
      >
        <Bill w={BILL_W} />
      </div>
    );
  });
  const lastFly = counts.filter((c) => frame >= c).pop();
  const cntPunch = lastFly !== undefined ? interpolate(frame - lastFly, [0, 5], [1.18, 1], clamp) : 1;
  const counter =
    frame >= stackAt && frame < phoneAt ? (
      <div
        style={{
          position: 'absolute',
          top: 1080,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily,
          fontWeight: 800,
          fontSize: 150,
          letterSpacing: -5,
          color: flown ? C.white : C.green,
          transform: `scale(${cntPunch})`,
          fontVariantNumeric: 'tabular-nums',
          opacity: interpolate(frame, [phoneAt - 6, phoneAt], [1, 0], clamp),
        }}
      >
        {(60 - flown * 10).toString()}&nbsp;000&nbsp;₸
      </div>
    ) : null;

  // распад последней купюры на пиксели
  const particles =
    frame >= tap
      ? new Array(COLS * ROWS).fill(0).map((_, idx) => {
          const cx = idx % COLS;
          const cy = Math.floor(idx / COLS);
          const delay = (cx / COLS) * 6 + random(`pd${idx}`) * 4;
          const p = interpolate(frame - tap - delay, [0, 12], [0, 1], {...clamp, easing: easeIn});
          const sw = BILL_W / COLS;
          const sh = BILL_H / ROWS;
          const x0 = BILL_X + cx * sw;
          const y0 = BILL_Y + cy * sh;
          const curl = Math.sin(p * Math.PI) * (random(`pc${idx}`) - 0.5) * 260;
          const x = x0 + (TARGET.x - x0) * p + curl;
          const y = y0 + (TARGET.y - y0) * p;
          const shade = 0.75 + random(`ps${idx}`) * 0.5;
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: sw + 1,
                height: sh + 1,
                background: random(`pg${idx}`) > 0.85 ? C.green : interpolate(cy, [0, ROWS], [0, 1]) > 0.5 ? C.bill2 : C.bill1,
                filter: `brightness(${shade})`,
                transform: `scale(${1 - p * 0.8}) rotate(${p * 180 * (random(`pr${idx}`) - 0.5)}deg)`,
                opacity: p >= 1 ? 0 : 1,
                borderRadius: p * 6,
              }}
            />
          );
        })
      : null;

  const ripple = frame >= tap ? frame - tap : -1;
  const paid = interpolate(frame, [tap + 14, tap + 22], [0, 1], clamp);

  return (
    <ChapterBg fly>
      <Cam dur={T(S4_END)} to={1.05}>
        <div style={{opacity: titleOut}}>
          <ChapterHead n={2} title="" titleAt={9999} fly />
          {frame >= T(15.75) && (
            <Pop start={T(15.75)} style={{position: 'absolute', top: 440, left: 0, right: 0}}>
              <Dissolve text={tx.invisible} start={T(17.3)} />
              <div style={{marginTop: 30}}>
                <Big size={70} color={C.gray}>
                  {tx.money}
                </Big>
              </div>
            </Pop>
          )}
        </div>

        {frame >= stackAt && frame < calm + 40 && (
          <Pop start={stackAt} y={80} from={0.9} style={{position: 'absolute', inset: 0}}>
            {/* телефон */}
            {frame >= phoneAt && (
              <div
                style={{
                  position: 'absolute',
                  left: 540 - 260,
                  top: interpolate(phoneS, [0, 1], [1900, 700]),
                }}
              >
                <Phone w={520}>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily,
                      gap: 10,
                      paddingBottom: 300,
                    }}
                  >
                    <div
                      style={{
                        width: 170,
                        height: 170,
                        borderRadius: '50%',
                        background: `${C.green}22`,
                        border: `5px solid ${C.green}`,
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 96,
                        color: C.green,
                        fontWeight: 800,
                        transform: `scale(${0.5 + 0.5 * paid})`,
                        opacity: paid,
                      }}
                    >
                      ✓
                    </div>
                    <div style={{fontSize: 50, fontWeight: 800, color: C.white, opacity: paid}}>{tx.paid}</div>
                    <div style={{fontSize: 40, fontWeight: 600, color: C.gray, opacity: paid}}>−10 000 ₸</div>
                  </div>
                  {/* кнопка + касание */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 50,
                      right: 50,
                      top: 400,
                      height: 110,
                      borderRadius: 30,
                      background: C.green,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 42,
                      fontWeight: 800,
                      color: C.bg,
                      fontFamily,
                      opacity: 1 - paid,
                      transform: `scale(${ripple >= 0 && ripple < 6 ? 0.94 : 1})`,
                    }}
                  >
                    {tx.pay}
                  </div>
                  {ripple >= 0 && ripple < 20 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 260 - ripple * 9,
                        top: 455 - ripple * 9,
                        width: ripple * 18,
                        height: ripple * 18,
                        borderRadius: '50%',
                        border: `6px solid ${C.white}`,
                        opacity: 1 - ripple / 20,
                      }}
                    />
                  )}
                </Phone>
              </div>
            )}
            {counter}
            {stack}
            {particles}
          </Pop>
        )}

        {frame >= calm && (
          <Pop start={calm} y={30} from={0.9} style={{position: 'absolute', top: 300, left: 0, right: 0}}>
            <Big size={118}>
              {tx.nothing1}
              <br />
              <span style={{color: C.green}}>{tx.nothing2}</span>
            </Big>
          </Pop>
        )}
      </Cam>
    </ChapterBg>
  );
};
