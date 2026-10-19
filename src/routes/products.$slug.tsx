import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Heart, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { colorSwatches, ksh, productOptions, products, resolveVariant, site } from "@/lib/data";
import { optionLabel, useCart } from "@/lib/cart";
import { ProductCard, Stars } from "@/components/site";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const p = products.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} | Hope & HomeKe` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: `${loaderData.name} | Hope & HomeKe` },
          { property: "og:description", content: loaderData.description },
          { property: "og:type", content: "product" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Product not found" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => <div className="container-x py-32 text-center"><h1 className="text-4xl">Product not found</h1><Link to="/products" className="btn-primary mt-6">Back to shop</Link></div>,
  component: Detail,
});

function Detail() {
  const p = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const opts = productOptions(p);
  const [color, setColor] = useState<string | undefined>(opts.colors[0]);
  const [size, setSize] = useState<string | undefined>(opts.sizes[0]);
  const variant = resolveVariant(p, { color, size });
  const swatches = colorSwatches(p);
  const missing = (opts.colors.length > 0 && !color) || (opts.sizes.length > 0 && !size);
  const selection = { color, size };
  const { add, wishlist, toggleWish } = useCart();
  const related = products.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 4);
  return (
    <>
      <section className="container-x grid gap-8 py-8 md:grid-cols-2 md:gap-12 md:py-12">
        <div>
          <img key={variant.image} src={variant.image} alt={`${p.name}${variant.label ? ` – ${variant.label}` : ""}`} className="aspect-square w-full rounded-2xl object-cover shadow-soft animate-in fade-in duration-300 sm:rounded-3xl" />
          {swatches.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {swatches.map((sw) => (
                <button key={sw.color} type="button" onClick={() => setColor(sw.color)} aria-label={`Show ${sw.color}`} aria-pressed={color === sw.color} className={`shrink-0 overflow-hidden rounded-xl border-2 transition ${color === sw.color ? "border-glow" : "border-transparent opacity-70 hover:opacity-100"}`}>
                  <img src={sw.image} alt={sw.color} loading="lazy" className="h-16 w-16 object-cover sm:h-20 sm:w-20" />
                  <span className="block px-1 py-0.5 text-center text-xs">{sw.color}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="md:py-6">
          <Link to="/products" search={{ category: p.category }} className="eyebrow">{p.category}</Link>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl">{p.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Stars n={p.rating} />{p.rating} rating</div>
          <div className="mt-6 flex items-baseline gap-3">
            <p className="font-display text-3xl">{ksh(variant.price)}</p>
            {p.oldPrice && variant.price === p.price && <p className="text-muted-foreground line-through">{ksh(p.oldPrice)}</p>}
            {p.unit && <p className="text-sm text-muted-foreground">{p.unit}</p>}
          </div>
          <p className="mt-6 leading-relaxed text-muted-foreground">{p.description}</p>
          {opts.colors.length > 0 && (
            <div className="mt-8">
              <p className="label">Colour{color && <span className="ml-2 font-normal text-muted-foreground">{color}</span>}</p>
              <div className="mt-2 flex flex-wrap gap-2">{opts.colors.map((c) => (
                <button key={c} type="button" aria-pressed={color === c} onClick={() => setColor(c)} className={`rounded-full border px-4 py-2 text-sm transition ${color === c ? "border-glow bg-glow text-glow-foreground" : "border-border hover:border-foreground"}`}>{c}</button>
              ))}</div>
            </div>
          )}
          {opts.sizes.length > 0 && (
            <div className="mt-6">
              <p className="label">Size{size && <span className="ml-2 font-normal text-muted-foreground">{size}</span>}</p>
              <div className="mt-2 flex flex-wrap gap-2">{opts.sizes.map((z) => (
                <button key={z} type="button" aria-pressed={size === z} onClick={() => setSize(z)} className={`rounded-full border px-4 py-2 text-sm transition ${size === z ? "border-glow bg-glow text-glow-foreground" : "border-border hover:border-foreground"}`}>{z}</button>
              ))}</div>
            </div>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button className="p-3" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Less"><Minus className="h-4 w-4" /></button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button className="p-3" onClick={() => setQty(qty + 1)} aria-label="More"><Plus className="h-4 w-4" /></button>
            </div>
            <button className="btn-primary flex-1" onClick={() => { if (missing) { toast.error(`Please choose a ${opts.colors.length && !color ? "colour" : "size"} first`); return; } add(p.slug, qty, selection); }}>Add to cart</button>
            <button className="btn-outline px-4" onClick={() => toggleWish(p.slug)} aria-label="Wishlist"><Heart className={`h-4 w-4 ${wishlist.includes(p.slug) ? "fill-accent text-accent" : ""}`} /></button>
          </div>
          <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in ${p.name}${optionLabel(selection) ? ` (${optionLabel(selection)})` : ""}`)}`} className="btn-accent mt-3 w-full">Order on WhatsApp</a>
          <ul className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
            <li className="flex gap-3"><Check className="h-5 w-5 text-accent" />Free measurement in Nairobi</li>
            <li className="flex gap-3"><Truck className="h-5 w-5 text-accent" />Delivery across all 47 counties</li>
            <li className="flex gap-3"><ShieldCheck className="h-5 w-5 text-accent" />Installation warranty included</li>
          </ul>
        </div>
      </section>
      {related.length > 0 && (
        <section className="container-x mt-12">
          <h2 className="mb-8 text-3xl">You may also like</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div>
        </section>
      )}
    </>
  );
}
