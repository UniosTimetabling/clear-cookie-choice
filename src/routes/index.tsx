import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, ChevronUp, Heart, ShoppingBag, Award, Flame, Ruler, Search, Sparkles, Tag, TrendingUp, Trophy, Truck } from "lucide-react";
import { useState, type ReactNode } from "react";
import { categories, images, posts, products, testimonials, type Product } from "@/lib/data";
import { CtaBand, meta, ProductCard, SectionHead, Stars } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => meta("Hope & HomeKe — Interior Décor Nairobi | Curtains, Carpets & Blinds", "Custom curtains, wall-to-wall carpets, blinds and flooring — measured, made and installed across Kenya. Browse categories, bestsellers and this week's deals."),
  component: Home,
});

const catImg: Record<string, string> = { Curtains: images.curtains, Carpets: images.carpets, Blinds: images.blinds, Flooring: images.blinds, Bedding: images.curtains, Outdoor: images.carpets };
const topSearches = ["Blackout curtains", "Grass carpet", "Roller blinds", "Wall-to-wall carpet", "Sheer curtains", "Vinyl flooring", "Zebra blinds", "Office carpet tiles"];

function Row({ icon, eyebrow, title, items }: { icon: ReactNode; eyebrow: string; title: string; items: Product[] }) {
  if (!items.length) return null;
  return (
    <section className="container-x mt-14 md:mt-20">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow flex items-center gap-2">{icon}{eyebrow}</p>
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl">{title}</h2>
        </div>
        <Link to="/products" className="btn-glow">View all <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
        {items.slice(0, 4).map((p) => <ProductCard key={p.slug} p={p} />)}
      </div>
    </section>
  );
}

