import { Link } from "@tanstack/react-router";
import { CalendarDays, FileText, MapPin, Phone, ShieldCheck, Undo2 } from "lucide-react";
import { policies, policyContact, type Policy } from "@/lib/policies";

const icons = { privacy: ShieldCheck, refund: Undo2, terms: FileText };
const paths = { privacy: "/privacy", refund: "/refund-returns-policy", terms: "/terms" } as const;

export function PolicyDoc({ policy }: { policy: Policy }) {
  const Icon = icons[policy.id];
  return (
    <article className="grid gap-10 lg:grid-cols-[220px_1fr]">
      <aside className="hidden lg:block">
        <div className="card sticky top-32 p-5">
          <p className="eyebrow">Contents</p>
          <ol className="mt-4 space-y-2 text-sm">
            {policy.sections.map((s, i) => (
              <li key={s.title}><a href={`#${policy.id}-${i + 1}`} className="text-muted-foreground hover:text-accent">{i + 1}. {s.title}</a></li>
            ))}
            {policy.id === "privacy" && <li><a href={`#${policy.id}-contact`} className="text-muted-foreground hover:text-accent">{policy.sections.length + 1}. Contact</a></li>}
          </ol>
        </div>
      </aside>
      <div>
        <p className="eyebrow flex items-center gap-2"><Icon className="h-4 w-4" />{policy.eyebrow}</p>
        <h2 className="mt-3 text-3xl md:text-4xl">{policy.title}</h2>
        {policy.effective && <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="h-4 w-4" />Effective Date: {policy.effective}</p>}
        <p className="mt-6 leading-relaxed text-muted-foreground">{policy.intro}</p>
        <div className="mt-10 space-y-6">
          {policy.sections.map((s, i) => (
            <section key={s.title} id={`${policy.id}-${i + 1}`} className="card scroll-mt-32 p-6">
              <h3 className="flex items-center gap-3 text-xl">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-accent-foreground">{i + 1}</span>
                {s.title}
              </h3>
              {s.text && <p className="mt-3 leading-relaxed text-muted-foreground">{s.text}</p>}
              {s.items && (
                <ul className="mt-3 space-y-2">
                  {s.items.map((it) => <li key={it} className="flex gap-3 text-muted-foreground"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{it}</li>)}
                </ul>
              )}
            </section>
          ))}
          <section id={`${policy.id}-contact`} className="scroll-mt-32 rounded-2xl bg-ink p-6 text-ink-foreground">
            <h3 className="text-xl">{policy.contactTitle}</h3>
            <p className="mt-3 flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-accent" />Hotline: <a href={`tel:${policyContact.hotline}`} className="hover:text-accent">{policyContact.hotline}</a></p>
            <p className="mt-2 flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-accent" />Location: {policyContact.location}</p>
          </section>
        </div>
      </div>
    </article>
  );
}

export function PolicyTabs({ active }: { active?: Policy["id"] | undefined }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {policies.map((p) => {
        const Icon = icons[p.id];
        const on = p.id === active;
        return (
          <Link key={p.id} to={paths[p.id]} className={on ? "btn-primary" : "btn-outline"}>
            <Icon className="h-4 w-4" />{p.tab}
          </Link>
        );
      })}
    </div>
  );
}

export function PolicyHeader({ active }: { active?: Policy["id"] | undefined }) {
  return (
    <section className="bg-secondary/50 py-16">
      <div className="container-x text-center">
        <p className="eyebrow">Legal Documents</p>
        <h1 className="mt-3 text-4xl md:text-5xl">Our Policies & Terms</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Transparency is at the heart of Hope & Home. Read our commitments to you.</p>
        <div className="mt-8"><PolicyTabs active={active} /></div>
      </div>
    </section>
  );
}

export function PolicyPage({ id }: { id: Policy["id"] }) {
  const policy = policies.find((p) => p.id === id)!;
  return (
    <>
      <PolicyHeader active={id} />
      <div className="container-x py-16"><PolicyDoc policy={policy} /></div>
    </>
  );
}
