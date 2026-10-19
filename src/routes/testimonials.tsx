import { createFileRoute } from "@tanstack/react-router";
import { images, testimonials } from "@/lib/data";
import { CtaBand, meta, PageHero, Stars } from "@/components/site";

export const Route = createFileRoute("/testimonials")({
  head: () => meta("Customer Reviews | Hope & HomeKe", "Real stories from homeowners and businesses we've transformed across Kenya."),
  component: Testimonials,
});

function Testimonials() {
  return (
    <>
      <PageHero eyebrow="Testimonials" title="What our customers say" text="Real stories from homeowners and businesses we've transformed." image={images.hero} />
      <section className="container-x mt-12 grid grid-cols-3 gap-4 text-center">
        {[["500+", "Happy customers"], ["4.9★", "Average rating"], ["100%", "Satisfaction"]].map(([n, l]) => <div key={l} className="card p-6"><p className="font-display text-4xl">{n}</p><p className="text-sm text-muted-foreground">{l}</p></div>)}
      </section>
      <section className="container-x mt-12 columns-1 gap-5 md:columns-2 lg:columns-3">
        {testimonials.map((t) => (
          <figure key={t.name} className="card mb-5 break-inside-avoid p-8">
            <Stars n={t.rating} />
            <blockquote className="mt-4 font-display text-xl leading-snug">“{t.text}”</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary font-semibold">{t.name[0]}</span>
              <span className="text-sm"><span className="block font-semibold">{t.name}</span><span className="text-muted-foreground">{t.place}</span></span>
            </figcaption>
          </figure>
        ))}
      </section>
      <CtaBand />
    </>
  );
}
