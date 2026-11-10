"use client";

import { useEffect, useState } from "react";
import { homeProducts as products } from "@/lib/site";
import { Cardamom, MilkDrop, Rusk } from "./Props";

const ICON = { elaichi: Cardamom, milk: MilkDrop, jumbo: Rusk } as const;

/** Fixed vertical flavour picker on the right; follows whichever flavour is on screen. */
export default function FlavorRail() {
  const [cur, setCur] = useState("milk");
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-flavor]"));
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setCur((vis.target as HTMLElement).dataset.flavor || "elaichi");
      },
      { threshold: [0.3, 0.6] }
    );
    els.forEach((e) => io.observe(e));
    const mo = new MutationObserver((recs) => {
      const t = recs[0]?.target as HTMLElement | undefined;
      if (!t) return;
      const r = t.getBoundingClientRect();
      if (r.top < window.innerHeight / 2 && r.bottom > window.innerHeight / 2) setCur(t.dataset.flavor || "elaichi");
    });
    els.forEach((e) => mo.observe(e, { attributes: true, attributeFilter: ["data-flavor"] }));
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  const active = products.find((p) => p.id === cur) ?? products[0];
  return (
    <nav className="rail" aria-label="Flavours">
      <span className="rail-tag" key={active.id} style={{ background: active.color, color: active.ink }}>
        {active.short}
      </span>
      {products.map((p) => {
        const Icon = ICON[p.id];
        return (
          <a
            key={p.id}
            href={`#flavor-${p.id}`}
            className={p.id === cur ? "on" : ""}
            aria-label={p.name}
            title={p.name}
            style={{ background: p.color }}
          >
            <Icon className={`rail-ic rail-${p.id}`} />
          </a>
        );
      })}
    </nav>
  );
}
