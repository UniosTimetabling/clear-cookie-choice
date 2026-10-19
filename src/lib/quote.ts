export type CalcType = "area" | "wall" | "blind" | "curtain" | "unit";
export type Field = "length" | "width" | "height" | "qty";
export type Unit = "meters" | "feet" | "inches" | "yards";

export const PRICING: Record<string, { sqm: number; unit: number; rm: number; min: number }> = {
  carpet_wall_to_wall: { sqm: 1200, unit: 0, rm: 0, min: 3000 },
  carpet_3d: { sqm: 1800, unit: 0, rm: 0, min: 3000 },
  carpet_grass: { sqm: 900, unit: 0, rm: 0, min: 2000 },
  curtains: { sqm: 0, unit: 2500, rm: 1800, min: 2500 },
  roller_blinds: { sqm: 1500, unit: 3500, rm: 0, min: 3500 },
  vertical_blinds: { sqm: 1400, unit: 3200, rm: 0, min: 3200 },
  venetian_blinds: { sqm: 1600, unit: 3800, rm: 0, min: 3800 },
  wallpaper: { sqm: 1100, unit: 0, rm: 0, min: 2000 },
  vinyl_flooring: { sqm: 1300, unit: 0, rm: 0, min: 2500 },
  window_film: { sqm: 800, unit: 0, rm: 0, min: 1500 },
  privacy_fence: { sqm: 700, unit: 0, rm: 0, min: 1500 },
  duvet_bedsheet: { sqm: 0, unit: 4500, rm: 0, min: 4500 },
};

type Cat = { label: string; calcType: CalcType; fields: Field[]; priceField: "sqm" | "unit" | "rm"; priceLabel: string };
const A: Field[] = ["length", "width"];
const B: Field[] = ["width", "height", "qty"];
const sqm = "Price per m² (KSh)";
export const CATEGORIES: Record<string, Cat> = {
  carpet_wall_to_wall: { label: "Wall-to-Wall Carpet", calcType: "area", fields: A, priceField: "sqm", priceLabel: sqm },
  carpet_3d: { label: "3D Carpet", calcType: "area", fields: A, priceField: "sqm", priceLabel: sqm },
  carpet_grass: { label: "Grass Carpet", calcType: "area", fields: A, priceField: "sqm", priceLabel: sqm },
  curtains: { label: "Curtains", calcType: "curtain", fields: B, priceField: "rm", priceLabel: "Price per running metre (KSh)" },
  roller_blinds: { label: "Roller Blinds", calcType: "blind", fields: B, priceField: "sqm", priceLabel: sqm },
  vertical_blinds: { label: "Vertical Blinds", calcType: "blind", fields: B, priceField: "sqm", priceLabel: sqm },
  venetian_blinds: { label: "Venetian Blinds", calcType: "blind", fields: B, priceField: "sqm", priceLabel: sqm },
  wallpaper: { label: "Wallpaper", calcType: "wall", fields: ["length", "width", "height"], priceField: "sqm", priceLabel: sqm },
  vinyl_flooring: { label: "Vinyl / Laminate Floor", calcType: "area", fields: A, priceField: "sqm", priceLabel: sqm },
  window_film: { label: "Window Film", calcType: "blind", fields: B, priceField: "sqm", priceLabel: sqm },
  privacy_fence: { label: "Privacy Fence", calcType: "area", fields: A, priceField: "sqm", priceLabel: sqm },
  duvet_bedsheet: { label: "Duvet / Bedsheet Set", calcType: "unit", fields: ["qty"], priceField: "unit", priceLabel: "Price per set (KSh)" },
};

export const TO_METRES: Record<Unit, number> = { meters: 1, feet: 0.3048, inches: 0.0254, yards: 0.9144 };

export type Row = { label: string; value: string };
export type Result = { ok: true; breakdown: Row[]; total: number } | { ok: false; error: string };

const n = (v: number) => v.toLocaleString("en-US");

