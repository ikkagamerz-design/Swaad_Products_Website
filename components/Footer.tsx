import Link from "next/link";
import Image from "next/image";
import { nav, products, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <Image src="/logo.png" alt="Swaad" width={640} height={441} className="footer-logo" />
          <p className="footer-tag">Taste the Purity. Feel the Love.</p>
        </div>
        <div>
          <h4>Explore</h4>
          {nav.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </div>
        <div>
          <h4>Our rusks</h4>
          {products.map((p) => (
            <Link key={p.id} href="/products">
              {p.name}
            </Link>
          ))}
        </div>
        <div>
          <h4>Reach us</h4>
          <a href={site.customerCareHref}>Customer care: {site.customerCare}</a>
          <a href={site.phoneHref}>Tel: {site.phone}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <p className="footer-addr">
            {site.company}, {site.address.join(", ")}
          </p>
          <p className="footer-social">
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href={site.social.youtube} target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
          </p>
        </div>
      </div>
      <div className="footer-base">
        <span>
          © {new Date().getFullYear()} {site.company}
        </span>
        <span>FSSAI Lic. No. {site.fssai}</span>
        <span>Made in India</span>
      </div>
    </footer>
  );
}
