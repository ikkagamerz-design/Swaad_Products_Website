import Image from "next/image";
import FlavorPanel from "@/components/home/FlavorPanel";
import Stage from "@/components/home/Stage";
import FlavorRail from "@/components/home/FlavorRail";
import { InView } from "@/components/home/InView";
import { Cardamom, ChaiCup, MilkDrop, Rusk } from "@/components/home/Props";
import { DistributorForm } from "@/components/ui";
import { IcBox, IcCallback, IcFactory } from "@/components/icons";
import { homeProducts, products, site } from "@/lib/site";

const faqs = [
  ["How long do Swaad rusks stay fresh?", "Best before 4 months from the date of packing. Keep the pack closed, away from direct sunlight, in a cool and dry place."],
  ["Which flavours do you make?", "Elaichi Rusk (80gm, ₹10), Milk Rusk (80gm, ₹10) and the Jumbo Crunch (Gattu) family pack (400gm, ₹60)."],
  ["Where are they made?", `By ${site.company}, Bypass Road, Sapna Hospital, Patel Chauk, Pukhrayan, Kanpur Dehat (U.P.). FSSAI Lic. No. ${site.fssai}.`],
  ["Can I become a distributor or stockist?", "Yes. We are growing our network of distributors, wholesalers and retailers. Fill the form below or call customer care and our team will call you back."],
  ["How do I give feedback?", `Call ${site.customerCare}, email ${site.email} or message us on WhatsApp. We read everything.`],
];

export default function Home() {
  return (
    <div className="home">
      <FlavorRail />

      {/* top hero: "Made for chai" */}
      <InView as="section" className="river river-top" data-flavor="milk" aria-label="Swaad rusk" threshold={0.2}>
        <div className="river-bg" />
        <div className="river-rays" aria-hidden />
        <h1 className="river-title">
          {["Every", "bite,"].map((w, i) => (
            <span key={w} style={{ ["--d" as string]: i }}>{w}&nbsp;</span>
          ))}
          <br />
          {["pure", "delight."].map((w, i) => (
            <span key={w} className="hl" style={{ ["--d" as string]: i + 2 }}>{w}&nbsp;</span>
          ))}
        </h1>
        <div className="river-row">
          {products.map((p, i) => (
            <div key={p.id} className="river-item" style={{ ["--i" as string]: i }}>
              <Image src={p.image} alt={`Swaad ${p.name}`} width={p.w} height={p.h} sizes="(max-width: 760px) 30vw, 22vw" />
            </div>
          ))}
        </div>
        <ChaiCup className="river-cup" />
        <Rusk className="rv-prop rv1" />
        <Cardamom className="rv-prop rv2" />
        <MilkDrop className="rv-prop rv3" />
        <div className="river-ribbon" aria-hidden>
          <div className="run-track">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i}>
                Baked fresh in Pukhrayan ✦ Crispy &amp; light in every bite ✦ The perfect partner for hot chai ✦
                Elaichi · Milk · Jumbo Crunch ✦ Everyday packs at just ₹10 ✦&nbsp;
              </span>
            ))}
          </div>
        </div>
      </InView>

      {homeProducts.map((p) => (
        <FlavorPanel key={p.id} p={p} />
      ))}

      <Stage />

      {/* questions: painted farm scene, like the flavour panels */}
      <InView as="section" className="pnl pnl-faq" data-flavor="elaichi" threshold={0.2}>
        <div className="run" aria-hidden>
          <div className="run-track">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i}>QUESTIONS&nbsp;·&nbsp;</span>
            ))}
          </div>
        </div>
        <Rusk className="pf pf1" />
        <Cardamom className="pf pf2" />
        <MilkDrop className="pf pf3" />
        <Cardamom className="pf pf4" />
        <div className="wrap pnl-grid">
          <div className="pnl-side">
            <p className="eyebrow">Good to know</p>
            <h2>Got questions?</h2>
            <p className="pnl-sub">Everything about freshness, flavours and becoming a distributor.</p>
            <div className="pnl-pack">
              <Image src={products[0].image} alt="Swaad Elaichi Rusk" width={products[0].w} height={products[0].h} sizes="(max-width: 760px) 40vw, 18vw" />
            </div>
          </div>
          <div className="glass faq-list">
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </InView>

      {/* distributor: painted wheat scene */}
      <InView as="section" className="pnl pnl-cta" id="distributor" data-flavor="jumbo" threshold={0.2}>
        <div className="run" aria-hidden>
          <div className="run-track">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i}>DISTRIBUTOR&nbsp;·&nbsp;</span>
            ))}
          </div>
        </div>
        <Rusk className="pf pf1" />
        <Rusk className="pf pf5" />
        <Cardamom className="pf pf2" />
        <MilkDrop className="pf pf3" />
        <div className="wrap pnl-grid">
          <div className="pnl-packs" aria-hidden>
            <Image className="pp pp-a" src={products[1].image} alt="" width={products[1].w} height={products[1].h} sizes="(max-width: 760px) 30vw, 14vw" />
            <Image className="pp pp-b" src={products[2].image} alt="" width={products[2].w} height={products[2].h} sizes="(max-width: 760px) 40vw, 20vw" />
            <Image className="pp pp-c" src={products[0].image} alt="" width={products[0].w} height={products[0].h} sizes="(max-width: 760px) 30vw, 14vw" />
          </div>
          <div className="cta-copy">
            <p className="eyebrow">For distributors &amp; wholesalers</p>
            <h2>Become a Swaad distributor.</h2>
            <div className="cta-perks">
              <div className="perk">
                <span className="perk-ic"><IcFactory /></span>
                <div>
                  <b>Direct from the bakery</b>
                  <p>Supplied straight from our unit in Pukhrayan, Kanpur Dehat.</p>
                </div>
              </div>
              <div className="perk">
                <span className="perk-ic"><IcBox /></span>
                <div>
                  <b>Carton supply</b>
                  <p>Packed in sturdy cartons, easy to stock and deliver.</p>
                </div>
              </div>
              <div className="perk">
                <span className="perk-ic"><IcCallback /></span>
                <div>
                  <b>Quick call-back</b>
                  <p>Share your details and our team will call you.</p>
                </div>
              </div>
            </div>
            <div className="glass cta-form">
              <DistributorForm compact />
              <p className="cta-alt">
                Or call <a href={site.customerCareHref}>{site.customerCare}</a> ·{" "}
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp us
                </a>
              </p>
            </div>
          </div>
        </div>
      </InView>
    </div>
  );
}
