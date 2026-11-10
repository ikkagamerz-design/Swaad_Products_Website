"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/site";

export type CartonItem = { p: Product; count: number; label: string; flavour: string };

/* ---------- timeline (seconds) ---------- */
const ENTER = 1.1; // carton drops in, spinning
const OPEN_A = [1.1, 1.5]; // long flaps open
const OPEN_B = [1.3, 1.75]; // side flaps open
const LAUNCH = 1.8; // first pack leaves the carton
const FLIGHT = 1.1; // one pack's flight time
const RETURN = 8.2; // packs start diving back
const BACK = 0.6; // one pack's return time
const RSTAG = 0.05;
const CLOSE_B = [10.0, 10.35];
const CLOSE_A = [10.2, 10.6];
const EXIT = [10.85, 11.7];
const CYCLE = 11.9;
const SPIN = 20; // deg / s, slow swirl of packs
const BOX_RY = -32;

/* ---------- easing ---------- */
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const outCubic = (u: number) => 1 - (1 - u) ** 3;
const inCubic = (u: number) => u ** 3;
const inOut = (u: number) => (u < 0.5 ? 4 * u ** 3 : 1 - (-2 * u + 2) ** 3 / 2);
const outBounce = (u: number) => {
  const n = 7.5625, d = 2.75;
  if (u < 1 / d) return n * u * u;
  if (u < 2 / d) return n * (u -= 1.5 / d) * u + 0.75;
  if (u < 2.5 / d) return n * (u -= 2.25 / d) * u + 0.9375;
  return n * (u -= 2.625 / d) * u + 0.984375;
};

/* packs swirl out of the open carton into two rings above it */
function slots(n: number) {
  const per = Math.round(n * 0.58); // bigger lower ring, smaller top ring
  return Array.from({ length: n }, (_, i) => {
    const ring = i < per ? 0 : 1;
    const inRing = ring ? n - per : per;
    const k = ring ? i - per : i;
    return {
      phi: (k * 360) / inRing + ring * 18,
      y: -205 - ring * 112,
      r: 222 - ring * 62,
    };
  });
}

const PW = 70;
const PERSP = 1400; // must match .cs-fit perspective // pack width in stage px

/**
 * 3D carton show: the kraft carton spins in, flaps open, every pack swirls out one by one
 * while the counter runs, the packs orbit above the carton, then dive back in and the
 * carton flies off for the next flavour. Pure CSS 3D, driven by one rAF loop.
 */