export function calculate(type: string, unit: Unit, v: Partial<Record<Field, number>>, unitPrice: number, minOrder: number): Result {
  const cat = CATEGORIES[type]!;
  const m = (x?: number) => (x || 0) * TO_METRES[unit];
  const qty = v.qty || 1;
  let breakdown: Row[] = [];
  let total = 0;
  if (cat.calcType === "area" || cat.calcType === "wall") {
    const l = m(v.length), w = m(v.width), h = cat.calcType === "wall" ? m(v.height) : 0;
    if (l <= 0 || w <= 0) return { ok: false, error: "Please enter valid length and width values." };
    const area = cat.calcType === "wall" ? 2 * (l + w) * (h || 2.8) : l * w;
    breakdown = [{ label: "Length", value: `${l.toFixed(2)} m` }, { label: "Width", value: `${w.toFixed(2)} m` }];
    if (cat.calcType === "wall" && h > 0) breakdown.push({ label: "Wall Height", value: `${h.toFixed(2)} m` });
    breakdown.push({ label: "Area", value: `${area.toFixed(2)} m²` }, { label: "Unit Price", value: `KSh ${n(unitPrice)}/m²` });
    total = area * unitPrice;
  } else if (cat.calcType === "blind") {
    const w = m(v.width), h = m(v.height);
    if (w <= 0 || h <= 0) return { ok: false, error: "Please enter valid width and height values." };
    const area = w * h * qty;
    breakdown = [
      { label: "Width per window", value: `${w.toFixed(2)} m` },
      { label: "Height per window", value: `${h.toFixed(2)} m` },
      { label: "Qty / windows", value: `${qty}` },
      { label: "Total area", value: `${area.toFixed(2)} m²` },
      { label: "Unit Price", value: `KSh ${n(unitPrice)}/m²` },
    ];
    total = area * unitPrice;
  } else if (cat.calcType === "curtain") {
    const w = m(v.width), h = m(v.height);
    if (w <= 0) return { ok: false, error: "Please enter a valid curtain width." };
    const fullness = 2.5;
    const rm = w * fullness * qty;
    const drop = h > 0 ? h + 0.3 : 2.8;
    breakdown = [
      { label: "Window width", value: `${w.toFixed(2)} m` },
      { label: "Drop / height", value: `${drop.toFixed(2)} m` },
      { label: "Fullness factor", value: `× ${fullness}` },
      { label: "No. of windows", value: `${qty}` },
      { label: "Fabric needed", value: `${rm.toFixed(2)} running m` },
      { label: "Unit Price", value: `KSh ${n(unitPrice)}/rm` },
    ];
    total = rm * drop * unitPrice;
  } else {
    if (qty <= 0) return { ok: false, error: "Please enter a valid quantity." };
    breakdown = [{ label: "Sets / units", value: `${qty}` }, { label: "Price per set", value: `KSh ${n(unitPrice)}` }];
    total = qty * unitPrice;
  }
  if (minOrder > 0 && total < minOrder) {
    breakdown.push({ label: "Minimum order applied", value: `KSh ${n(minOrder)}` });
    total = minOrder;
  }
  return { ok: true, breakdown, total: Math.ceil(total) };
}

export function whatsappLink(num: string, type: string, unit: Unit, breakdown: Row[], total: number, c: { name?: string; phone?: string; notes?: string }) {
  const lines = ["*PRICE ESTIMATE – Hope & HomeKe*", "", `Product: ${CATEGORIES[type]!.label}`, `Unit: ${unit}`, ""];
  breakdown.forEach((r) => lines.push(`${r.label}: ${r.value}`));
  lines.push("", `*ESTIMATED TOTAL: KSh ${n(total)}*`);
  if (c.name) lines.push("", `Customer: ${c.name}`);
  if (c.phone) lines.push(`Phone: ${c.phone}`);
  if (c.notes) lines.push(`Notes: ${c.notes}`);
  lines.push("", "Please confirm my quote. Thank you!");
  return `https://wa.me/${num}?text=${encodeURIComponent(lines.join("\n"))}`;
}
