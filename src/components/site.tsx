import { openCookieChoices } from "./tracking";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useEffect, useState, type ReactNode } from "react";
import { Calculator, ChevronDown, ShoppingCart, Heart, Menu, Phone, ShoppingBag, Star, User, X, MessageCircle, Mail, MapPin, ArrowUp } from "lucide-react";
import logo from "@/assets/logo.png";
import { hasOptions, ksh, site, type Product } from "@/lib/data";
import { useCart } from "@/lib/cart";

const nav = [
  { to: "/products", label: "Shop" },
  { to: "/services", label: "Services" },
  { to: "/consultation", label: "Consultation" },
  { to: "/blog", label: "Ideas" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

const policyLinks = [
  { to: "/legal", label: "Our Policies" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/refund-returns-policy", label: "Refund & Returns" },
  { to: "/terms", label: "Terms & Conditions" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-lg">
      <div className="bg-ink text-ink-foreground">
        <div className="container-x flex h-9 items-center justify-between text-xs">
          <span className="truncate">Free measurement & consultation across Nairobi</span>
          <a href={`tel:${site.phone}`} className="hidden items-center gap-1.5 sm:flex"><Phone className="h-3 w-3" />{site.phone}</a>
        </div>
      </div>
      <div className="container-x flex h-16 items-center justify-between gap-3 py-2 sm:h-18 sm:gap-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <img src={logo} alt="Hope & HomeKe" className="h-9 w-9 shrink-0 rounded-full object-contain sm:h-10 sm:w-10" />
          <span className="truncate whitespace-nowrap font-display text-lg font-semibold sm:text-xl">Hope <span className="text-accent">&</span> HomeKe</span>
        </Link>
        <nav className="hidden items-center gap-6 xl:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm font-medium text-foreground/75 transition hover:text-accent" activeProps={{ className: "!text-accent" }}>{n.label}</Link>
          ))}
          <div className="group relative">
            <button className="flex items-center gap-1 text-sm font-medium text-foreground/75 transition hover:text-accent" aria-haspopup="true">Policies<ChevronDown className="h-3.5 w-3.5" /></button>
            <div className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="card p-2 shadow-soft">
                {policyLinks.map((l) => <Link key={l.to} to={l.to} className="block rounded-lg px-3 py-2 text-sm hover:bg-muted hover:text-accent">{l.label}</Link>)}
              </div>
            </div>
          </div>
          <Link to="/self-quote" className="btn-accent !px-4 !py-2"><Calculator className="h-4 w-4" />Get Self Quote</Link>
        </nav>
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <Link to="/account/wishlist" className="hidden rounded-full p-2.5 hover:bg-muted sm:inline-flex" aria-label="Wishlist"><Heart className="h-5 w-5" /></Link>
          <Link to="/login" className="rounded-full p-2.5 hover:bg-muted" aria-label="Account"><User className="h-5 w-5" /></Link>
          <Link to="/cart" className="relative rounded-full p-2.5 hover:bg-muted" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">{count}</span>}
          </Link>
          <button className="rounded-full p-2.5 hover:bg-muted xl:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>
      {open && (
        <nav className="container-x flex max-h-[calc(100vh-7rem)] flex-col gap-1 overflow-y-auto border-t border-border/60 pb-6 pt-3 xl:hidden animate-rise">
          {nav.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 font-medium hover:bg-muted">{n.label}</Link>)}
          <Link to="/account/wishlist" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 font-medium hover:bg-muted sm:hidden">Wishlist</Link>
          <Link to="/self-quote" onClick={() => setOpen(false)} className="btn-accent my-2"><Calculator className="h-4 w-4" />Get Self Quote</Link>
          <Link to="/testimonials" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 font-medium hover:bg-muted">Testimonials</Link>
          <p className="eyebrow px-3 pt-3">Policies</p>
          {policyLinks.map((l) => <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-muted">{l.label}</Link>)}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 bg-ink md:mt-24 text-ink-foreground">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-4 md:py-16">
        <div className="col-span-2">
          <p className="font-display text-3xl">Hope <span className="text-accent">&</span> HomeKe</p>
          <p className="mt-4 max-w-sm text-sm text-ink-foreground/70">Modern interior décor for homes and offices across Kenya — curtains, carpets, blinds, flooring and expert installation.</p>
          <div className="mt-6 space-y-2 text-sm text-ink-foreground/80">
            <p className="flex items-center gap-2"><Phone className="h-4 w-4" />{site.phone}</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4" />{site.email}</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{site.location}</p>
          </div>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            {nav.map((n) => <li key={n.to}><Link to={n.to} className="text-ink-foreground/75 hover:text-accent">{n.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Help</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/testimonials" className="text-ink-foreground/75 hover:text-accent">Testimonials</Link></li>
            <li><Link to="/account" className="text-ink-foreground/75 hover:text-accent">My account</Link></li>
            <li><Link to="/self-quote" className="text-ink-foreground/75 hover:text-accent">Get a self quote</Link></li>
            {policyLinks.map((l) => <li key={l.to}><Link to={l.to} className="text-ink-foreground/75 hover:text-accent">{l.label}</Link></li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10 py-6 text-center text-xs text-ink-foreground/50">© {new Date().getFullYear()} Hope & HomeKe. All rights reserved. · <button onClick={openCookieChoices} className="underline hover:text-ink-foreground">Cookie choices</button></div>
    </footer>
  );
}

export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M16.004 3C9.38 3 4 8.38 4 15c0 2.34.67 4.53 1.84 6.39L4 29l7.82-1.8A11.94 11.94 0 0 0 16.004 27C22.62 27 28 21.62 28 15S22.62 3 16.004 3Zm0 21.8c-1.86 0-3.6-.5-5.1-1.38l-.36-.22-4.64 1.07 1.1-4.52-.24-.37A9.77 9.77 0 0 1 6.2 15c0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.4 9.8-9.8 9.8Zm5.38-7.34c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.71.23 1.36.2 1.88.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35Z"/>
    </svg>
  );
}

export function WhatsAppFab() {
  return (
    <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp" style={{ bottom: "calc(var(--fab-base, 1rem) + var(--consent-h, 0px))" }} className="fixed bottom-4 right-4 z-40 transition-[bottom] grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-soft transition hover:scale-110 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16">
      <span className="absolute inset-0 rounded-full bg-whatsapp animate-wa-ring" aria-hidden="true" />
      <WhatsAppIcon className="relative h-8 w-8 sm:h-9 sm:w-9" />
    </a>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 400);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top" className={`fab-top ${show ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>
      <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6" />
    </button>
  );
}


export function PageHero({ eyebrow, title, text, image, children }: { eyebrow: string; title: string; text?: string; image?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-ink text-ink-foreground">
      {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />}
      {image && <div className="absolute inset-0 bg-page-hero-overlay" />}
      <div className="container-x relative py-14 sm:py-20 md:py-28">
        <p className="eyebrow eyebrow-light text-on-image animate-rise">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-3xl font-medium leading-[1.08] sm:text-4xl md:text-6xl text-on-image animate-rise">{title}</h1>
        {text && <p className="mt-5 max-w-xl text-base text-ink-foreground/90 text-on-image md:text-lg">{text}</p>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mx-auto mb-8 max-w-2xl text-center md:mb-12">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-medium sm:text-3xl md:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-muted-foreground">{text}</p>}
    </div>
  );
}

export function Stars({ n }: { n: number }) {
  return <span className="flex gap-0.5 text-accent">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(n) ? "fill-current" : "opacity-30"}`} />)}</span>;
}

export function ProductCard({ p }: { p: Product }) {
  const { add, wishlist, toggleWish } = useCart();
  const wished = wishlist.includes(p.slug);
  const navigate = useNavigate();
  const onAdd = () => {
    if (hasOptions(p)) {
      toast("Choose a colour and size", { description: p.name });
      navigate({ to: "/products/$slug", params: { slug: p.slug } });
    } else add(p.slug);
  };
  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <Link to="/products/$slug" params={{ slug: p.slug }}>
          <img src={p.image} alt={p.name} loading="lazy" className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105" />
        </Link>
        {p.tag && <span className="absolute left-3 top-3 rounded-full bg-background px-3 py-1 text-xs font-semibold">{p.tag}</span>}
        <button onClick={() => toggleWish(p.slug)} aria-label="Save" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90">
          <Heart className={`h-4 w-4 ${wished ? "fill-accent text-accent" : ""}`} />
        </button>
        <button onClick={onAdd} className="btn-primary absolute inset-x-2 bottom-2 [@media(hover:none)]:!hidden !px-3 !py-2 text-xs transition sm:inset-x-3 sm:bottom-3 sm:!py-3 sm:text-sm [@media(hover:hover)]:translate-y-16 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100"><ShoppingCart className="h-4 w-4" />Add to cart</button>
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:mt-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.category}</p>
          <Link to="/products/$slug" params={{ slug: p.slug }} className="mt-1 block font-display text-base leading-tight sm:text-lg hover:text-accent">{p.name}</Link>
          <div className="mt-1.5"><Stars n={p.rating} /></div>
        </div>
        <div className="flex flex-col gap-2 sm:shrink-0 sm:items-end">
          <div className="flex flex-wrap items-baseline gap-x-2 sm:block sm:text-right">
            <p className="font-semibold">{ksh(p.price)}</p>
            {p.oldPrice && <p className="text-xs text-muted-foreground line-through">{ksh(p.oldPrice)}</p>}
            {p.unit && <p className="text-xs text-muted-foreground">{p.unit}</p>}
          </div>
          <button onClick={onAdd} aria-label={`Add ${p.name} to cart`} title="Add to cart" className="inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-full bg-glow sm:w-auto px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-glow-foreground animate-glow transition hover:scale-105">
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>Add to cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function CtaBand() {
  return (
    <section className="container-x mt-16 md:mt-24">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-5 py-12 sm:px-8 sm:py-16 text-center text-primary-foreground md:px-16">
        <p className="eyebrow">Free consultation</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-2xl sm:text-3xl md:text-5xl">Ready to transform your space?</h2>
        <p className="mx-auto mt-4 max-w-lg text-primary-foreground/75">Book a free on-site visit. We measure, advise and send a clear quote — no obligation.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/consultation" className="btn-accent">Book consultation</Link>
          <a href={`https://wa.me/${site.whatsapp}`} className="btn-ghost-light">WhatsApp us</a>
        </div>
      </div>
    </section>
  );
}

export function meta(title: string, description: string) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
