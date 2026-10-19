import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ksh } from "@/lib/data";
import { optionLabel, useCart } from "@/lib/cart";
import { meta } from "@/components/site";

export const Route = createFileRoute("/cart")({
  head: () => meta("Your Cart | Hope & HomeKe", "Review the items in your Hope & HomeKe shopping cart."),
  component: Cart,
});

function Cart() {
  const { lines, total, setQty, remove } = useCart();
  return (
    <section className="container-x py-10 sm:py-16">
      <h1 className="text-3xl sm:text-4xl md:text-5xl">Your cart</h1>
      {lines.length === 0 ? (
        <div className="card mt-8 p-8 text-center sm:mt-10 sm:p-16"><p className="text-muted-foreground">Your cart is empty.</p><Link to="/products" className="btn-primary mt-6">Start shopping</Link></div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <ul className="divide-y divide-border border-y border-border">
            {lines.map((l) => (
              <li key={l.key} className="flex gap-3 py-5 sm:gap-5 sm:py-6">
                <img src={l.image} alt="" className="h-24 w-20 shrink-0 rounded-xl sm:h-28 sm:w-24 object-cover" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex justify-between gap-4"><Link to="/products/$slug" params={{ slug: l.slug }} className="font-display text-base leading-tight sm:text-lg">{l.product.name}</Link><p className="font-semibold">{ksh(l.price * l.qty)}</p></div>
                  {optionLabel(l) && <p className="text-sm font-medium">{optionLabel(l)}</p>}
                  <p className="text-sm text-muted-foreground">{ksh(l.price)} {l.product.unit}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-border">
                      <button className="p-2" onClick={() => setQty(l.key, l.qty - 1)} aria-label="Less"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-8 text-center text-sm">{l.qty}</span>
                      <button className="p-2" onClick={() => setQty(l.key, l.qty + 1)} aria-label="More"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <button onClick={() => remove(l.key)} className="text-muted-foreground hover:text-destructive" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="card h-fit p-6">
            <h2 className="text-2xl">Summary</h2>
            <div className="mt-6 space-y-3 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{ksh(total)}</span></div><div className="flex justify-between text-muted-foreground"><span>Delivery</span><span>Agreed on WhatsApp</span></div></div>
            <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold"><span>Total</span><span>{ksh(total)}</span></div>
            <Link to="/checkout" className="btn-primary mt-6 w-full">Checkout</Link>
          </aside>
        </div>
      )}
    </section>
  );
}
