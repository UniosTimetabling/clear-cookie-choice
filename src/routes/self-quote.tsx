import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Bed, Boxes, Calculator, ChevronUp, Film, Grid3x3, LayoutGrid, Leaf, MessageCircle, PaintRoller,
  Receipt, RotateCcw, Scroll, Shield, SlidersHorizontal, AlignJustify, GripVertical, Square, UserPen,
} from "lucide-react";
import { meta } from "@/components/site";
import { site } from "@/lib/data";
import { CATEGORIES, PRICING, calculate, whatsappLink, type Field, type Unit } from "@/lib/quote";

export const Route = createFileRoute("/self-quote")({
  head: () => meta("Get a Self Quote | Hope & HomeKe Price Estimator", "Instant price estimate for carpets, curtains, blinds, wallpaper, flooring and more. Send your quote via WhatsApp."),
  component: SelfQuote,
});

const icons: Record<string, typeof Square> = {
  carpet_wall_to_wall: LayoutGrid, carpet_3d: Boxes, carpet_grass: Leaf, curtains: Scroll, roller_blinds: AlignJustify,
  vertical_blinds: GripVertical, venetian_blinds: SlidersHorizontal, wallpaper: PaintRoller, vinyl_flooring: Grid3x3,
  window_film: Film, privacy_fence: Shield, duvet_bedsheet: Bed,
};
const units: { id: Unit; label: string; short: string }[] = [
  { id: "meters", label: "Metres", short: "m" }, { id: "feet", label: "Feet", short: "ft" },
  { id: "inches", label: "Inches", short: "in" }, { id: "yards", label: "Yards", short: "yd" },
];

