import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Mail, MessageCircle, Phone } from "lucide-react";
import { images, services, site } from "@/lib/data";
import { meta, PageHero, SectionHead } from "@/components/site";

export const Route = createFileRoute("/consultation")({
  head: () => meta("Book a Free Interior Consultation | Hope & HomeKe", "Free on-site measurement, expert design advice and a detailed quote. No obligation."),
  component: Consultation,
});

const steps = [["Book appointment", "Pick a date that suits you."], ["Site visit", "We measure and assess your space."], ["Expert advice", "Recommendations tailored to your budget."], ["Detailed quote", "Transparent pricing and timeline."]];

function Consultation() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHero eyebrow="Free consultation" title="Book your free interior design consultation" text="No obligation, no cost. Our designers visit, measure and advise." image={images.curtains}>
        {["Free on-site measurement", "Expert design advice", "Detailed quote"].map((t) => <span key={t} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-accent" />{t}</span>)}
      </PageHero>
      <section className="container-x mt-16 md:mt-24">
        <SectionHead eyebrow="How it works" title="Four simple steps" />
        <div className="grid gap-6 md:grid-cols-4">
          {steps.map(([t, d], i) => (
            <div key={t} className="relative card p-6"><span className="grid h-10 w-10 place-items-center rounded-full bg-accent font-semibold text-accent-foreground">{i + 1}</span><h3 className="mt-4 text-xl">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></div>
          ))}
        </div>
      </section>
      <section className="container-x mt-16 md:mt-24 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="eyebrow">Get in touch</p>
          <h2 className="mt-3 text-4xl">Prefer to talk?</h2>
          <p className="mt-4 text-muted-foreground">We respond to all enquiries within 24 hours.</p>
          <div className="mt-8 space-y-4">
            <a href={`tel:${site.phone}`} className="card flex items-center gap-4 p-5 hover:border-accent"><Phone className="h-5 w-5 text-accent" /><div><p className="text-sm text-muted-foreground">Call us</p><p className="font-semibold">{site.phone}</p></div></a>
            <a href={`mailto:${site.email}`} className="card flex items-center gap-4 p-5 hover:border-accent"><Mail className="h-5 w-5 text-accent" /><div><p className="text-sm text-muted-foreground">Email</p><p className="font-semibold">{site.email}</p></div></a>
            <a href={`https://wa.me/${site.whatsapp}`} className="card flex items-center gap-4 p-5 hover:border-accent"><MessageCircle className="h-5 w-5 text-accent" /><div><p className="text-sm text-muted-foreground">WhatsApp</p><p className="font-semibold">Chat instantly</p></div></a>
          </div>
        </div>
        <form className="card grid gap-4 p-5 sm:p-8 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          {sent ? (
            <div className="py-16 text-center sm:col-span-2"><h3 className="text-3xl">Thank you!</h3><p className="mt-3 text-muted-foreground">We'll call you within 24 hours to confirm your visit.</p></div>
          ) : (<>
            <div><label className="label">Full name</label><input required className="field" /></div>
            <div><label className="label">Phone</label><input required type="tel" className="field" /></div>
            <div><label className="label">Email</label><input type="email" className="field" /></div>
            <div><label className="label">Location</label><input required className="field" placeholder="e.g. Kilimani" /></div>
            <div><label className="label">Service</label><select className="field">{services.map((s) => <option key={s.title}>{s.title}</option>)}</select></div>
            <div><label className="label">Preferred date</label><input type="date" className="field" /></div>
            <div className="sm:col-span-2"><label className="label">Tell us about your space</label><textarea rows={4} className="field" /></div>
            <button className="btn-primary sm:col-span-2">Book free consultation</button>
          </>)}
        </form>
      </section>
    </>
  );
}
