import { createFileRoute } from "@tanstack/react-router";
import { images } from "@/lib/data";
import { CtaBand, meta, PageHero, SectionHead } from "@/components/site";

export const Route = createFileRoute("/about")({
  head: () => meta("About Hope & HomeKe | Nairobi Interior Décor Studio", "Meet the Nairobi team transforming homes, offices and hospitality spaces across Kenya."),
  component: About,
});

const offer = [
  ["Flooring", "Wall-to-wall carpets, 3D carpets, grass carpets, laminate and mkeka ya mbao."],
  ["Window treatments", "Curtains, curtain rods, roller and vertical blinds, and window films."],
  ["Bedding & comfort", "Quality duvets, bedsheets and mattress protectors."],
  ["Outdoor & security", "Privacy fences and quality door locks for modern living."],
];

function About() {
  return (
    <>
      <PageHero eyebrow="Our story" title="About Hope & HomeKe" text="Transforming spaces across Nairobi with décor that combines style, comfort and function." image={images.hero} />
      <section className="container-x mt-16 md:mt-24 grid items-center gap-8 md:gap-12 md:grid-cols-2">
        <div>
          <p className="eyebrow">Who we are</p>
          <h2 className="mt-3 text-4xl">A Nairobi décor shop with a designer's eye</h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">Hope & HomeKe offers stylish and practical solutions for homes and offices across Kenya. We specialise in wall-to-wall carpets, grass carpets, window blinds, curtains and accessories, privacy fences and quality locks.</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">We believe every space tells a story. With attention to detail and a commitment to excellence, we turn houses into homes and offices into inspiring workplaces.</p>
        </div>
        <img src={images.curtains} alt="" loading="lazy" className="aspect-[4/5] w-full rounded-3xl object-cover shadow-soft" />
      </section>
      <section className="mt-16 bg-secondary py-16 md:mt-24 md:py-24">
        <div className="container-x">
          <SectionHead eyebrow="What we offer" title="Our products" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {offer.map(([t, d]) => <div key={t} className="card p-7"><h3 className="text-xl">{t}</h3><p className="mt-3 text-sm text-muted-foreground">{d}</p></div>)}
          </div>
        </div>
      </section>
      <section className="container-x mt-16 md:mt-24 grid gap-6 text-center md:grid-cols-3">
        {[["Quality", "Premium materials and durable finishes."], ["Service", "Professional consultation and installation."], ["Transformation", "Spaces designed around your lifestyle."]].map(([t, d]) => (
          <div key={t}><p className="font-display text-5xl text-accent">{t}</p><p className="mt-3 text-muted-foreground">{d}</p></div>
        ))}
      </section>
      <CtaBand />
    </>
  );
}
