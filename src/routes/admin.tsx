import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth-shell";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Visitor Insights | Hope & HomeKe Admin" },
      { name: "description", content: "Private dashboard showing customer journeys and checkout drop-off." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Visitor Insights | Hope & HomeKe" },
      { property: "og:description", content: "Private store analytics dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

type Row = { path?: string; label?: string; source?: string; device?: string; count: number };
type Step = { t: string; p: string; l: string | null; at: string };
type Summary = {
  sessions: number;
  visitors: number;
  returning_sessions: number;
  funnel: { step: string; count: number }[];
  exit_pages: Row[];
  entry_pages: Row[];
  referrers: Row[];
  devices: Row[];
  top_clicks: Row[];
  recent: { id: string; visitor_id: string; is_returning: boolean; visit_number: number; device: string; started_at: string; source: string; ordered: boolean; steps: Step[] | null }[];
};

function Admin() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  if (session === undefined) return <div className="container-x py-24 text-center text-muted-foreground">Loading…</div>;
  if (!session) return <AdminSignIn />;
  return <Dashboard />;
}

function AdminSignIn() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setBusy(false);
    if (res.error) setMsg(res.error.message);
    else if (mode === "up" && !res.data.session) setMsg("Check your email to confirm your account, then sign in.");
  };
  return (
    <AuthShell title="Store admin" text="Sign in to see how visitors move through your shop.">
      <form className="space-y-4" onSubmit={submit}>
        <div><label className="label">Email</label><input required type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><label className="label">Password</label><input required minLength={6} type="password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <button disabled={busy} className="btn-primary w-full">{mode === "in" ? "Sign in" : "Create admin account"}</button>
      </form>
      <button className="mt-6 w-full text-center text-sm text-accent" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "First time? Create the admin account" : "Already have an account? Sign in"}
      </button>
    </AuthShell>
  );
}

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

function Dashboard() {
  const [days, setDays] = useState(7);
  const q = useQuery({
    queryKey: ["analytics", days],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("analytics_summary", { _days: days });
      if (error) throw error;
      return data as unknown as Summary;
    },
    refetchInterval: 30_000,
  });

  return (
    <div className="container-x py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Visitor insights</p>
          <h1 className="mt-2 font-display text-4xl">Where customers drop off</h1>
        </div>
        <div className="flex items-center gap-2">
          {[1, 7, 30, 90].map((d) => (
            <button key={d} onClick={() => setDays(d)} className={d === days ? "btn-primary !px-4 !py-2" : "btn-outline !px-4 !py-2"}>
              {d === 1 ? "24h" : `${d} days`}
            </button>
          ))}
          <button className="btn-outline !px-4 !py-2" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      </div>

      {q.isLoading && <p className="mt-10 text-muted-foreground">Loading…</p>}
      {q.error && (
        <p className="mt-10 text-muted-foreground">This account doesn't have access to visitor insights. Only the store admin can view this page.</p>
      )}
      {q.data && <Body d={q.data} />}
    </div>
  );
}

function Body({ d }: { d: Summary }) {
  const top = d.funnel[0]?.count ?? 0;
  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Visits" value={d.sessions} />
        <Stat label="Unique visitors" value={d.visitors} />
        <Stat label="Returning visits" value={d.returning_sessions} hint={`${pct(d.returning_sessions, d.sessions)}% of visits`} />
        <Stat label="Conversion" value={`${pct(d.funnel.at(-1)?.count ?? 0, top)}%`} hint="visits that placed an order" />
      </div>

      <section className="card mt-8 p-6">
        <h2 className="font-display text-2xl">Journey to checkout</h2>
        <div className="mt-5 space-y-3">
          {d.funnel.map((f, i) => {
            const prev = i ? d.funnel[i - 1]!.count : f.count;
            const lost = prev - f.count;
            return (
              <div key={f.step}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{f.step}</span>
                  <span>
                    {f.count} <span className="text-muted-foreground">({pct(f.count, top)}%)</span>
                    {i > 0 && lost > 0 && <span className="ml-2 text-destructive">−{lost} dropped ({pct(lost, prev)}%)</span>}
                  </span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${pct(f.count, top)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Table title="Last page before leaving (no order)" rows={d.exit_pages} k={(r) => r.path ?? ""} />
        <Table title="Most clicked" rows={d.top_clicks} k={(r) => `${r.label ?? ""}`} sub={(r) => r.path} />
        <Table title="Where visits start" rows={d.entry_pages} k={(r) => r.path ?? ""} />
        <Table title="Traffic sources" rows={d.referrers} k={(r) => r.source ?? ""} />
        <Table title="Devices" rows={d.devices} k={(r) => r.device ?? ""} />
      </div>

      <section className="card mt-8 p-6">
        <h2 className="font-display text-2xl">Latest visitor journeys</h2>
        <div className="mt-4 divide-y divide-border">
          {d.recent.length === 0 && <p className="text-sm text-muted-foreground">No visits yet.</p>}
          {d.recent.map((r) => (
            <details key={r.id} className="py-3">
              <summary className="flex cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="font-medium">{new Date(r.started_at).toLocaleString("en-KE")}</span>
                <span className="text-muted-foreground">{r.device} · {r.source}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{r.is_returning ? `Returning · visit #${r.visit_number}` : "New visitor"}</span>
                {r.ordered ? <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">Ordered</span> : <span className="text-xs text-muted-foreground">left at {lastPage(r.steps)}</span>}
              </summary>
              <ol className="mt-3 space-y-1 border-l border-border pl-4 text-sm">
                {(r.steps ?? []).filter((s) => s.t !== "page_exit").map((s, i) => (
                  <li key={i}>
                    <span className="text-muted-foreground">{new Date(s.at).toLocaleTimeString("en-KE")}</span>{" "}
                    <strong>{label(s.t)}</strong> {s.t === "page_view" ? s.p : `"${s.l ?? ""}" on ${s.p}`}
                  </li>
                ))}
              </ol>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

const label = (t: string) => ({ page_view: "Viewed", click: "Clicked", add_to_cart: "Added to cart", order_placed: "Placed order" })[t] ?? t;
const lastPage = (steps: Step[] | null) => [...(steps ?? [])].reverse().find((s) => s.t === "page_view")?.p ?? "—";

function Stat({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Table({ title, rows, k, sub }: { title: string; rows: Row[]; k: (r: Row) => string; sub?: (r: Row) => string | undefined }) {
  return (
    <section className="card p-6">
      <h2 className="font-display text-xl">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {rows.length === 0 && <li className="text-muted-foreground">No data yet.</li>}
        {rows.map((r, i) => (
          <li key={i} className="flex justify-between gap-4">
            <span className="min-w-0 truncate">{k(r)}{sub?.(r) && <span className="ml-2 text-muted-foreground">{sub(r)}</span>}</span>
            <span className="font-semibold">{r.count}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