function SelfQuote() {
  const [type, setType] = useState<string | null>(null);
  const [unit, setUnit] = useState<Unit>("meters");
  const [vals, setVals] = useState<Partial<Record<Field, string>>>({});
  const [price, setPrice] = useState("");
  const [min, setMin] = useState("");
  const [shown, setShown] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contact, setContact] = useState({ name: "", phone: "", notes: "" });
  const ul = units.find((u) => u.id === unit)!.short;

  const pick = (t: string) => {
    const c = CATEGORIES[t]!, p = PRICING[t]!;
    setType(t); setVals({}); setShown(false); setContactOpen(false);
    setPrice(String(p[c.priceField] || "")); setMin(String(p.min || ""));
  };
  const reset = () => { setType(null); setShown(false); setVals({}); setContact({ name: "", phone: "", notes: "" }); };

  const result = useMemo(() => {
    if (!type) return null;
    const num = Object.fromEntries(Object.entries(vals).map(([k, v]) => [k, parseFloat(v || "") || 0]));
    return calculate(type, unit, num, parseFloat(price) || 0, parseFloat(min) || 0);
  }, [type, unit, vals, price, min]);

  const fieldDefs: Record<Field, { label: string; ph: string; hint: string }> = {
    length: { label: `Room Length (${ul})`, ph: "e.g. 5.0", hint: `Length of the floor / wall in ${ul}` },
    width: { label: `Room Width (${ul})`, ph: "e.g. 4.0", hint: `Width of the floor / wall in ${ul}` },
    height: { label: `Wall / Window Height (${ul})`, ph: "e.g. 2.8", hint: "Height from floor to ceiling or window top" },
    qty: { label: "Quantity / Panels / Sets", ph: "e.g. 2", hint: "Number of windows, panels, or sets" },
  };

  return (
    <>
      <section className="bg-ink py-16 text-ink-foreground">
        <div className="container-x text-center">
          <p className="eyebrow flex items-center justify-center gap-2"><Calculator className="h-4 w-4" />Self-Quote Calculator</p>
          <h1 className="mt-3 text-4xl md:text-5xl">Get an instant price estimate</h1>
          <p className="mx-auto mt-4 max-w-xl text-ink-foreground/70">Edit any value to suit your space, then send your quote to us on WhatsApp.</p>
        </div>
      </section>

      <section className="container-x max-w-4xl py-14">
        {!type ? (
          <div>
            <p className="eyebrow flex items-center gap-2"><LayoutGrid className="h-4 w-4" />Step 1 — Choose what you need a quote for</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {Object.entries(CATEGORIES).map(([k, c]) => {
                const I = icons[k] ?? Square;
                return (
                  <button key={k} onClick={() => pick(k)} className="card flex flex-col items-center gap-3 p-5 text-center text-sm font-medium transition hover:-translate-y-0.5 hover:border-accent hover:shadow-soft">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-accent"><I className="h-5 w-5" /></span>
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="card p-6 md:p-8">
            <button onClick={reset} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"><ArrowLeft className="h-4 w-4" />Back to categories</button>
            <p className="eyebrow mt-6">Step 2 — {CATEGORIES[type]!.label}: enter measurements</p>

            <div className="mt-5 inline-flex flex-wrap gap-1 rounded-full bg-muted p-1">
              {units.map((u) => (
                <button key={u.id} onClick={() => setUnit(u.id)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${unit === u.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{u.label} ({u.short})</button>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {CATEGORIES[type]!.fields.map((f) => (
                <div key={f}>
                  <label className="label">{fieldDefs[f].label}</label>
                  <input type="number" min="0" step="0.01" className="field" placeholder={fieldDefs[f].ph} value={vals[f] ?? ""} onChange={(e) => setVals({ ...vals, [f]: e.target.value })} />
                  <p className="mt-1 text-xs text-muted-foreground">{fieldDefs[f].hint}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
              <div>
                <label className="label">{CATEGORIES[type]!.priceLabel}</label>
                <input type="number" min="0" className="field" value={price} onChange={(e) => setPrice(e.target.value)} />
                <p className="mt-1 text-xs text-muted-foreground">You can edit this value to get a custom estimate</p>
              </div>
              <div>
                <label className="label">Min. Order Amount (KSh)</label>
                <input type="number" min="0" className="field" value={min} onChange={(e) => setMin(e.target.value)} />
                <p className="mt-1 text-xs text-muted-foreground">Leave 0 for no minimum</p>
              </div>
            </div>

            <button onClick={() => setShown(true)} className="btn-accent mt-6 w-full"><Calculator className="h-4 w-4" />Calculate Estimate</button>

            {shown && result && (
              <div className="mt-6 rounded-2xl bg-ink p-6 text-ink-foreground animate-rise">
                <p className="flex items-center gap-2 font-display text-xl"><Receipt className="h-5 w-5 text-accent" />Your Estimate</p>
                {result.ok ? (
                  <>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {result.breakdown.map((r) => (
                        <div key={r.label} className="rounded-lg bg-ink-foreground/5 px-4 py-2.5">
                          <p className="text-xs text-ink-foreground/60">{r.label}</p>
                          <p className="font-semibold">{r.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-ink-foreground/15 pt-4">
                      <span className="text-sm text-ink-foreground/70">Estimated Total</span>
                      <span className="font-display text-3xl text-accent">KSh {result.total.toLocaleString("en-US")}</span>
                    </div>
                    <p className="mt-2 text-xs text-ink-foreground/60">* Indicative estimate. Final price confirmed after professional measurement.</p>

                    <button onClick={() => setContactOpen(!contactOpen)} className="btn-ghost-light mt-5 w-full">
                      {contactOpen ? <><ChevronUp className="h-4 w-4" />Hide contact details</> : <><UserPen className="h-4 w-4" />Add your details & send quote via WhatsApp</>}
                    </button>
                    {contactOpen && (
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <input className="field text-foreground" placeholder="Your name, e.g. John Kamau" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
                        <input className="field text-foreground" type="tel" placeholder="Phone, e.g. 0712 345 678" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                        <input className="field text-foreground sm:col-span-2" placeholder="Notes (optional), e.g. 2 bedrooms, please include fitting" value={contact.notes} onChange={(e) => setContact({ ...contact, notes: e.target.value })} />
                      </div>
                    )}
                    <div className="mt-4 flex gap-2">
                      <a href={whatsappLink(site.whatsapp, type, unit, result.breakdown, result.total, contact)} target="_blank" rel="noopener noreferrer" className="btn-accent flex-1"><MessageCircle className="h-4 w-4" />Send via WhatsApp</a>
                      <button onClick={reset} className="btn-ghost-light" aria-label="Start over"><RotateCcw className="h-4 w-4" /></button>
                    </div>
                  </>
                ) : (
                  <p className="mt-3 text-destructive">{result.error}</p>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
