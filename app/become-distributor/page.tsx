import type { Metadata } from "next";
import { DistributorForm, Reveal } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Become a Distributor",
  description: "Partner with Swaad as a distributor, wholesaler or retailer.",
};

export default function Distributor() {
  return (
    <>
      <section className="page-head">
        <p className="eyebrow">Become a distributor</p>
        <h1>Grow with Swaad.</h1>
        <p className="lede">Tell us where you are and what you do. Our team will call you back.</p>
      </section>
      <section className="block cream">
        <div className="wrap two-col">
          <Reveal>
            <DistributorForm />
          </Reveal>
          <Reveal delay={120}>
            <h2>Prefer to call?</h2>
            <p>
              <a className="link" href={site.customerCareHref}>
                {site.customerCare}
              </a>
              <br />
              <a className="link" href={site.phoneHref}>
                {site.phone}
              </a>
            </p>
            <h2>Our range</h2>
            <ul className="ticks">
              <li>
                <b>Elaichi Rusk.</b> 80gm, MRP ₹10.
              </li>
              <li>
                <b>Milk Rusk.</b> 80gm, MRP ₹10.
              </li>
              <li>
                <b>Jumbo Crunch (Gattu) Rusk.</b> 400gm, MRP ₹60.
              </li>
            </ul>
            <p className="muted">
              FSSAI Lic. No. {site.fssai} · GST {site.gst}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
