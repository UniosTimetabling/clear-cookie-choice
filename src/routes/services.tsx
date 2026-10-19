import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Clock } from "lucide-react";
import { images, services, site } from "@/lib/data";
import { CtaBand, meta, PageHero, SectionHead } from "@/components/site";

export const Route = createFileRoute("/services")({
  head: () => meta("Interior Services & Installation | Hope & HomeKe", "Carpet, curtain, blind, flooring and privacy fence installation across Nairobi with transparent pricing."),
  component: Services,
});

function Services() {
  return (
    <>
      <PageHero eyebrow="Our services" title="Professional interior solutions" text="Comprehensive solutions for homes, offices and commercial spaces, delivered by experienced installers." image={images.blinds}>
        <Link to="/consultation" className="btn-accent">Book free consultation</Link>
        <a href={`tel:${site.phone}`} className="btn-ghost-light">Call now</a>
      </PageHero>
      <section className="container-x mt-16 md:mt-24">
        <SectionHead eyebrow="What we do" title="More than products" text="We measure, recommend, supply and install — so the result fits your space perfectly." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <article key={s.title} className="card flex flex-col p-8 transition hover:-translate-y-1 hover:shadow-soft">
              <span className="font-display text-5xl text-accent/40">0{i + 1}</span>
              <h3 className="mt-4 text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{s.text}</p>
              <ul className="mt-6 space-y-2 text-sm">{s.points.map((p) => <li key={p} className="flex gap-2"><Check className="h-4 w-4 text-primary" />{p}</li>)}</ul>
              <div className="mt-auto pt-8">
                <p className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" />{s.time}</p>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-4">
                  <p className="font-semibold">{s.price}</p>
                  <Link to="/consultation" className="text-sm font-semibold text-accent">Get quote →</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
