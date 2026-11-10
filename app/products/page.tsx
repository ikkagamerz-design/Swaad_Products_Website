import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui";
import FaqPanel from "@/components/FaqPanel";
import { products, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Range",
  description: "The Swaad rusk range for distributors: Elaichi Rusk 80gm ₹10, Milk Rusk 80gm ₹10, Jumbo Crunch (Gattu) Rusk 400gm ₹60.",
};

const FLAVOUR: Record<string, string> = {
  elaichi: "Cardamom (elaichi)",
  milk: "Milk",
  jumbo: "Milk, family pack",
};

export default function Products() {
  return (
    <>
      <section className="page-head">
        <p className="eyebrow">Our range · for distributors &amp; retailers</p>
        <h1>Three rusks, ready for your shelves.</h1>
        <p className="lede">
          Every pack is baked and packed by {site.company}, Pukhrayan. Check pack sizes and MRP below, then talk to us about
          distribution in your area.
        </p>
        <div className="glance">
          {products.map((p) => (
            <a key={p.id} href={`#${p.id}`} className="glance-item" style={{ background: p.color, color: p.ink }}>
              <Image src={p.image} alt="" width={p.w} height={p.h} sizes="80px" />
              <span>
                <b>{p.name}</b>
                {p.weight} · MRP {p.price}
              </span>
            </a>
          ))}
        </div>
      </section>

      {products.map((p, i) => (
        <section
          key={p.id}
          id={p.id}
          className={`product-row${i % 2 ? " flip" : ""}`}
          style={{ backgroundImage: `url(/art/scene-${p.id}.webp)` }}
        >
          <div className="product-img">
            <Image src={p.image} alt={`Swaad ${p.name} pack`} width={p.w} height={p.h} sizes="(max-width: 760px) 80vw, 40vw" />
          </div>
          <Reveal className="spec-card">
            <span className="spec-tag" style={{ background: p.color, color: p.ink }}>
              {p.tagline}
            </span>
            <h2>Swaad {p.name}</h2>
            <p className="spec-desc">{p.description}</p>
            <dl className="spec">
              <div>
                <dt>Pack size</dt>
                <dd>{p.weight}</dd>
              </div>
              <div>
                <dt>MRP</dt>
                <dd>{p.price}</dd>
              </div>
              <div>
                <dt>Flavour</dt>
                <dd>{FLAVOUR[p.id]}</dd>
              </div>
              <div>
                <dt>Shelf life</dt>
                <dd>4 months from packing</dd>
              </div>
            </dl>
            <p className="spec-note">{p.feature}</p>
            <div className="spec-actions">
              <a className="btn" href={site.whatsapp} target="_blank" rel="noopener noreferrer">
                Distribution enquiry
              </a>
              <Link className="btn btn-ghost" href="/become-distributor">
                Become a distributor
              </Link>
            </div>
          </Reveal>
        </section>
      ))}

      <FaqPanel />
    </>
  );
}
