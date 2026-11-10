import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { Reveal } from "@/components/ui";
import { Cardamom, MilkDrop, Rusk } from "@/components/home/Props";
import { GmailLogo, IcHeart, IcPhone, IcShield, IcWheat, IcWhatsapp } from "@/components/icons";
import { products, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "The heart of Swaad: handmade rusk from the kitchens of Mamta Food Products, Pukhrayan, Kanpur Dehat.",
};

const promises = [
  { ic: IcShield, t: "Purity First", d: "No compromises on quality. Clean ingredients and a hygienic, FSSAI-licensed unit." },
  { ic: IcWheat, t: "Authentic Taste", d: "Honouring traditional recipes, so every slice tastes the way rusk is meant to." },
  { ic: IcHeart, t: "Handmade Excellence", d: "Keeping the human touch in every batch, the way a mother cooks for her family." },
];

export default function About() {
  const jumbo = products[2];
  return (
    <>
      <PageHero
        eyebrow="About Swaad"
        title={
          <>
            The heart of <span className="hl">Swaad</span>.
          </>
        }
        lede="Every crunch tells a story of tradition, purity and the warmth of a home-cooked memory."
      >
        <div className="ph-chips">
          <span>Handmade rusk</span>
          <span>FSSAI licensed</span>
          <span>Pukhrayan, Kanpur Dehat</span>
        </div>
      </PageHero>

      {/* our story */}
      <section className="ab-story scene scene-milk">
        <div className="wrap ab-story-grid">
          <Reveal className="ab-story-art">
            <div className="ab-frame" style={{ backgroundImage: "url(/art/scene-elaichi.webp)" }}>
              <Image src={products[0].image} alt="Swaad Elaichi Rusk pack" width={products[0].w} height={products[0].h} sizes="(max-width: 760px) 60vw, 26vw" />
              <Cardamom className="ab-fl ab-fl1" />
              <Rusk className="ab-fl ab-fl2" />
              <Cardamom className="ab-fl ab-fl3" />
            </div>
            <div className="ab-badge">
              <b>From the kitchens of</b>
              <span>{site.company}</span>
            </div>
          </Reveal>
          <Reveal className="ab-story-copy" delay={120}>
            <p className="eyebrow">Our story</p>
            <h2>Born in a kitchen, made for your tea table.</h2>
            <p>
              Swaad was born from the kitchens of {site.company}. Our mission is simple: to bring the authentic taste of
              traditional Indian rusk to your tea table.
            </p>
            <p>
              We believe snacking is not just about food. It is about a pause in the day, a hot cup of chai, and something
              made with genuine care. That is what every Swaad pack is for.
            </p>
          </Reveal>
        </div>
      </section>

      {/* crafted with mamta */}
      <section className="mamta">
        <MilkDrop className="mamta-fl m1" />
        <Rusk className="mamta-fl m2" />
        <div className="wrap mamta-grid">
          <Reveal className="mamta-copy">
            <p className="eyebrow">Crafted with &ldquo;Mamta&rdquo;</p>
            <h2>A mother&rsquo;s love, in every slice.</h2>
            <p>
              Our name and our process are what make Swaad different. In a world of mass-produced, machine-made snacks,
              our rusks are handmade, from our ₹10 everyday packs to our family packs.
            </p>
            <p>
              We combine traditional culture with modern hygiene, so every slice is toasted golden-brown and carries the
              &ldquo;Swaad&rdquo; you remember from childhood.
            </p>
            <blockquote>&ldquo;Mamta&rdquo; means a mother&rsquo;s love. That is the care we bake into every batch.</blockquote>
          </Reveal>
          <Reveal className="mamta-art" delay={120}>
            <div className="mamta-disc" />
            <Image src={jumbo.image} alt={`Swaad ${jumbo.name}`} width={jumbo.w} height={jumbo.h} sizes="(max-width: 760px) 70vw, 30vw" />
          </Reveal>
        </div>
      </section>

      {/* vision */}
      <section className="block scene scene-elaichi">
        <div className="wrap">
          <Reveal className="sec-head center">
            <p className="eyebrow">Our vision</p>
            <h2>From local roots to global tables.</h2>
            <p className="sec-sub">
              Our goal is to take Swaad from Pukhrayan to tea tables everywhere, and share the purity of Indian baking
              with the world. Three commitments guide every batch:
            </p>
          </Reveal>
          <div className="val-grid">
            {promises.map((v, i) => (
              <Reveal key={v.t} delay={i * 100} className="val-card">
                <span className="val-ic"><v.ic /></span>
                <h3>{v.t}</h3>
                <p>{v.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* range */}
      <section className="block scene scene-sky">
        <div className="wrap">
          <Reveal className="sec-head center">
            <p className="eyebrow">The Swaad family</p>
            <h2>Three rusks, one promise.</h2>
          </Reveal>
          <div className="range-grid">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <Link href={`/products#${p.id}`} className="range-card" style={{ ["--c" as string]: p.color, color: p.ink }}>
                  <div className="range-img">
                    <Image src={p.image} alt={`Swaad ${p.name}`} width={p.w} height={p.h} sizes="(max-width: 760px) 60vw, 22vw" />
                  </div>
                  <h3>{p.name}</h3>
                  <p>{p.tagline}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* transparency */}
      <section className="block scene scene-milk">
        <div className="wrap">
          <Reveal className="trust">
            <div className="trust-logo">
              <Image src="/logo.png" alt="Swaad" width={640} height={441} />
            </div>
            <div className="trust-body">
              <p className="eyebrow">Transparency &amp; trust</p>
              <h2>Built on honesty and quality.</h2>
              <p className="trust-sub">
                We are fully compliant with food-industry standards, so every pack is safe and every customer is satisfied.
              </p>
              <dl className="trust-list">
                <div><dt>Company name</dt><dd>{site.company}</dd></div>
                <div><dt>FSSAI License No.</dt><dd>{site.fssai}</dd></div>
                <div><dt>GST Number</dt><dd>{site.gst}</dd></div>
                <div><dt>Address</dt><dd>{site.address.join(", ")}</dd></div>
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* get in touch */}
      <section className="block scene scene-jumbo">
        <div className="wrap">
          <Reveal className="sec-head center">
            <p className="eyebrow">Get in touch</p>
            <h2>We&rsquo;d love to hear from you.</h2>
            <p className="sec-sub">Suggestions, bulk enquiries or tea-time feedback: reach us any way you like.</p>
          </Reveal>
          <div className="touch-grid">
            <a className="touch" href={site.customerCareHref}>
              <span className="touch-ic care"><IcPhone /></span>
              <span><i>Customer care</i><b>{site.customerCare}</b></span>
            </a>
            <a className="touch" href={site.phoneHref}>
              <span className="touch-ic tel"><IcPhone /></span>
              <span><i>Telephone</i><b>{site.phone}</b></span>
            </a>
            <a className="touch" href={`mailto:${site.email}`}>
              <span className="touch-ic mail"><GmailLogo /></span>
              <span><i>Email</i><b>{site.email}</b></span>
            </a>
            <a className="touch" href={site.whatsapp} target="_blank" rel="noopener noreferrer">
              <span className="touch-ic wa"><IcWhatsapp /></span>
              <span><i>WhatsApp</i><b>Chat with us</b></span>
            </a>
          </div>
        </div>
      </section>

      {/* closing */}
      <section className="band">
        <MilkDrop className="band-fl b1" />
        <Rusk className="band-fl b2" />
        <p className="eyebrow band-eyebrow">Swaad</p>
        <h2>Taste the purity. Feel the love.</h2>
        <p>Want Swaad in your area? Join our growing network of distributors and retailers.</p>
        <div className="band-actions">
          <Link href="/become-distributor" className="btn btn-sun">Become a distributor</Link>
          <a href={site.whatsapp} className="btn btn-wa" target="_blank" rel="noopener noreferrer">
            <IcWhatsapp className="btn-ic" /> WhatsApp us
          </a>
        </div>
      </section>
    </>
  );
}
