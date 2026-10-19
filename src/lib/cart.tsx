import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { track } from "./tracking";
import { products, resolveVariant, type Product, type Variant } from "./data";

export type LineOptions = { color?: string | undefined; size?: string | undefined };
type Line = { key: string; slug: string; qty: number } & LineOptions;
const lineKey = (slug: string, o: LineOptions = {}) => [slug, o.color ?? "", o.size ?? ""].join("|");
export const optionLabel = (o: LineOptions) => [o.color && `Colour: ${o.color}`, o.size && `Size: ${o.size}`].filter(Boolean).join(" · ");
type Ctx = {
  lines: (Line & { product: Product; variant: Variant; price: number; image: string })[];
  count: number; total: number;
  add: (slug: string, qty?: number, options?: LineOptions) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  wishlist: string[];
  toggleWish: (slug: string) => void;
};

const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setLines((JSON.parse(localStorage.getItem("hh-cart") || "[]") as Line[]).map((l) => ({ ...l, key: l.key ?? lineKey(l.slug, l) })));
      setWishlist(JSON.parse(localStorage.getItem("hh-wish") || "[]"));
    } catch { /* ignore */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("hh-cart", JSON.stringify(lines)); }, [lines, ready]);
  useEffect(() => { if (ready) localStorage.setItem("hh-wish", JSON.stringify(wishlist)); }, [wishlist, ready]);

  const full = lines
    .map((l) => ({ ...l, product: products.find((p) => p.slug === l.slug)! }))
    .filter((l) => l.product)
    .map((l) => {
      const variant = resolveVariant(l.product, { color: l.color, size: l.size });
      return { ...l, variant, price: variant.price, image: variant.image };
    });

  const router = useRouter();

  const value: Ctx = {
    lines: full,
    count: full.reduce((s, l) => s + l.qty, 0),
    total: full.reduce((s, l) => s + l.qty * l.price, 0),
    add: (slug, qty = 1, options = {}) => {
      const product = products.find((p) => p.slug === slug);
      const key = lineKey(slug, options);
      setLines((ls) => ls.some((l) => l.key === key)
        ? ls.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l))
        : [...ls, { key, slug, qty, ...options }]);
      if (product) {
        track("add_to_cart", product.name, { slug, qty, ...options });
        toast.success(`${product.name} added to cart`, {
          id: `cart-${slug}`,
          duration: Infinity,
          description: optionLabel(options) || "Your item is in the cart — ready when you are.",
          action: {
            label: "Proceed to checkout",
            onClick: () => router.navigate({ to: "/checkout" }),
          },
        });
      }
    },
    setQty: (key, qty) => setLines((ls) => ls.map((l) => (l.key === key ? { ...l, qty: Math.max(1, qty) } : l))),
    remove: (key) => setLines((ls) => ls.filter((l) => l.key !== key)),
    clear: () => setLines([]),
    wishlist,
    toggleWish: (slug) => setWishlist((w) => (w.includes(slug) ? w.filter((s) => s !== slug) : [...w, slug])),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