function Home() {
  const best = [...products].sort((a, b) => b.rating - a.rating);
  const trending = products.filter((p) => p.tag === "Popular" || p.tag === "New").concat(products.filter((p) => !p.tag)).slice(0, 4);
  const deals = products.filter((p) => p.oldPrice);
  const fresh = [...products].reverse();
  const recommended = [...products].sort((a, b) => b.rating - a.rating).slice(4, 8).concat(products).slice(0, 4);
  const more = products.slice(-4);

  const [heroOpen, setHeroOpen] = useState(false);

  return (
    <>
      <div className="container-x flex justify-center py-3">
        <button type="button" onClick={() => setHeroOpen((o) => !o)} aria-expanded={heroOpen} className="btn-glow">
          {heroOpen ? <>Hide welcome <ChevronUp className="h-4 w-4" /></> : <>Show welcome <ChevronDown className="h-4 w-4" /></>}
        </button>
      </div>
      {heroOpen && <section className="relative min-h-[74svh] overflow-hidden sm:min-h-[86svh]">
        <img src={images.hero} alt="Warm living room styled by Hope & HomeKe" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-scrim" />
        <div className="container-x relative flex min-h-[74svh] items-center pb-24 pt-12 sm:min-h-[86svh] sm:pb-28 sm:pt-16">
          <div className="max-w-xl text-ink-foreground">
            <p className="eyebrow eyebrow-light text-on-image animate-rise">Nairobi interior décor studio</p>
            <h1 className="mt-4 text-4xl font-medium leading-[1.04] sm:text-5xl md:text-6xl text-on-image animate-rise">Spaces that feel like <em className="text-accent-bright">home.</em></h1>
            <p className="mt-5 max-w-md text-base sm:text-lg text-ink-foreground/90 text-on-image">Curtains, carpets, blinds and flooring — measured, made and installed by our team across Kenya.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/products" className="btn-accent">Shop the collection <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/consultation" className="btn-ghost-light">Free consultation</Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t animate-rise border-ink-foreground/25 pt-5 sm:mt-10 sm:gap-8 sm:pt-6">
              {[["500+", "Projects delivered"], ["4.9★", "Average rating"], ["47", "Counties served"]].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display text-lg sm:text-2xl text-on-image">{n}</p>
                  <p className="mt-1 text-xs leading-tight text-ink-foreground/85 sm:text-sm">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-2">
          <a href="#after-hero" aria-label="Scroll down" className="grid h-10 w-10 animate-bounce place-items-center rounded-full border border-ink-foreground/50 text-ink-foreground transition hover:bg-ink-foreground/15">
            <ChevronDown className="h-5 w-5" />
          </a>
        </div>
      </section>}

      <section id="after-hero" className="scroll-mt-20 border-b border-border bg-card">
        <div className="container-x grid grid-cols-2 gap-4 py-6 sm:gap-6 sm:py-8 md:grid-cols-4">
          {[[Award, "Premium quality", "Durable materials"], [Ruler, "Free measuring", "On-site in Nairobi"], [Sparkles, "Expert installation", "Warranty included"], [Truck, "Countrywide", "All 47 counties"]].map(([I, t, s]) => {
            const Icon = I as typeof Award;
            return <div key={t as string} className="flex items-center gap-3"><Icon className="h-8 w-8 text-accent" strokeWidth={1.4} /><div><p className="text-sm font-semibold">{t as string}</p><p className="text-xs text-muted-foreground">{s as string}</p></div></div>;
          })}
        </div>
      </section>

      <section className="container-x pt-14 md:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Shop by category</p>
            <h2 className="mt-2 text-2xl sm:text-3xl md:text-5xl">Everything your space needs</h2>
          </div>
          <Link to="/products" className="btn-primary">Browse all products <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link key={c} to="/products" search={{ category: c }} className="group relative overflow-hidden rounded-2xl">
              <img src={catImg[c]} alt={c} loading="lazy" className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-hero-overlay" />
              <div className="absolute inset-x-4 bottom-4 text-ink-foreground">
                <p className="font-display text-xl">{c}</p>
                <p className="text-xs opacity-80">{products.filter((p) => p.category === c).length} products</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link to="/products" className="btn-accent">Shop now <ShoppingBag className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="container-x mt-10">
        <div className="card p-5 sm:p-6">
          <p className="flex items-center gap-2 text-sm font-semibold"><Search className="h-4 w-4 text-accent" /> Top searched</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {topSearches.map((s) => (
              <Link key={s} to="/products" className="rounded-full border border-border px-4 py-1.5 text-sm transition hover:border-accent hover:text-accent">{s}</Link>
            ))}
          </div>
        </div>
      </section>

      <Row icon={<Trophy className="h-4 w-4" />} eyebrow="Best selling" title="Loved in Nairobi homes" items={best} />
      <Row icon={<TrendingUp className="h-4 w-4" />} eyebrow="Trending now" title="What everyone's picking" items={trending} />
      <Row icon={<Tag className="h-4 w-4" />} eyebrow="Deals" title="On offer this week" items={deals} />
      <Row icon={<Sparkles className="h-4 w-4" />} eyebrow="New arrivals" title="Fresh in the studio" items={fresh} />

      <section className="container-x mt-16 grid items-center gap-8 md:mt-24 md:gap-12 md:grid-cols-2">
        <img src={images.curtains} alt="Olive curtains in a bedroom" loading="lazy" className="aspect-square w-full rounded-3xl object-cover shadow-soft" />
        <div>
          <p className="eyebrow">About Hope & HomeKe</p>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-5xl">Stylish, practical décor for homes and offices</h2>
          <p className="mt-5 text-muted-foreground">We specialise in wall-to-wall carpets, grass carpets, window blinds, curtains and accessories, privacy fences and quality locks. Our focus is quality products, professional service and transforming spaces to suit your lifestyle.</p>
          <div className="mt-8 grid grid-cols-3 gap-4 border-y border-border py-6">
            {[["500+", "Projects"], ["4.9★", "Rating"], ["47", "Counties"]].map(([n, l]) => <div key={l}><p className="font-display text-3xl">{n}</p><p className="text-xs text-muted-foreground">{l}</p></div>)}
          </div>
          <Link to="/about" className="btn-primary mt-8">Our story</Link>
        </div>
      </section>

      <Row icon={<Heart className="h-4 w-4" />} eyebrow="Recommended for you" title="Picked by our stylists" items={recommended} />

      <section className="mt-16 bg-secondary py-16 md:mt-24 md:py-24">
        <div className="container-x">
          <SectionHead eyebrow="Testimonials" title="What our clients say" />
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <figure key={t.name} className="card p-8">
                <Stars n={t.rating} />
                <blockquote className="mt-4 font-display text-lg leading-snug">“{t.text}”</blockquote>
                <figcaption className="mt-6 text-sm"><span className="font-semibold">{t.name}</span> <span className="text-muted-foreground">· {t.place}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <Row icon={<ShoppingBag className="h-4 w-4" />} eyebrow="Ready when you are" title="Shop our customers' favourites" items={more} />
      <div className="container-x mt-8 flex justify-center">
        <Link to="/products" className="btn-primary">Shop more products <ArrowRight className="h-4 w-4" /></Link>
      </div>

      <section className="container-x mt-16 md:mt-24">
        <SectionHead eyebrow="Ideas" title="From the journal" />
        <div className="grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((b) => (
            <Link key={b.slug} to="/blog" className="group">
              <img src={b.image} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
              <p className="mt-4 text-xs uppercase tracking-wider text-accent">{b.topic}</p>
              <h3 className="mt-1 text-xl group-hover:text-accent">{b.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-x mt-16 md:mt-24">
        <div className="grid gap-4 md:grid-cols-3">
          {categories.slice(0, 3).map((c) => (
            <Link key={c} to="/products" search={{ category: c }} className="group relative overflow-hidden rounded-3xl">
              <img src={catImg[c]} alt={c} loading="lazy" className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-hero-overlay" />
              <div className="absolute bottom-5 left-5 text-ink-foreground">
                <p className="flex items-center gap-1 text-xs uppercase tracking-wider"><Flame className="h-3.5 w-3.5" /> Featured</p>
                <p className="mt-1 font-display text-2xl">Shop {c}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-16" />
      <CtaBand />
    </>
  );
}
