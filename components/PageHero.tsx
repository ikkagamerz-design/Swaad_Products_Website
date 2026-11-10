import Image from "next/image";
import type { ReactNode } from "react";
import { products } from "@/lib/site";
import { Cardamom, MilkDrop, Rusk } from "@/components/home/Props";

/** Inner-page hero: warm farm scene, title on the left, fanned packs (or custom art) on the right. */
export default function PageHero({
  eyebrow,
  title,
  lede,
  children,
  art,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  art?: ReactNode;
}) {
  return (
    <section className="ph">
      <div className="ph-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
      <div className="ph-art" aria-hidden>
        {art ?? (
          <div className="ph-fan">
            {products.map((p, i) => (
              <div key={p.id} className={`ph-pack ph-pack-${i}`}>
                <Image src={p.image} alt="" width={p.w} height={p.h} priority sizes="(max-width: 760px) 34vw, 18vw" />
              </div>
            ))}
          </div>
        )}
        <Rusk className="ph-fl ph-fl1" />
        <Cardamom className="ph-fl ph-fl2" />
        <MilkDrop className="ph-fl ph-fl3" />
      </div>
    </section>
  );
}
