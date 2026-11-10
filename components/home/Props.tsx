"use client";

import { useId } from "react";

/** Illustrated ingredient props that fly around the packs. Pure SVG. */

export function Cardamom({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const id = useId();
  return (
    <svg viewBox="0 0 60 100" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="0.3">
          <stop offset="0" stopColor="#B5DA55" />
          <stop offset="0.5" stopColor="#77A526" />
          <stop offset="1" stopColor="#3C6310" />
        </linearGradient>
      </defs>
      <path d="M30 6 C53 24 55 70 30 95 C5 70 7 24 30 6Z" fill={`url(#${id})`} />
      <path d="M30 10 C41 32 41 70 30 91" stroke="#36590d" strokeWidth="2.2" fill="none" opacity="0.45" />
      <path d="M30 10 C19 32 19 70 30 91" stroke="#d9f08a" strokeWidth="2" fill="none" opacity="0.55" />
      <path d="M22 18 C14 40 15 66 24 84" stroke="#d9f08a" strokeWidth="1.4" fill="none" opacity="0.4" />
      <path d="M30 1 L30 8" stroke="#557a1c" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function Rusk({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const id = useId();
  const dots = [
    [26, 24], [44, 34], [62, 22], [82, 30], [96, 46], [30, 50], [52, 56], [74, 50], [88, 60], [40, 40], [66, 40], [20, 38],
  ];
  return (
    <svg viewBox="0 0 120 84" className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id={id} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#F9CB78" />
          <stop offset="0.6" stopColor="#E8A044" />
          <stop offset="1" stopColor="#C97B25" />
        </radialGradient>
      </defs>
      <rect x="2" y="6" width="116" height="76" rx="14" fill="#8E4A12" opacity="0.45" />
      <rect x="2" y="2" width="116" height="76" rx="14" fill="#B8641C" />
      <rect x="8" y="8" width="104" height="64" rx="10" fill={`url(#${id})`} />
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 ? 1.6 : 2.3} fill={i % 2 ? "#9b5a17" : "#fde3a8"} opacity="0.7" />
      ))}
      <path d="M14 14 Q60 6 106 14" stroke="#fff3cf" strokeWidth="3" fill="none" opacity="0.45" strokeLinecap="round" />
    </svg>
  );
}

export function MilkDrop({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const id = useId();
  return (
    <svg viewBox="0 0 60 80" className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id={id} cx="0.35" cy="0.55" r="0.75">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.7" stopColor="#F1F6FB" />
          <stop offset="1" stopColor="#BFD3E6" />
        </radialGradient>
      </defs>
      <path d="M30 3 C40 22 54 38 54 52 C54 67 43 77 30 77 C17 77 6 67 6 52 C6 38 20 22 30 3Z" fill={`url(#${id})`} />
      <ellipse cx="21" cy="50" rx="5" ry="9" fill="#fff" opacity="0.9" />
    </svg>
  );
}

export function Splash({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const id = useId();
  return (
    <svg viewBox="0 0 200 120" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#D6E4F0" />
        </linearGradient>
      </defs>
      <path
        d="M10 110 C30 90 40 70 52 74 C60 77 56 40 66 38 C76 36 72 70 84 66 C94 63 92 14 104 12 C116 10 110 62 122 64 C132 66 134 34 144 36 C154 38 146 74 158 76 C170 78 176 92 190 110 Z"
        fill={`url(#${id})`}
      />
      <circle cx="66" cy="22" r="6" fill="#fff" />
      <circle cx="146" cy="18" r="5" fill="#fff" />
      <circle cx="104" cy="-2" r="4" fill="#fff" />
    </svg>
  );
}

export function Wheat({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 40 120" className={className} style={style} aria-hidden>
      <path d="M20 118 C20 80 21 50 20 22" stroke="#C88A2A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i}>
          <ellipse cx="14" cy={28 + i * 11} rx="5" ry="9" transform={`rotate(-28 14 ${28 + i * 11})`} fill="#E9B44C" stroke="#B9791F" strokeWidth="1" />
          <ellipse cx="26" cy={28 + i * 11} rx="5" ry="9" transform={`rotate(28 26 ${28 + i * 11})`} fill="#F2C462" stroke="#B9791F" strokeWidth="1" />
        </g>
      ))}
      <ellipse cx="20" cy="16" rx="5" ry="10" fill="#F2C462" stroke="#B9791F" strokeWidth="1" />
      <path d="M20 6 L20 -10 M14 10 L8 -6 M26 10 L32 -6" stroke="#D9A23E" strokeWidth="1" />
    </svg>
  );
}

export function Leaf({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const id = useId();
  return (
    <svg viewBox="0 0 80 50" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0" stopColor="#5FA22A" />
          <stop offset="1" stopColor="#2F6B12" />
        </linearGradient>
      </defs>
      <path d="M4 25 C20 2 60 2 76 25 C60 48 20 48 4 25Z" fill={`url(#${id})`} />
      <path d="M8 25 L72 25" stroke="#bfe28a" strokeWidth="1.6" opacity="0.7" />
    </svg>
  );
}

/** Chai cup with rising steam and a rusk that keeps dunking in. Animated via CSS (.cup-*). */
export function ChaiCup({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 220 240" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}c`} x1="0" x2="1">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="0.55" stopColor="#f3e6d2" />
          <stop offset="1" stopColor="#cdb497" />
        </linearGradient>
        <radialGradient id={`${id}t`} cx="0.4" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#d18b4a" />
          <stop offset="1" stopColor="#8a4a1c" />
        </radialGradient>
      </defs>
      <g className="cup-steam" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round">
        <path className="st st1" d="M78 92 C64 72 92 60 78 38" />
        <path className="st st2" d="M110 88 C96 64 124 52 110 26" />
        <path className="st st3" d="M142 92 C128 72 156 60 142 38" />
      </g>
      {/* tea surface (behind the rusk) */}
      <ellipse cx="110" cy="118" rx="74" ry="16" fill="#b9793d" />
      <ellipse cx="110" cy="120" rx="66" ry="12" fill={`url(#${id}t)`} />
      <g className="cup-rusk">
        <rect x="92" y="22" width="44" height="96" rx="9" fill="#B8641C" transform="rotate(14 114 70)" />
        <rect x="96" y="26" width="36" height="88" rx="7" fill="#EDAA52" transform="rotate(14 114 70)" />
        <rect x="96" y="80" width="36" height="34" rx="7" fill="#a5591a" opacity="0.7" transform="rotate(14 114 70)" />
      </g>
      {/* cup front */}
      <path d="M36 118 C36 196 64 226 110 226 C156 226 184 196 184 118 C170 132 50 132 36 118Z" fill={`url(#${id}c)`} />
      <path d="M182 140 C214 136 218 182 178 186" stroke="#e7d6be" strokeWidth="13" fill="none" strokeLinecap="round" />
      <path d="M56 150 C60 182 74 202 94 210" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M36 118 C50 132 170 132 184 118" stroke="#d9c4a6" strokeWidth="3" fill="none" />
      <ellipse cx="110" cy="232" rx="80" ry="7" fill="#5a2a0c" opacity="0.25" />
    </svg>
  );
}

export const propSets = {
  elaichi: [Cardamom, Rusk, Cardamom, Rusk, Cardamom, Leaf, Cardamom, Rusk],
  milk: [MilkDrop, Rusk, MilkDrop, Rusk, MilkDrop, Splash, MilkDrop, Rusk],
  jumbo: [Wheat, Rusk, Rusk, Rusk, Wheat, Rusk, Wheat, Rusk],
} as const;
