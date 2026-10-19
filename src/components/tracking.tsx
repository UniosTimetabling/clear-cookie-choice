import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { browserOptedOut, getConsent, installTracking, setConsent, trackPageView } from "@/lib/tracking";

/** Records page views on every navigation and shows the cookie choice banner. */
export function Tracking() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [showBanner, setShowBanner] = useState(false);
  const [consentTick, setConsentTick] = useState(0);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    trackPageView();
  }, [pathname, consentTick]);

  useEffect(() => {
    // Browsers set to "Do Not Track" are never tracked and never asked.
    if (!browserOptedOut() && getConsent() === null) setShowBanner(true);
    const cleanup = installTracking();
    const onConsent = () => setConsentTick((t) => t + 1);
    const onOpen = () => setShowBanner(true);
    window.addEventListener("hh-consent", onConsent);
    window.addEventListener("hh-open-consent", onOpen);
    return () => {
      cleanup();
      window.removeEventListener("hh-consent", onConsent);
      window.removeEventListener("hh-open-consent", onOpen);
    };
  }, []);

  if (!showBanner || pathname.startsWith("/admin")) return null;
  const choose = (v: "granted" | "denied") => {
    setConsent(v);
    setShowBanner(false);
  };
  return (
    <div role="dialog" aria-label="Cookie choices" className="fixed inset-x-2 bottom-2 z-[60] sm:inset-x-4 sm:bottom-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/70 px-4 py-3 shadow-soft backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-foreground">
          We use cookies to improve your experience.{" "}
          <Link to="/privacy-policy" className="text-accent underline">Learn more</Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button className="btn-outline !px-4 !py-1.5 text-sm" onClick={() => choose("denied")}>Decline</button>
          <button className="btn-primary !px-4 !py-1.5 text-sm" onClick={() => choose("granted")}>Accept</button>
        </div>
      </div>
    </div>
  );
}

export function openCookieChoices() {
  window.dispatchEvent(new Event("hh-open-consent"));
}
