"use client";

import { createElement, useEffect, useRef, type ReactNode } from "react";

/** Adds the class "in" while the element is on screen (re-triggers each time). */
export function InView({
  as = "div",
  children,
  className = "",
  threshold = 0.35,
  ...rest
}: {
  as?: keyof React.JSX.IntrinsicElements;
  children: ReactNode;
  className?: string;
  threshold?: number;
  [k: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("in", e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return createElement(as, { ref, className, ...rest }, children);
}
