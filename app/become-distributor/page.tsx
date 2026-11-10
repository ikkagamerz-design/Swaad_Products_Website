import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CartonShow from "@/components/Carton";
import { Reveal } from "@/components/ui";
import { IcPhone, IcWhatsapp } from "@/components/icons";
import { homeProducts, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Become a Distributor",
  description:
    "Become a Swaad distributor. One carton holds 24 Elaichi Rusk, 24 Milk Rusk or 20 Jumbo Crunch packs. Call or WhatsApp to discuss pricing.",
};

const PER_CARTON: Record<string, number> = { milk: 24, elaichi: 24, jumbo: 20 };
const LABEL: Record<string, string> = { milk: "Milk Rusk", elaichi: "Elaichi Rusk", jumbo: "Jumbo Crunch" };
const FLAVOUR: Record<string, string> = { milk: "Milk", elaichi: "Elaichi", jumbo: "Jumbo" };

export default function Distributor() {
  return (
    <>
      <PageHero
        eyebrow="For distributors & wholesalers"
        title={
          <>
            Grow with <span className="hl">Swaad</span>.
          </>
        }
        lede="We supply distributors by the carton, direct from our bakery in Pukhrayan. See what comes in each carton below."
      >
        <div className="ph-actions">
          <a className="btn" href={site.customerCareHref}>
            <IcPhone className="btn-ic" /> {site.customerCare}
          </a>
          <a className="btn btn-wa" href={site.whatsapp} target="_blank" rel="noopener noreferrer">
            <IcWhatsapp className="btn-ic" /> WhatsApp
          </a>
        </div>
      </PageHero>

      <section className="cartons-sec" id="cartons">
        <div className="wrap">
          <div className="cartons-head">
            <p className="eyebrow">What you get</p>
            <h2>One carton, full of Swaad.</h2>
          </div>
          <CartonShow
            items={homeProducts.map((p) => ({ p, count: PER_CARTON[p.id], label: LABEL[p.id], flavour: FLAVOUR[p.id] }))}
          />
        </div>
      </section>

      <section className="price-talk">
        <div className="wrap price-grid">
          <Reveal className="price-copy">
            <p className="eyebrow">Pricing</p>
            <h2>Your price depends on your order.</h2>
            <p>
              Carton rates change with how many cartons you take. Call us or message on WhatsApp and we will work out the
              best price for your order.
            </p>
          </Reveal>
          <Reveal className="price-actions" delay={120}>
            <a className="touch" href={site.customerCareHref}>
              <span className="touch-ic care"><IcPhone /></span>
              <span><i>Customer care</i><b>{site.customerCare}</b></span>
            </a>
            <a className="touch" href={site.phoneHref}>
              <span className="touch-ic tel"><IcPhone /></span>
              <span><i>Telephone</i><b>{site.phone}</b></span>
            </a>
            <a className="touch" href={site.whatsapp} target="_blank" rel="noopener noreferrer">
              <span className="touch-ic wa"><IcWhatsapp /></span>
              <span><i>WhatsApp</i><b>Chat about pricing</b></span>
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
