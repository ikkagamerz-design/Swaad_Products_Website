"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { homeProducts as products } from "@/lib/site";

const LINE: Record<string, string> = {
  elaichi: "Cardamom warmth for slow mornings",
  milk: "Creamy comfort, any hour",
  jumbo: "Big crunch for the whole family",
};

/** Soft backdrop tone per flavour (lighter than the brand colour so dark text stays readable). */
const TONE: Record<string, string> = {
  milk: "#8ccbf3",
  elaichi: "#d6e26a",
  jumbo: "#f7a556",
};

const EVERY = 3000;

/** One pack centre stage, the others behind; rotates on its own every 5s, arrows/clicks still work. */
export default function Stage() {
  const [idx, setIdx] = useState(0);
  const n = products.length;
  const go = (d: number) => setIdx((i) => (i + d + n) % n);
  const p = products[idx];

  // auto-advance; any manual change restarts the 5s clock
  useEffect(() => {
    const t = setTimeout(() => setIdx((i) => (i + 1) % n), EVERY);
    return () => clearTimeout(t);
  }, [idx, n]);

  return (
    <section
      className="stage"
      data-flavor={p.id}
      id="flavours"
      style={{ ["--c" as string]: TONE[p.id] }}
    >
      <div className="stage-bg" />
      <span className="stage-word" aria-hidden key={p.id}>
        {p.short}
      </span>
      <div className="stage-packs">
        {products.map((q, i) => {
          const pos = (i - idx + n) % n; // 0 centre, 1 right-back, 2 left-back
          return (
            <button
              key={q.id}
              className={`sp sp-${pos}`}
              onClick={() => setIdx(i)}
              aria-label={`Show ${q.name}`}
              tabIndex={pos === 0 ? -1 : 0}
            >
              <Image src={q.image} alt="" width={q.w} height={q.h} sizes="(max-width: 760px) 50vw, 24vw" />
            </button>
          );
        })}
      </div>
      <div className="stage-info" key={`i-${p.id}`}>
        <h2>{p.name}</h2>
        <p>{LINE[p.id]}</p>
        <Link href="/products" className="btn btn-flavor" style={{ background: p.color, color: p.ink }}>
          Taste it
        </Link>
      </div>
      <div className="stage-arrows">
        <div className="stage-dots" aria-hidden>
          {products.map((q, i) => (
            <span key={q.id} className={i === idx ? "on" : ""}>
              {i === idx && <i key={idx} />}
            </span>
          ))}
        </div>
        <button aria-label="Previous flavour" onClick={() => go(-1)}>
          ←
        </button>
        <button aria-label="Next flavour" onClick={() => go(1)}>
          →
        </button>
      </div>
    </section>
  );
}
