"use client";

import Image from "next/image";
import { useRef } from "react";
import { products } from "@/lib/site";
import { Cardamom, MilkDrop, Rusk } from "./Props";

/** Sunrise scene: three packs floating in a row, each lifts on hover ("Pick me"). */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--px", String(e.clientX / window.innerWidth - 0.5));
    el.style.setProperty("--py", String(e.clientY / window.innerHeight - 0.5));
  };
  return (
    <section ref={ref} className="hero" data-flavor="milk" onPointerMove={move}>
      <div className="hero-bg" />
      <div className="hero-floaters" aria-hidden>
        <Rusk className="fl fl-1" />
        <Cardamom className="fl fl-2" />
        <MilkDrop className="fl fl-3" />
        <Rusk className="fl fl-4" />
        <Cardamom className="fl fl-5" />
        <MilkDrop className="fl fl-6" />
      </div>

      <h1 className="sr-only">Swaad Rusk: Every Bite Pure Delight</h1>
      <div className="hero-row">
        {products.map((p, i) => (
          <a key={p.id} href={`#flavor-${p.id}`} className="hero-pack" style={{ ["--i" as string]: i }}>
            <Image src={p.image} alt={`Swaad ${p.name}`} width={p.w} height={p.h} priority sizes="(max-width: 760px) 34vw, 22vw" />
            <span className="pick">Pick me</span>
          </a>
        ))}
      </div>

      <div className="hero-foot">
        <p className="hero-tag">Every bite, pure delight.</p>
        <p className="hero-sub">Crispy &amp; light toast from Mamta Food Products</p>
      </div>
      <span className="scroll-hint">Scroll</span>
    </section>
  );
}
