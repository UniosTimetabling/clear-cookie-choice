// Browser-only visitor journey tracking. Every function is safe to import during SSR;
// browser globals are only touched inside function bodies called from effects/handlers.

export type Consent = "granted" | "denied" | null;
type TrackEvent = { type: string; path: string; label?: string | undefined; meta?: Record<string, unknown> | undefined; at: string };

const YEAR = 60 * 60 * 24 * 365;
const SESSION_MAX_AGE = 60 * 30; // a visit ends after 30 minutes of inactivity
export const CONSENT_COOKIE = "hh_consent";

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]!) : null;
}
function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
}
function deleteCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; Path=/`;
}
const rid = () => (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);

/** Browser "Do Not Track" / Global Privacy Control signal. */
export function browserOptedOut(): boolean {
  if (typeof navigator === "undefined") return false;
  const n = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string };
  const w = window as Window & { doNotTrack?: string };
  return n.globalPrivacyControl === true || n.doNotTrack === "1" || w.doNotTrack === "1" || n.msDoNotTrack === "1";
}

export function getConsent(): Consent {
  const c = getCookie(CONSENT_COOKIE);
  return c === "granted" || c === "denied" ? c : null;
}

export function setConsent(value: "granted" | "denied") {
  setCookie(CONSENT_COOKIE, value, YEAR);
  if (value === "denied") {
    ["hh_vid", "hh_sid", "hh_visits"].forEach(deleteCookie);
    queue = [];
  }
  window.dispatchEvent(new CustomEvent("hh-consent", { detail: value }));
}

export const canTrack = () => typeof window !== "undefined" && getConsent() === "granted" && !browserOptedOut();

let queue: TrackEvent[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
let session: { sid: string; vid: string; isNew: boolean; visit: number } | null = null;

function ensureSession() {
  let vid = getCookie("hh_vid");
  const returning = !!vid;
  if (!vid) vid = rid();
  let sid = getCookie("hh_sid");
  const isNew = !sid;
  let visit = Number(getCookie("hh_visits") || "0");
  if (!sid) {
    sid = rid();
    visit += 1;
  }
  setCookie("hh_vid", vid, YEAR);
  setCookie("hh_visits", String(Math.max(visit, 1)), YEAR);
  setCookie("hh_sid", sid, SESSION_MAX_AGE); // sliding: refreshed on every event
  session = { sid, vid, isNew, visit: Math.max(visit, 1) };
  return { ...session, returning: returning && visit > 1 };
}

function device() {
  const w = window.innerWidth;
  return w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop";
}

function flush(useBeacon = false) {
  if (!queue.length || !session) return;
  const s = ensureSession();
  const params = new URLSearchParams(location.search);
  const payload = JSON.stringify({
    sessionId: s.sid,
    visitorId: s.vid,
    newSession: s.isNew,
    isReturning: s.returning,
    visitNumber: s.visit,
    landingPath: location.pathname,
    referrer: document.referrer && !document.referrer.startsWith(location.origin) ? new URL(document.referrer).hostname : "",
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
    device: device(),
    events: queue.splice(0, 50),
  });
  session.isNew = false;
  if (useBeacon && navigator.sendBeacon) {
    navigator.sendBeacon("/api/public/track", new Blob([payload], { type: "application/json" }));
  } else {
    void fetch("/api/public/track", { method: "POST", headers: { "content-type": "application/json" }, body: payload, keepalive: true }).catch(() => {});
  }
}

export function track(type: string, label?: string, meta?: Record<string, unknown>) {
  if (!canTrack()) return;
  if (!session) ensureSession();
  queue.push({ type, path: location.pathname, label: label?.slice(0, 200), meta, at: new Date().toISOString() });
  if (type === "order_placed" || type === "page_exit") return flush(true);
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => flush(), 2000);
}

let pageStart = 0;
let maxScroll = 0;
let lastPath = "";

export function trackPageView() {
  if (!canTrack()) return;
  if (lastPath && lastPath !== location.pathname) endPage(lastPath);
  lastPath = location.pathname;
  pageStart = Date.now();
  maxScroll = 0;
  track("page_view", document.title);
}

function endPage(path: string) {
  if (!pageStart) return;
  queue.push({ type: "page_exit", path, meta: { seconds: Math.round((Date.now() - pageStart) / 1000), scroll: maxScroll }, at: new Date().toISOString() });
}

function describe(el: Element): string {
  const named = el.closest("[data-track]")?.getAttribute("data-track");
  if (named) return named;
  const text = (el.getAttribute("aria-label") || (el as HTMLElement).innerText || el.getAttribute("title") || el.querySelector("img")?.getAttribute("alt") || "").trim().replace(/\s+/g, " ");
  return text.slice(0, 80) || el.tagName.toLowerCase();
}

/** Installs global listeners once. Returns a cleanup function. */
export function installTracking() {
  const onClick = (e: MouseEvent) => {
    if (!canTrack()) return;
    const el = (e.target as Element | null)?.closest("a,button,[role=button],input[type=submit],[data-track],select,label");
    if (!el) return;
    const href = el.getAttribute("href");
    track("click", describe(el), href ? { href } : undefined);
  };
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (h > 0) maxScroll = Math.max(maxScroll, Math.round((window.scrollY / h) * 100));
  };
  const onHide = () => {
    if (document.visibilityState !== "hidden" || !canTrack()) return;
    endPage(location.pathname);
    pageStart = Date.now();
    flush(true);
  };
  document.addEventListener("click", onClick, true);
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onHide);
  return () => {
    document.removeEventListener("click", onClick, true);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", onHide);
  };
}
