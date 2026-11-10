"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { nav, site, type Product } from "@/lib/site";

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`nav${open ? " open" : ""}${solid ? " solid" : ""}`}>
      <Link href="/" className="nav-logo" aria-label="Swaad home">
        <Image src="/logo.png" alt="Swaad" width={640} height={441} priority />
      </Link>
      <nav className="nav-links">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className={path === n.href ? "active" : ""}>
            {n.label}
          </Link>
        ))}
      </nav>
      <a className="nav-wa" href={site.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat with Swaad on WhatsApp">
        <svg viewBox="0 0 32 32" aria-hidden>
          <path
            fill="currentColor"
            d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.8 1.2 1.2-3.7-.3-.4a10.4 10.4 0 0 1-1.7-5.7C5.1 9.9 10 5.2 16 5.2s10.9 4.7 10.9 10.6S22 26.4 16 26.4zm6-7.9c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.8 5 .8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"
          />
        </svg>
        WhatsApp
      </a>
      <button className="nav-toggle" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span />
        <span />
      </button>
    </header>
  );
}

/** Fades content up when it scrolls into view. */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/** Product card that tilts in 3D under the pointer; the pack floats above the card. */
export function TiltCard({ product, href = "/products" }: { product: Product; href?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${-y * 14}deg`);
    el.style.setProperty("--ry", `${x * 18}deg`);
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };
  const leave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };
  return (
    <Link
      ref={ref}
      href={href}
      className="tilt"
      style={{ ["--c" as string]: product.color, color: product.ink }}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      <div className="tilt-inner">
        <span className="tilt-word">{product.short}</span>
        <Image src={product.image} alt={`Swaad ${product.name} pack`} width={product.w} height={product.h} sizes="(max-width: 760px) 80vw, 28vw" className="tilt-img" />
        <div className="tilt-meta">
          <h3>{product.name}</h3>
          <p>
            {product.weight} · {product.price}
          </p>
        </div>
      </div>
    </Link>
  );
}

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export function DistributorForm({ compact = false }: { compact?: boolean }) {
  const [f, setF] = useState({ name: "", phone: "", city: "", business: "Distributor", message: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<Field>) => setF({ ...f, [k]: e.target.value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Name: ${f.name}\nPhone: ${f.phone}\nCity / Area: ${f.city}\nBusiness type: ${f.business}\n\n${f.message}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      `Distributor enquiry - ${f.city || f.name}`
    )}&body=${encodeURIComponent(body)}`;
  };
  if (compact)
    return (
      <form className="form-inline" onSubmit={submit}>
        <input required placeholder="Your name" value={f.name} onChange={set("name")} autoComplete="name" aria-label="Your name" />
        <input required type="tel" placeholder="Mobile number" value={f.phone} onChange={set("phone")} autoComplete="tel" aria-label="Mobile number" />
        <input required placeholder="City" value={f.city} onChange={set("city")} aria-label="City" />
        <button className="btn btn-sun" type="submit">
          Send enquiry
        </button>
      </form>
    );
  return (
    <form className="form" onSubmit={submit}>
      <label>
        Your name
        <input required value={f.name} onChange={set("name")} autoComplete="name" />
      </label>
      <label>
        Mobile number
        <input required type="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" />
      </label>
      <label>
        City / Area
        <input required value={f.city} onChange={set("city")} />
      </label>
      <label>
        I am a
        <select value={f.business} onChange={set("business")}>
          <option>Distributor</option>
          <option>Wholesaler</option>
          <option>Retailer</option>
          <option>Other</option>
        </select>
      </label>
      <label className="wide">
        Message
        <textarea rows={4} value={f.message} onChange={set("message")} placeholder="Tell us about your area and current business" />
      </label>
      <div className="form-actions wide">
        <button className="btn" type="submit">
          Send enquiry by email
        </button>
        <a className="btn btn-ghost" href={site.whatsapp} target="_blank" rel="noopener noreferrer">
          Or chat on WhatsApp
        </a>
      </div>
    </form>
  );
}
