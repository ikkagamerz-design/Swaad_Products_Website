"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { homeProducts as products } from "@/lib/site";
import { Rusk } from "@/components/home/Props";

/** Three packs on a small turntable: every 2.6s the next one glides to the front and settles there. */
export default function OrbitPacks() {
  const [idx, setIdx] = useState(0);
  const n = products.length;
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % n), 2600);
    return () => clearInterval(t);
  }, [n]);
  const front = products[idx];
  return (
    <div className="turn">
      <div className="turn-stage">
        <span className="neon-glow" />
        <span className="neon" />
        <div className="podium">
          <span className="pod-side" />
          <span className="pod-top" />
        </div>
        <Rusk className="crumb c1" />
        <Rusk className="crumb c2" />
        <span className="bits" />
        {products.map((p, i) => {
          const slot = (i - idx + n) % n; // 0 front, 1 back-right, 2 back-left
          return (
            <button key={p.id} className={`tp tp-${slot}`} onClick={() => setIdx(i)} aria-label={`Show ${p.name}`} tabIndex={-1}>
              <Image src={p.image} alt="" width={p.w} height={p.h} sizes="160px" />
            </button>
          );
        })}
      </div>
      <p className="turn-cap" key={front.id}>
        <b>{front.name}</b>
        <span>
          {front.weight} · MRP {front.price}
        </span>
      </p>
    </div>
  );
}
