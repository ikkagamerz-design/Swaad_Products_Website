import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { Reveal } from "@/components/ui";
import { Cardamom, MilkDrop, Rusk } from "@/components/home/Props";
import { IcHeart, IcShield, IcWheat, IcWhatsapp } from "@/components/icons";
import { products, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "The story of Swaad rusk, baked by Mamta Food Products in Pukhrayan, Kanpur Dehat.",
};

const values = [
  { ic: IcShield, t: "Purity first", d: "Clean ingredients, FSSAI-licensed unit." },
  { ic: IcHeart, t: "Made with Mamta", d: "Home-kitchen care in every batch." },
  { ic: IcWheat, t: "Authentic taste", d: "Traditional recipe, golden crunch." },
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About Swaad"
        title={
          <>
            Baked with <span className="hl">Mamta</span>.
          </>
        }
        lede={`Swaad is the rusk brand of ${site.company}: crisp, golden toast baked in Pukhrayan for your everyday chai.`}
      />

      <section className="ab-story">
        <div className="wrap ab-story-grid">
          <Reveal className="ab-story-art">
            <div className="ab-frame" style={{ backgroundImage: "url(/art/scene-elaichi.webp)" }}>
              <Image src={products[0].image} alt="Swaad Elaichi Rusk pack" width={products[0].w} height={products[0].h} sizes="(max-width: 760px) 60vw, 26vw" />
              <Cardamom className="ab-fl ab-fl1" />
              <Rusk className="ab-fl ab-fl2" />
              <Cardamom className="ab-fl ab-fl3" />
            </div>
            <div className="ab-badge">
              <b>Baked in</b>
              <span>Pukhrayan, Kanpur Dehat</span>
            </div>
          </Reveal>
          <Reveal className="ab-story-copy" delay={120}>
            <p className="eyebrow">Our story</p>
            <h2>A chai-time habit, baked right.</h2>
            <p>
              Every home deserves a rusk that is crisp, fresh and honest. We bake ours the traditional way and pack it
              while it is at its crunchiest, in three flavours: Elaichi, Milk and Jumbo Crunch.
            </p>
            <blockquote>&ldquo;Mamta means a mother&rsquo;s love. That is the care we put into every pack.&rdquo;</blockquote>
            <div className="ab-values">
              {values.map((v) => (
                <div key={v.t} className="ab-val">
                  <span className="val-ic"><v.ic /></span>
                  <div>
                    <b>{v.t}</b>
                    <p>{v.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="band">
        <MilkDrop className="band-fl b1" />
        <Rusk className="band-fl b2" />
        <h2>Want Swaad in your area?</h2>
        <p>Join our growing network of distributors and retailers.</p>
        <div className="band-actions">
          <Link href="/become-distributor" className="btn btn-sun">Become a distributor</Link>
          <a href={site.whatsapp} className="btn btn-wa" target="_blank" rel="noopener noreferrer">
            <IcWhatsapp className="btn-ic" /> WhatsApp us
          </a>
        </div>
        <p className="band-legal">
          {site.company} · FSSAI Lic. No. {site.fssai} · GST {site.gst}
        </p>
      </section>
    </>
  );
}
