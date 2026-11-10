"use client";

import Image from "next/image";
import type { Product } from "@/lib/site";
import { propSets } from "./Props";
import { InView } from "./InView";

const WORD: Record<Product["id"], string> = {
  elaichi: "ELAICHI",
  milk: "MILK",
  jumbo: "JUMBO",
};

/** Full-screen flavour moment: warm illustrated scene, one soft running word, pack + flying ingredients. */
export default function FlavorPanel({ p }: { p: Product }) {
  const props = propSets[p.id];
  return (
    <InView as="section" id={`flavor-${p.id}`} className={`flavor flavor-${p.id}`} data-flavor={p.id}>
      <div className="flavor-bg" style={{ backgroundImage: `url(/art/scene-${p.id}.webp)` }} />
      <div className="run" aria-hidden>
        <div className="run-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>{WORD[p.id]}&nbsp;·&nbsp;</span>
          ))}
        </div>
      </div>

      <div className="flavor-props" aria-hidden>
        {props.map((Prop, i) => (
          <Prop key={i} className={`fp fp-${i}`} />
        ))}
      </div>

      <div className="flavor-glow" aria-hidden />
      <div className="flavor-pack">
        <Image src={p.image} alt={`Swaad ${p.name} pack`} width={p.w} height={p.h} sizes="(max-width: 760px) 60vw, 26vw" />
      </div>

      <div className="flavor-meta" style={{ color: p.ink, background: p.color }}>
        <span className="fm-tag">{p.tagline}</span>
        <h2>{p.name}</h2>
        <p className="fm-desc">{p.description}</p>
        <div className="fm-row">
          <span className="fm-chip">{p.weight}</span>
          <span className="fm-chip">MRP {p.price}</span>
          <span className="fm-chip">Best before 4 months</span>
        </div>
      </div>
    </InView>
  );
}
