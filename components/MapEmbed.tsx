"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Google map centred on the factory with our own name tag sitting on the pin.
 * The map is kept static (re-centred on resize) so the tag always lines up with the pin;
 * clicking it opens Google Maps.
 */
export default function MapEmbed({ embed, link }: { embed: string; link: string }) {
  const [k, setK] = useState(0);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const on = () => {
      clearTimeout(t);
      t = setTimeout(() => setK((x) => x + 1), 300);
    };
    window.addEventListener("resize", on);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", on);
    };
  }, []);
  return (
    <div className="mapbox">
      <iframe key={k} className="mapsec-frame" src={embed} title="Swaad location on Google Maps" loading="lazy" referrerPolicy="no-referrer-when-downgrade" tabIndex={-1} />
      <a className="map-hit" href={link} target="_blank" rel="noopener noreferrer" aria-label="Open Swaad location in Google Maps" />
      <div className="map-tag" aria-hidden>
        <span className="map-tag-logo">
          <Image src="/logo.png" alt="" width={640} height={441} />
        </span>
        <span>
          <b>Swaad</b>
          <i>Mamta Food Products</i>
        </span>
      </div>
    </div>
  );
}
