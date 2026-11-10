import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import OrbitPacks from "@/components/OrbitPacks";
import MapEmbed from "@/components/MapEmbed";
import { Reveal } from "@/components/ui";
import { ChaiCup, Rusk } from "@/components/home/Props";
import { GmailLogo, IcArrow, IcFacebook, IcInstagram, IcPhone, IcPin, IcWhatsapp, IcYoutube } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call, WhatsApp or email Swaad (Mamta Food Products), Pukhrayan, Kanpur Dehat.",
};

// Exact factory pin shared by the owner (maps.app.goo.gl/zmZL1yWh4axJ31cy6).
const LATLNG = "26.238142,79.849023";
const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${LATLNG}`;
const mapEmbed = `https://www.google.com/maps?q=${LATLNG}&z=17&output=embed`;

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title={
          <>
            Let&rsquo;s talk over <span className="hl">chai</span>.
          </>
        }
        lede="Bulk orders, distribution, feedback or just a hello. Call, WhatsApp or write to us."
        art={<ChaiCup className="ph-cup" />}
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

      {/* bento of ways to reach us */}
      <section className="block scene scene-elaichi">
        <div className="wrap">
          <Reveal className="sec-head">
            <p className="eyebrow">Reach us your way</p>
            <h2>One call, one chat, one cup away.</h2>
          </Reveal>
          <div className="bento">
            {/* customer care: ringing handset */}
            <Reveal className="bx bx-care">
              <a href={site.customerCareHref}>
                <div className="bx-text">
                  <span className="bx-ic"><IcPhone /></span>
                  <span className="bx-label">Customer care</span>
                  <strong className="bx-num">{site.customerCare}</strong>
                  <span className="bx-note">Orders, feedback &amp; distribution</span>
                  <span className="bx-btn">Call now <IcArrow /></span>
                </div>
                <div className="bx-art ring" aria-hidden>
                  <span className="ring-wave" />
                  <span className="ring-wave w2" />
                  <span className="ring-core"><IcPhone /></span>
                  <Rusk className="ring-rusk" />
                </div>
              </a>
            </Reveal>

            {/* whatsapp: chat preview */}
            <Reveal className="bx bx-wa" delay={80}>
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
                <div className="bx-text">
                  <span className="bx-ic"><IcWhatsapp /></span>
                  <span className="bx-label">WhatsApp</span>
                  <strong>Chat with Swaad</strong>
                  <span className="bx-note">Message us any time</span>
                  <span className="bx-btn">Open chat <IcArrow /></span>
                </div>
                <div className="bx-art chat" aria-hidden>
                  <div className="chat-head">
                    <span className="chat-av"><Image src="/logo.png" alt="" width={640} height={441} /></span>
                    <span><b>Swaad</b><i>online</i></span>
                  </div>
                  <p className="bub in">Hi! I want to stock Swaad rusk in my shop.</p>
                  <p className="bub out">Great! Please share your city and we will call you. <em>✓✓</em></p>
                  <p className="bub typing"><span /><span /><span /></p>
                </div>
              </a>
            </Reveal>

            {/* telephone: calling screen */}
            <Reveal className="bx bx-phone" delay={160}>
              <a href={site.phoneHref}>
                <div className="bx-text">
                  <span className="bx-ic"><IcPhone /></span>
                  <span className="bx-label">Telephone</span>
                  <strong className="bx-num">{site.phone}</strong>
                  <span className="bx-note">Office line</span>
                  <span className="bx-btn">Call <IcArrow /></span>
                </div>
                <div className="bx-art phone" aria-hidden>
                  <span className="ph-notch" />
                  <span className="ph-status"><i>9:41</i><i>● ● ●</i></span>
                  <span className="cs-av"><Image src="/logo.png" alt="" width={640} height={441} /></span>
                  <b>Swaad Official</b>
                  <i className="cs-sub">calling…</i>
                  <span className="cs-tools">
                    <span><em>🔇</em>mute</span>
                    <span><em>⌨</em>keypad</span>
                    <span><em>🔊</em>speaker</span>
                  </span>
                  <span className="cs-btns">
                    <span className="end"><IcPhone /></span>
                    <span className="ok"><IcPhone /></span>
                  </span>
                </div>
              </a>
            </Reveal>

            {/* email: open envelope with a letter */}
            <Reveal className="bx bx-mail" delay={240}>
              <a href={`mailto:${site.email}`}>
                <div className="bx-text">
                  <span className="bx-ic"><GmailLogo /></span>
                  <span className="bx-label">Gmail</span>
                  <strong className="bx-mailid">{site.email}</strong>
                  <span className="bx-note">Enquiries, quotes &amp; documents</span>
                  <span className="bx-btn">Write to us <IcArrow /></span>
                </div>
                <div className="bx-art gm" aria-hidden>
                  <div className="gm-head">
                    New message <span>_ ▢ ✕</span>
                  </div>
                  <div className="gm-row"><i>To</i> {site.email}</div>
                  <div className="gm-row"><i>Subject</i> Distribution enquiry</div>
                  <div className="gm-body">
                    <span className="l1" />
                    <span className="l2" />
                    <span className="l3" />
                  </div>
                  <div className="gm-foot">
                    <span className="gm-send">Send</span>
                    <GmailLogo className="gm-logo" />
                  </div>
                </div>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* map with our pin */}
      <section className="mapsec">
        <MapEmbed embed={mapEmbed} link={`https://www.google.com/maps/search/?api=1&query=${LATLNG}`} />
        <div className="wrap mapsec-wrap">
          <Reveal className="map-card">
            <div className="map-card-top">
              <span className="map-pin"><IcPin /></span>
              <div>
                <p className="eyebrow">Find us here</p>
                <h2>{site.company}</h2>
              </div>
            </div>
            <address>
              {site.address.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <p className="map-hint">Landmark: Sapna Hospital, near Patel Chauk on the Kanpur–Jhansi bypass.</p>
            <a className="btn btn-sun" href={mapUrl} target="_blank" rel="noopener noreferrer">
              <IcPin className="btn-ic" /> Get directions
            </a>
          </Reveal>
        </div>
      </section>

      {/* message */}
      <section className="block scene scene-milk">
        <div className="wrap msg-grid">
          <Reveal className="msg-copy">
            <p className="eyebrow">Send a message</p>
            <h2>We read every message.</h2>
            <p>Tell us what you need and leave your number. Our team will get back to you.</p>
            <div className="socials">
              <span>Follow Swaad</span>
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><IcInstagram /></a>
              <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><IcFacebook /></a>
              <a href={site.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><IcYoutube /></a>
            </div>
          </Reveal>
          <Reveal className="cx-card" delay={120}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <section className="cx-range">
        <div className="wrap cx-range-row">
          <div>
            <p className="eyebrow">Looking to stock Swaad?</p>
            <h2>Three rusks, ready for your shelves.</h2>
            <Link href="/become-distributor" className="btn btn-sun">Become a distributor</Link>
          </div>
          <OrbitPacks />
        </div>
      </section>
    </>
  );
}
