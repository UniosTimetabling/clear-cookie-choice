import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "../lib/cart";
import { Header, Footer, WhatsAppFab, BackToTop } from "../components/site";
import { Tracking } from "../components/tracking";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-lg text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-4 font-display text-6xl text-foreground md:text-7xl">This room is empty</h1>
        <p className="mt-4 text-muted-foreground">
          The page you're looking for has moved or no longer exists. Let's get you back to beautiful spaces.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">Back home</Link>
          <Link to="/products" className="btn-outline">Browse products</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-lg text-center">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-4 font-display text-5xl text-foreground">This page didn't load</h1>
        <p className="mt-4 text-muted-foreground">
          A small hiccup on our side. Try again, or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-primary"
          >
            Try again
          </button>
          <a href="/" className="btn-outline">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Hope & HomeKe — Interior Décor Nairobi" },
      { name: "description", content: "Curtains, carpets, blinds and interior décor across Kenya." },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <CartProvider>
        <Header />
        <main className="min-h-[60vh]"><Outlet /></main>
        <FooterGate />
        <WhatsAppFab />
        <BackToTop />
        <Tracking />
        <Toaster position="top-right" richColors closeButton />
      </CartProvider>
    </QueryClientProvider>
  );
}

const NO_FOOTER = ["/admin", "/products", "/self-quote", "/cart", "/checkout", "/account", "/login", "/register", "/forgot-password", "/reset-password"];

function FooterGate() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hide = NO_FOOTER.some((p) => pathname === p || pathname.startsWith(p + "/"));
  return hide ? null : <Footer />;
}
