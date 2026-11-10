import Image from "next/image";
import { InView } from "@/components/home/InView";
import { Cardamom, MilkDrop, Rusk } from "@/components/home/Props";
import { products, site } from "@/lib/site";

const faqs = [
  ["How long do Swaad rusks stay fresh?", "Best before 4 months from the date of packing. Keep the pack closed, away from direct sunlight, in a cool and dry place."],
  ["Which flavours do you make?", "Elaichi Rusk (80gm, ₹10), Milk Rusk (80gm, ₹10) and the Jumbo Crunch (Gattu) family pack (400gm, ₹60)."],
  ["Where are they made?", `By ${site.company}, Bypass Road, Sapna Hospital, Patel Chauk, Pukhrayan, Kanpur Dehat (U.P.). FSSAI Lic. No. ${site.fssai}.`],
  ["Can I become a distributor or stockist?", "Yes. We are growing our network of distributors, wholesalers and retailers. Fill the form on our home page or call customer care and our team will call you back."],
  ["How do I give feedback?", `Call ${site.customerCare}, email ${site.email} or message us on WhatsApp. We read everything.`],
];

/** "Got questions?" panel: painted farm scene, glass FAQ list, elaichi pack. */
export default function FaqPanel() {
  return (
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
  );
}