export default function CartonShow({ items }: { items: CartonItem[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const shadow = useRef<HTMLSpanElement>(null);
  const packs = useRef<(HTMLSpanElement | null)[]>([]);
  const [idx, setIdx] = useState(0);
  const [out, setOut] = useState(-1); // -1 = show the full count
  const [scale, setScale] = useState(1);
  const clock = useRef({ t0: 0, paused: 0, visible: false });
  const idxRef = useRef(0);
  idxRef.current = idx;

  const item = items[idx];
  const n = item.count;
  const pH = (PW * item.p.h) / item.p.w;

  // fit the fixed-size stage to its container
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.max(0.5, Math.min(1.1, e.contentRect.width / 620, (window.innerHeight - 330) / 540))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // main loop
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const c = clock.current;
    c.t0 = performance.now();
    let raf = 0;
    let lastOut = -2;
    const S = slots(n);
    const per = Math.round(n * 0.58);
    const stag = Math.min(0.12, 2.7 / n);

    const frame = (now: number) => {
      let t = (now - c.t0) / 1000;
      if (reduce) t = 6;
      if (t >= CYCLE) {
        setIdx((i) => (i + 1) % items.length);
        return;
      }

      /* carton */
      let y = 0, ry = BOX_RY + Math.sin(t * 0.7) * 7, op = 1;
      if (t < ENTER) {
        const u = t / ENTER;
        y = -560 * (1 - outBounce(u));
        ry = BOX_RY - 360 * (1 - outCubic(u));
      } else if (t > EXIT[0]) {
        const u = inCubic(prog(t, EXIT[0], EXIT[1]));
        y = -620 * u;
        ry = BOX_RY + Math.sin(t * 0.7) * 7 + 320 * u;
        op = 1 - prog(t, EXIT[1] - 0.25, EXIT[1]);
      }
      const fa = t < RETURN ? 90 - 132 * inOut(prog(t, OPEN_A[0], OPEN_A[1])) : -42 + 132 * inOut(prog(t, CLOSE_A[0], CLOSE_A[1]));
      const fs = t < RETURN ? 90 - 150 * inOut(prog(t, OPEN_B[0], OPEN_B[1])) : -60 + 150 * inOut(prog(t, CLOSE_B[0], CLOSE_B[1]));
      const b = box.current;
      if (b) {
        b.style.transform = `translate3d(0, ${y}px, 0) rotateY(${ry}deg)`;
        b.style.opacity = String(op);
        b.style.setProperty("--fa", `${fa}deg`);
        b.style.setProperty("--fs", `${fs}deg`);
      }
      if (shadow.current) {
        const k = 1 - Math.min(1, -y / 560);
        shadow.current.style.transform = `translateX(-50%) scale(${0.35 + 0.65 * k})`;
        shadow.current.style.opacity = String(k * op);
      }

      /* packs */
      let landed = 0;
      for (let i = 0; i < n; i++) {
        const el = packs.current[i];
        if (!el) continue;
        const s = S[i];
        const spin = s.phi + SPIN * t;
        const start = LAUNCH + i * stag;
        const back = RETURN + (n - 1 - i) * RSTAG;
        let px = 0, py = 20, pz = 0, sc = 0.45, rz = 0, vis = 0;
        if (t >= start && t < back + BACK) {
          vis = 1;
          let r: number, phi: number;
          if (t < start + FLIGHT) {
            const u = (t - start) / FLIGHT;
            const e = outCubic(u);
            r = s.r * inOut(u);
            phi = spin - (1 - e) * 280;
            py = 20 + (s.y - 20) * e;
            sc = 0.45 + 0.55 * e;
            rz = (1 - e) * 200;
            if (u > 0.7) landed++;
          } else if (t >= back) {
            const u = (t - back) / BACK;
            const e = inCubic(u);
            r = s.r * (1 - inOut(u));
            phi = spin + e * 280;
            py = s.y + (20 - s.y) * e;
            sc = 1 - 0.55 * e;
            rz = -e * 160;
          } else {
            r = s.r;
            phi = spin;
            py = s.y;
            sc = 1;
            rz = 0;
            landed++;
          }
          const a = (phi * Math.PI) / 180;
          px = Math.sin(a) * r;
          pz = Math.cos(a) * r;
        }
        el.style.opacity = String(vis);
        // cancel perspective shrink so packs keep the same size all around the ring
        // depth after the world tilt (rotateX -20deg)
        const depth = -0.342 * py + 0.94 * pz;
        sc *= (PERSP - depth) / PERSP;
        // world is tilted by rotateX(-20deg); undo it so every pack faces the camera
        el.style.transform = `translate3d(${px}px, ${py}px, ${pz}px) rotateX(20deg) rotateZ(${rz}deg) scale(${sc})`;
      }
      const showOut = t >= LAUNCH && t < LAUNCH + n * stag + FLIGHT ? landed : -1;
      if (showOut !== lastOut) {
        lastOut = showOut;
        setOut(showOut);
      }

      if (!reduce && c.visible) raf = requestAnimationFrame(frame);
      else running = false;
    };
    let running = false;
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        const was = c.visible;
        c.visible = e.isIntersecting;
        if (c.visible && !was) {
          c.t0 += performance.now() - c.paused;
          start();
        } else if (!c.visible && was) {
          c.paused = performance.now();
        }
      },
      { threshold: 0.15 },
    );
    c.visible = false;
    c.paused = performance.now();
    frame(performance.now()); // place everything once
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      running = false;
    };
  }, [idx, n, items.length]);

  return (
    <div className="cshow" style={{ ["--c" as string]: item.p.color }}>
      <div className="cs-stage" ref={stage} style={{ height: 540 * scale }}>
        <div className="cs-fit" style={{ transform: `translateX(-50%) scale(${scale})` }}>
          <span className="cs-glow" aria-hidden />
          <span className="cs-shadow" ref={shadow} aria-hidden />
          <div className="cs-world" aria-hidden>
            {Array.from({ length: n }).map((_, i) => (
              <span
                key={`${item.p.id}-${i}`}
                className="cs-pack"
                ref={(el) => { packs.current[i] = el; }}
                style={{ width: PW, height: pH, marginLeft: -PW / 2, marginTop: -pH / 2 }}
              >
                <Image src={item.p.image} alt="" width={item.p.w} height={item.p.h} sizes="80px" />
              </span>
            ))}

            <div className="cbox" ref={box}>
              <div className="cf c-inner" />
              <div className="cf c-back" />
              <div className="cf c-left" />
              <div className="cf c-bottom" />
              <div className="cf c-front">
                <span className="cp-hindi">स्वाद अपनेपन का</span>
                <Image className="cp-logo" src="/logo.png" alt="" width={640} height={441} />
                <span className="cp-crispy">Crispy &amp;<br />Crunchy</span>
                <span className="cp-flav">{item.flavour}</span>
                <span className="cp-rusk">Rusk</span>
              </div>
              <div className="cf c-right">
                <span className="cs-fssai">fssai<br /><i>12725046000066</i></span>
                <b>{n}</b>
                <span className="cs-pk">PACKS</span>
                <span className="cs-arrows">↑ ↑</span>
                <span className="cs-mfg">Mamta Food Products<br />Pukhrayan</span>
              </div>
              <div className="flap fl-left" />
              <div className="flap fl-right" />
              <div className="flap fl-front" />
              <div className="flap fl-back" />
            </div>
          </div>
        </div>
      </div>

      <div className="cs-info" aria-live="polite">
        <p className="carton-cap">
          <b key={out === -1 ? `f${idx}` : out}>{out === -1 ? n : out}</b>
          <span className="cc-x">×</span>
          <span className="cc-name">{item.label}</span>
        </p>
        <p className="carton-sub">packs in 1 carton</p>
      </div>

      <div className="cs-tabs" role="tablist" aria-label="Choose a carton">
        {items.map((it, i) => (
          <button
            key={it.p.id}
            role="tab"
            aria-selected={i === idx}
            className={`cs-tab${i === idx ? " on" : ""}`}
            style={{ ["--c" as string]: it.p.color, ["--k" as string]: it.p.ink }}
            onClick={() => {
              if (i === idx) clock.current.t0 = performance.now();
              setIdx(i);
            }}
          >
            <Image src={it.p.image} alt="" width={it.p.w} height={it.p.h} sizes="40px" />
            <span>
              <b>{it.label}</b>
              <i>{it.count} packs / carton</i>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
