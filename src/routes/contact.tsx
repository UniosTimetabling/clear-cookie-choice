import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { images, site } from "@/lib/data";
import { meta, PageHero } from "@/components/site";

export const Route = createFileRoute("/contact")({
  head: () => meta("Contact Hope & HomeKe | Nairobi Interior Décor", "Call, WhatsApp, email or visit our Nairobi showroom. We reply within 24 hours."),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const items = [
    [Phone, "Call us", site.phone, `tel:${site.phone}`],
    [MessageCircle, "WhatsApp", "Chat instantly", `https://wa.me/${site.whatsapp}`],
    [Mail, "Email", site.email, `mailto:${site.email}`],
    [MapPin, "Showroom", site.location, undefined],
  ] as const;
  return (
    <>
      <PageHero eyebrow="Get in touch" title="We'd love to hear from you" text="Questions or need help? Reach us by phone, email, or visit our showroom." image={images.blinds} />
      <section className="container-x -mt-10 relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([Icon, t, v, href]) => (
          <a key={t} href={href} className="card p-6 shadow-soft hover:border-accent"><Icon className="h-6 w-6 text-accent" /><p className="mt-4 text-sm text-muted-foreground">{t}</p><p className="font-semibold">{v}</p></a>
        ))}
      </section>
      <section className="container-x mt-16 grid gap-10 md:mt-20 lg:gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Send a message</p>
          <h2 className="mt-3 text-4xl">How can we help?</h2>
          <p className="mt-4 text-muted-foreground">24-hour response time guaranteed — we value your time as much as you do.</p>
          <img src={images.hero} alt="" loading="lazy" className="mt-8 aspect-video w-full rounded-3xl object-cover" />
        </div>
        <form className="card grid gap-4 p-8" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          {sent ? <div className="py-20 text-center"><h3 className="text-3xl">Message sent</h3><p className="mt-3 text-muted-foreground">We'll get back to you within 24 hours.</p></div> : (<>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Name</label><input required className="field" /></div>
              <div><label className="label">Phone</label><input type="tel" className="field" /></div>
            </div>
            <div><label className="label">Email</label><input required type="email" className="field" /></div>
            <div><label className="label">Subject</label><input className="field" /></div>
            <div><label className="label">Message</label><textarea required rows={6} className="field" /></div>
            <button className="btn-primary">Send message</button>
          </>)}
        </form>
      </section>
    </>
  );
}
