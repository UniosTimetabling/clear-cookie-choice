import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Ruler, Sparkles, Truck } from "lucide-react";
import { categories, images, posts, products, testimonials } from "@/lib/data";
import { CtaBand, meta, ProductCard, SectionHead, Stars } from "@/components/site";

export const Route = createFileRoute("/home")({
  head: () => meta("Home | Hope & HomeKe Interior Décor Nairobi", "Custom curtains, wall-to-wall carpets, blinds and expert installation in Nairobi. Free consultation."),
  component: Home,
});

const catImg: Record<string, string> = { Curtains: images.curtains, Carpets: images.carpets, Blinds: images.blinds, Flooring: images.blinds, Bedding: images.curtains, Outdoor: images.carpets };

function Home() {
  return (
    <>
      <section className="relative min-h-[88svh] overflow-hidden">
        <img src={images.hero} alt="Warm living room styled by Hope & HomeKe" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="container-x relative flex min-h-[88svh] flex-col justify-end pb-14 pt-24 sm:pb-20 text-ink-foreground">
          <p className="eyebrow eyebrow-light text-on-image animate-rise">Nairobi interior décor studio</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-medium leading-[1.04] sm:text-5xl md:text-7xl text-on-image animate-rise">Spaces that feel like <em className="text-accent-bright">home.</em></h1>
          <p className="mt-5 max-w-xl text-base sm:text-lg text-ink-foreground/90 text-on-image">Curtains, carpets, blinds and flooring — measured, made and installed by our team across Kenya.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to="/products" className="btn-accent">Shop the collection <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/consultation" className="btn-ghost-light">Free consultation</Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="container-x grid grid-cols-2 gap-4 py-6 sm:gap-6 sm:py-8 md:grid-cols-4">
          {[[Award, "Premium quality", "Durable materials"], [Ruler, "Free measuring", "On-site in Nairobi"], [Sparkles, "Expert installation", "Warranty included"], [Truck, "Countrywide", "All 47 counties"]].map(([I, t, s]) => {
            const Icon = I as typeof Award;
            return <div key={t as string} className="flex items-center gap-3"><Icon className="h-8 w-8 text-accent" strokeWidth={1.4} /><div><p className="text-sm font-semibold">{t as string}</p><p className="text-xs text-muted-foreground">{s as string}</p></div></div>;
          })}
        </div>
      </section>

      <section className="container-x mt-16 md:mt-24">
        <SectionHead eyebrow="Shop by category" title="Everything your space needs" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link key={c} to="/products" search={{ category: c }} className="group relative overflow-hidden rounded-2xl">
              <img src={catImg[c]} alt={c} loading="lazy" className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-hero-overlay" />
              <p className="absolute bottom-4 left-4 font-display text-xl text-ink-foreground">{c}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-x mt-16 md:mt-24">
        <div className="mb-10 flex items-end justify-between">
          <div><p className="eyebrow">Bestsellers</p><h2 className="mt-3 text-2xl sm:text-3xl md:text-5xl">Loved in Nairobi homes</h2></div>
          <Link to="/products" className="btn-glow hidden sm:inline-flex">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4">
          {products.slice(0, 8).map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      </section>

      <section className="container-x mt-16 md:mt-24 grid items-center gap-8 md:gap-12 md:grid-cols-2">
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
      <CtaBand />
    </>
  );
}
