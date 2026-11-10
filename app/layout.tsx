import type { Metadata, Viewport } from "next";
import { Archivo, Plus_Jakarta_Sans } from "next/font/google";
import { Nav } from "@/components/ui";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";
import "./globals.css";

const display = Archivo({ subsets: ["latin"], weight: ["800", "900"], variable: "--font-display" });
const body = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Swaad Rusk | Every Bite Pure Delight", template: "%s | Swaad" },
  description:
    "Swaad Elaichi Rusk, Milk Rusk and Jumbo Crunch Rusk: crispy, light toast baked by Mamta Food Products, Pukhrayan, Kanpur Dehat.",
  openGraph: { title: "Swaad Rusk", description: "Every Bite Pure Delight", images: ["/products/pack-1.png"] },
};

export const viewport: Viewport = { themeColor: "#FFD21F" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
