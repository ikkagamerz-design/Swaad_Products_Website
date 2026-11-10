export const site = {
  name: "Swaad",
  company: "Mamta Food Products",
  tagline: "Every Bite Pure Delight",
  url: "https://www.swaadproducts.com",
  customerCare: "+91 83033 88614",
  customerCareHref: "tel:+918303388614",
  phone: "+91 80909 48179",
  phoneHref: "tel:+918090948179",
  email: "swaad.officials@gmail.com",
  whatsapp: "https://wa.me/message/CAQ26T534G2ME1",
  /** website forms send their filled-in message to this WhatsApp number */
  formWhatsapp: "918303388614",
  address: ["Bypass Road, Sapna Hospital", "Patel Chauk, Pukhrayan", "Kanpur Dehat (U.P.) - 209111"],
  fssai: "12725046000066",
  gst: "09MOXPS5131P2ZH",
  social: {
    facebook: "https://www.facebook.com/swaadproducts",
    instagram: "https://www.instagram.com/swaad_products",
    youtube: "https://www.youtube.com/@Swaad_Products",
  },
};

/** Opens WhatsApp (app on phones, WhatsApp Web on desktop) with `text` ready to send to our form number. */
export function sendToWhatsapp(text: string) {
  const url = `https://wa.me/${site.formWhatsapp}?text=${encodeURIComponent(text)}`;
  const w = window.open(url, "_blank"); // null when a popup blocker steps in
  if (w) w.opener = null;
  else window.location.href = url;
}

export type Product = {
  id: "elaichi" | "milk" | "jumbo";
  name: string;
  short: string;
  tagline: string;
  price: string;
  weight: string;
  feature: string;
  description: string;
  image: string;
  /** pixel size of `image` */
  w: number;
  h: number;
  /** background colour for this product's scenes */
  color: string;
  /** text colour that reads on `color` */
  ink: string;
};

export const products: Product[] = [
  {
    id: "elaichi",
    name: "Elaichi Rusk",
    short: "Elaichi",
    tagline: "Every Bite Pure Delight",
    price: "₹10",
    weight: "80gm",
    feature: "Crisp and light, perfect for tea time.",
    description: "A deliciously crunchy premium toast for every occasion, with the warm aroma of cardamom.",
    image: "/products/pack-1.webp",
    w: 895,
    h: 1400,
    color: "#C9DA2B",
    ink: "#1F2A07",
  },
  {
    id: "milk",
    name: "Milk Rusk",
    short: "Milk",
    tagline: "Crispy & Light Toast",
    price: "₹10",
    weight: "80gm",
    feature: "Rich milk flavor with a crunchy texture.",
    description: "The rich taste of milk, beautifully baked into crispy rusks.",
    image: "/products/pack-2.webp",
    w: 895,
    h: 1400,
    color: "#1A8FE3",
    ink: "#FFFFFF",
  },
  {
    id: "jumbo",
    name: "Jumbo Crunch (Gattu) Rusk",
    short: "Jumbo",
    tagline: "Crunchy & Light Toast",
    price: "₹60",
    weight: "400gm",
    feature: "Crispy with a mild, soothing taste.",
    description: "Big, golden milk rusk in a family pack. A crisp toast baked with precision for great taste.",
    image: "/products/pack-3.webp",
    w: 1212,
    h: 1400,
    color: "#F26A12",
    ink: "#FFFFFF",
  },
];

/** Order used for the home-page flavour panels, rail and stage (milk first). */
export const homeProducts: Product[] = ["milk", "elaichi", "jumbo"].map((id) => products.find((p) => p.id === id)!);

export const ingredients =
  "Refined wheat flour, sugar, edible hydrogenated / vegetable oils, yeast, iodised salt, spices, emulsifier [471], flour improvers [510, 923, 1100], anti-oxidants [300]. Contains added natural and nature-identical flavours.";

export const nutrition: [string, string][] = [
  ["Energy", "448.5 kcal"],
  ["Protein", "5.7 g"],
  ["Carbohydrate", "74.3 g"],
  ["of which sugar", "19.5 g"],
  ["Total fat", "20.0 g"],
  ["Cholesterol", "0.0 mg"],
];

export const nav = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/become-distributor", label: "Distributors" },
  { href: "/contact", label: "Contact" },
];
