import type { ReactNode } from "react";
import { images } from "@/lib/data";

export function AuthShell({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <section className="grid min-h-[80vh] lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={images.curtains} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <p className="absolute bottom-12 left-12 max-w-sm font-display text-4xl text-ink-foreground">Beautiful spaces start here.</p>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-4xl">{title}</h1>
          <p className="mt-2 text-muted-foreground">{text}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  );
}
