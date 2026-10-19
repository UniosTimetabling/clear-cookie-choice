import hero from "@/assets/hero.jpg";
import curtains from "@/assets/curtains.jpg";
import carpets from "@/assets/carpets.jpg";
import blinds from "@/assets/blinds.jpg";
import curtainsCream from "@/assets/curtains-cream.jpg";
import curtainsNavy from "@/assets/curtains-navy.jpg";
import carpetGrey from "@/assets/carpet-grey.jpg";
import carpetCharcoal from "@/assets/carpet-charcoal.jpg";

export const site = {
  name: "Hope & HomeKe",
  phone: "+254 739 516 641",
  phoneAlt: "+254 119 126 551",
  whatsapp: "254739516641",
  email: "info@hopehomeke.com",
  location: "Nairobi, Kenya",
};

export const images = { hero, curtains, carpets, blinds };

export type Product = {
  slug: string; name: string; category: string; price: number; oldPrice?: number;
  image: string; rating: number; unit?: string; description: string; tag?: string;
};

export const categories = ["Curtains", "Carpets", "Blinds", "Flooring", "Bedding", "Outdoor"];

export const products: Product[] = [
  { slug: "olive-velvet-curtains", name: "Olive Velvet Curtains", category: "Curtains", price: 4500, oldPrice: 5200, image: curtains, rating: 4.9, unit: "per metre", tag: "Bestseller", description: "Heavy velvet drapes with a rich drape and excellent light control. Custom made to your window size." },
  { slug: "sheer-linen-curtains", name: "Sheer Linen Curtains", category: "Curtains", price: 1800, image: curtains, rating: 4.7, unit: "per metre", description: "Airy linen-look sheers that soften daylight while keeping your room bright." },
  { slug: "wall-to-wall-carpet", name: "Wall-to-Wall Carpet", category: "Carpets", price: 1200, image: carpets, rating: 4.8, unit: "per sqm", tag: "Popular", description: "Plush, durable carpet fitted edge to edge by our installation team." },
  { slug: "grass-carpet-35mm", name: "Grass Carpet 35mm", category: "Outdoor", price: 950, oldPrice: 1100, image: carpets, rating: 4.8, unit: "per sqm", description: "Soft, UV-resistant artificial grass for balconies, gardens and play areas." },
  { slug: "3d-carpet", name: "3D Printed Carpet", category: "Carpets", price: 6500, image: hero, rating: 4.6, unit: "each", tag: "New", description: "Statement 3D-effect carpets that bring depth and colour to living rooms." },
  { slug: "roller-blinds", name: "Roller Blinds", category: "Blinds", price: 3500, image: blinds, rating: 4.8, unit: "per sqm", description: "Clean, modern blinds in blackout and sunscreen fabrics. Ideal for offices." },
  { slug: "vertical-blinds", name: "Vertical Blinds", category: "Blinds", price: 2800, image: blinds, rating: 4.5, unit: "per sqm", description: "Classic vertical slats for large windows and sliding doors." },
  { slug: "laminate-flooring", name: "Laminate Flooring", category: "Flooring", price: 1600, image: blinds, rating: 4.7, unit: "per sqm", description: "Warm wood-effect laminate that is scratch resistant and easy to clean." },
  { slug: "mkeka-ya-mbao", name: "Mkeka ya Mbao", category: "Flooring", price: 850, image: hero, rating: 4.6, unit: "per sqm", description: "Affordable wooden-look vinyl flooring, a Kenyan favourite." },
  { slug: "premium-duvet-set", name: "Premium Duvet Set", category: "Bedding", price: 5500, oldPrice: 6800, image: curtains, rating: 4.9, unit: "set", tag: "Sale", description: "Soft duvet with matching bedsheets and pillowcases." },
  { slug: "mattress-protector", name: "Waterproof Mattress Protector", category: "Bedding", price: 2200, image: curtains, rating: 4.7, unit: "each", description: "Breathable, waterproof cover that keeps your mattress fresh." },
  { slug: "privacy-fence", name: "Privacy Fence Roll", category: "Outdoor", price: 1400, image: carpets, rating: 4.5, unit: "per metre", description: "Green privacy screening for balconies, gates and compounds." },
];

export const services = [
  { title: "Measurement & Consultation", text: "Free on-site assessment and precise measurement for a perfect fit.", price: "Free", time: "1–2 hours", points: ["Free initial consultation", "Precision measurement", "Design recommendations", "Material guidance"] },
  { title: "Carpet Installation", text: "Wall-to-wall, 3D and grass carpets fitted with guaranteed workmanship.", price: "KSh 500 – 2,000 / sqm", time: "1–2 days · 2-year warranty", points: ["Sub-floor preparation", "Precision cutting", "Seamless fitting", "Post-install cleaning"] },
  { title: "Window Treatments", text: "Curtains, blinds and window films for privacy, light control and style.", price: "KSh 3,000 – 15,000", time: "3–5 hours · 1-year warranty", points: ["Rods & tracks", "Roller & vertical blinds", "Window films", "Motorised options"] },
  { title: "Privacy Fence Installation", text: "Durable privacy screens for homes, balconies and commercial compounds.", price: "From KSh 1,400 / m", time: "1 day", points: ["Site survey", "Secure fixing", "Weather resistant", "Neat finishing"] },
  { title: "Flooring Installation", text: "Laminate and mkeka ya mbao laid flat, tight and built to last.", price: "KSh 400 – 1,200 / sqm", time: "1–3 days", points: ["Levelling", "Underlay", "Skirting", "Clean-up"] },
  { title: "Interior Styling", text: "Full room styling for homes, Airbnbs, offices and hospitality spaces.", price: "Quoted per project", time: "Varies", points: ["Concept boards", "Sourcing", "Installation", "Final styling"] },
];

