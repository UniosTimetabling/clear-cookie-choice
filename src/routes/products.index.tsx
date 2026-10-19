import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { categories, images, products } from "@/lib/data";
import { meta, PageHero, ProductCard } from "@/components/site";

type Search = { category?: string };

export const Route = createFileRoute("/products/")({
  validateSearch: (s: Record<string, unknown>): Search => (typeof s["category"] === "string" ? { category: s["category"] } : {}),
  head: () => meta("Shop Curtains, Carpets & Blinds | Hope & HomeKe", "Browse curtains, carpets, blinds, flooring, bedding and outdoor décor with prices in KSh."),
  component: Products,
});

function Products() {
  const { category } = Route.useSearch();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured");
  const [heroOpen, setHeroOpen] = useState(false);
  const list = useMemo(() => {
    let l = products.filter((p) => (!category || p.category === category) && p.name.toLowerCase().includes(q.toLowerCase()));
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "rating") l = [...l].sort((a, b) => b.rating - a.rating);
    return l;
  }, [category, q, sort]);

  return (
    <>
      {heroOpen && <PageHero eyebrow="The collection" title="Shop interior décor" text="Made-to-measure curtains, carpets, blinds and more — delivered and installed." image={images.hero} />}
      <div className="border-b border-border bg-muted/60">
        <button onClick={() => setHeroOpen((o) => !o)} aria-expanded={heroOpen} className="container-x flex items-center justify-between py-3 text-sm font-medium hover:text-accent">
          <span>{heroOpen ? "Hide banner" : "Shop interior décor — show banner"}</span>
          <ChevronDown className={`h-4 w-4 transition ${heroOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
      <section className="container-x mt-8 pb-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <Link to="/products" search={{}} onClick={() => setHeroOpen(false)} className={`rounded-full border px-4 py-2 text-sm ${!category ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}>All</Link>
            {categories.map((c) => (
              <Link key={c} to="/products" search={{ category: c }} onClick={() => setHeroOpen(false)} className={`rounded-full border px-4 py-2 text-sm ${category === c ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}>{c}</Link>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="field md:w-56" />
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="field w-40">
              <option value="featured">Featured</option><option value="low">Price: low</option><option value="high">Price: high</option><option value="rating">Top rated</option>
            </select>
          </div>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{list.length} products</p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
          {list.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
        {list.length === 0 && <p className="py-20 text-center text-muted-foreground">No products match your search.</p>}
      </section>
    </>
  );
}
