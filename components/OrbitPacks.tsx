import Image from "next/image";
import Link from "next/link";
import { homeProducts as products } from "@/lib/site";

/** Three clean product tiles side by side: pack on its flavour colour, name underneath. */
export default function OrbitPacks() {
  return (
    <div className="shelf">
      {products.map((p) => (
        <Link key={p.id} href={`/products#${p.id}`} className="shelf-card">
          <div className="shelf-img">
            <Image src={p.image} alt={`Swaad ${p.name}`} width={p.w} height={p.h} sizes="(max-width: 760px) 30vw, 160px" />
          </div>
          <b>{p.name}</b>
        </Link>
      ))}
    </div>
  );
}