export const testimonials = [
  { name: "Wanjiru M.", place: "Kilimani", text: "They measured, advised and fitted our curtains in one week. The living room feels brand new.", rating: 5 },
  { name: "Brian O.", place: "Westlands office", text: "Roller blinds for the whole office, installed over a weekend. Professional and tidy team.", rating: 5 },
  { name: "Aisha K.", place: "Airbnb host, Kileleshwa", text: "My guests always mention the décor now. Bookings went up after the makeover.", rating: 5 },
  { name: "Peter N.", place: "Syokimau", text: "Grass carpet on the balcony looks so real. Great price and quick delivery.", rating: 4 },
  { name: "Grace W.", place: "Runda", text: "Wall-to-wall carpet fitted perfectly, not a single seam showing. Highly recommend.", rating: 5 },
  { name: "Daniel M.", place: "Karen", text: "Honest quote, no hidden costs and they finished ahead of schedule.", rating: 5 },
];

export const posts = [
  { slug: "living-room-curtain-guide", title: "How to Choose Curtains for Your Living Room", topic: "Living Room", read: 5, image: curtains, excerpt: "Fabric, length and colour — the simple rules that make any window look expensive." },
  { slug: "grass-carpet-balcony", title: "Turning a Small Balcony into a Green Retreat", topic: "Design Trends", read: 4, image: carpets, excerpt: "Grass carpet, privacy screens and a few plants can transform a city balcony." },
  { slug: "airbnb-styling-tips", title: "7 Airbnb Styling Tips That Earn Better Reviews", topic: "Airbnb Styling", read: 6, image: hero, excerpt: "What guests notice first, and the affordable upgrades that pay for themselves." },
  { slug: "office-blinds", title: "Roller vs Vertical Blinds for the Office", topic: "Design Trends", read: 4, image: blinds, excerpt: "A practical comparison of light control, cleaning and cost." },
  { slug: "cosy-bedroom", title: "Layering Textures for a Cosy Bedroom", topic: "Bedroom", read: 5, image: curtains, excerpt: "Duvets, throws and drapes that make a bedroom feel like a hotel suite." },
  { slug: "warm-neutrals", title: "Warm Neutrals: The Colour Trend of the Year", topic: "Living Room", read: 3, image: hero, excerpt: "Terracotta, sand and olive are replacing cold greys in Nairobi homes." },
];

export const ksh = (n: number) => `KSh ${n.toLocaleString("en-KE")}`;

export type ProductOptions = { colors: string[]; sizes: string[] };
const optionsByCategory: Record<string, ProductOptions> = {
  Curtains: { colors: ["Olive", "Cream", "Grey", "Navy"], sizes: ["1.5m drop", "2.4m drop", "2.8m drop", "Custom"] },
  Carpets: { colors: ["Beige", "Grey", "Charcoal", "Brown"], sizes: ["160×230cm", "200×300cm", "Custom fit"] },
  Blinds: { colors: ["White", "Grey", "Black", "Beige"], sizes: ["Small (up to 1sqm)", "Medium (1–2sqm)", "Large (2sqm+)"] },
  Flooring: { colors: ["Oak", "Walnut", "Grey ash"], sizes: [] },
  Bedding: { colors: ["White", "Grey", "Navy", "Blush"], sizes: ["4×6", "5×6", "6×6", "7×7"] },
  Outdoor: { colors: ["Green", "Two-tone green"], sizes: ["25mm", "35mm", "40mm"] },
};
export function productOptions(p: { category: string }): ProductOptions {
  return optionsByCategory[p.category] ?? { colors: [], sizes: [] };
}
export function hasOptions(p: { category: string }) {
  const o = productOptions(p);
  return o.colors.length > 0 || o.sizes.length > 0;
}

/** Photo for each colour option (falls back to the product's main photo). */
const colorImages: Record<string, Record<string, string>> = {
  Curtains: { Olive: curtains, Cream: curtainsCream, Navy: curtainsNavy, Grey: curtainsCream },
  Carpets: { Beige: carpets, Grey: carpetGrey, Charcoal: carpetCharcoal, Brown: carpets },
};
/** Price adjustment per size option (multiplier on the base price). */
const sizeFactor: Record<string, Record<string, number>> = {
  Curtains: { "2.4m drop": 1.3, "2.8m drop": 1.5 },
  Carpets: { "200×300cm": 1.6 },
  Blinds: { "Medium (1–2sqm)": 1.8, "Large (2sqm+)": 2.6 },
  Bedding: { "5×6": 1.15, "6×6": 1.3, "7×7": 1.5 },
  Outdoor: { "35mm": 1.2, "40mm": 1.4 },
};

export type Variant = { id: string; color?: string | undefined; size?: string | undefined; label: string; image: string; price: number };

/** Resolve the variant for a colour/size choice: its own photo, price and label. */
export function resolveVariant(p: Product, sel: { color?: string | undefined; size?: string | undefined } = {}): Variant {
  const image = (sel.color && colorImages[p.category]?.[sel.color]) || p.image;
  const factor = (sel.size && sizeFactor[p.category]?.[sel.size]) || 1;
  const label = [sel.color, sel.size].filter(Boolean).join(" / ");
  return { id: [p.slug, sel.color ?? "", sel.size ?? ""].join("|"), color: sel.color, size: sel.size, label, image, price: Math.round((p.price * factor) / 10) * 10 };
}

/** Distinct colour photos for the thumbnail strip. */
export function colorSwatches(p: Product) {
  return productOptions(p).colors.map((c) => ({ color: c, image: resolveVariant(p, { color: c }).image }));
}
