import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { images, posts } from "@/lib/data";
import { meta, PageHero } from "@/components/site";

export const Route = createFileRoute("/blog")({
  head: () => meta("Interior Design Ideas & Tips | Hope & HomeKe Blog", "Expert tips, trends and inspiration for Kenyan homes, offices and Airbnbs."),
  component: Blog,
});

function Blog() {
  const topics = ["All", ...Array.from(new Set(posts.map((p) => p.topic)))];
  const [t, setT] = useState("All");
  const [email, setEmail] = useState("");
  const [subbed, setSubbed] = useState(false);
  const list = posts.filter((p) => t === "All" || p.topic === t);
  const [first, ...rest] = list;
  return (
    <>
      <PageHero eyebrow="Inspiration & ideas" title="Blog & design ideas" text="Expert tips, curated trends and the latest in interior design." image={images.curtains} />
      <section className="container-x mt-12">
        <div className="flex flex-wrap gap-2">
          {topics.map((x) => <button key={x} onClick={() => setT(x)} className={`rounded-full border px-4 py-2 text-sm ${t === x ? "border-foreground bg-foreground text-background" : "border-border"}`}>{x}</button>)}
        </div>
        {first && (
          <article className="mt-10 grid items-center gap-8 md:grid-cols-2">
            <img src={first.image} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover" />
            <div><p className="eyebrow">{first.topic} · {first.read} min read</p><h2 className="mt-3 text-4xl">{first.title}</h2><p className="mt-4 text-muted-foreground">{first.excerpt}</p></div>
          </article>
        )}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {rest.map((b) => (
            <article key={b.slug}>
              <img src={b.image} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
              <p className="mt-4 text-xs uppercase tracking-wider text-accent">{b.topic} · {b.read} min</p>
              <h3 className="mt-1 text-xl">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="container-x mt-16 md:mt-24">
        <div className="rounded-3xl bg-secondary p-10 text-center md:p-16">
          <p className="eyebrow">Newsletter</p>
          <h2 className="mt-3 text-3xl md:text-4xl">Stay inspired</h2>
          <p className="mt-3 text-muted-foreground">Weekly design inspiration, tips and special offers.</p>
          {subbed ? <p className="mt-6 font-semibold text-primary">Thanks for subscribing!</p> : (
            <form className="mx-auto mt-6 flex max-w-md gap-2" onSubmit={(e) => { e.preventDefault(); setSubbed(true); }}>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="field" />
              <button className="btn-primary">Subscribe</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
