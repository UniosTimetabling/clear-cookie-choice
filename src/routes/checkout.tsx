import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ksh, site } from "@/lib/data";
import { optionLabel, useCart } from "@/lib/cart";
import { meta } from "@/components/site";
import { toast } from "sonner";
import { placeOrder } from "@/lib/orders.functions";
import { track } from "@/lib/tracking";

export const Route = createFileRoute("/checkout")({
  head: () => meta("Checkout | Hope & HomeKe", "Complete your Hope & HomeKe order on WhatsApp."),
  component: Checkout,
});

function Checkout() {
  const { lines, total } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const imageUrl = (src: string) => new URL(src, window.location.origin).href;
    const msg = [
      "*NEW ORDER – Hope & HomeKe*",
      "━━━━━━━━━━━━━━━━━━━━━",
      `Date: ${new Date().toLocaleString("en-KE")}`,
      `Customer: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      address && `Delivery location: ${address}`,
      "",
      "*ORDER DETAILS*",
      "━━━━━━━━━━━━━━━━━━━━━",
      ...lines.flatMap((l, i) => [
        `${i + 1}. ${l.product.name}${l.variant.label ? ` (${l.variant.label})` : ""}`,
        l.color ? `   Colour: ${l.color}` : "",
        l.size ? `   Size: ${l.size}` : "",
        `   Quantity: ${l.qty}`,
        `   Price: ${ksh(l.price)}${l.product.unit ? ` ${l.product.unit}` : ""}`,
        `   Total: ${ksh(l.qty * l.price)}`,
        `   Image: ${imageUrl(l.image)}`,
        "",
      ].filter((x) => x !== "")),
      "",
      "*ORDER SUMMARY*",
      "━━━━━━━━━━━━━━━━━━━━━",
      `Subtotal: ${ksh(total)}`,
      `*TOTAL: ${ksh(total)}*`,
      "Delivery: to be agreed on WhatsApp",
      notes && `Notes: ${notes}`,
    ].filter((x): x is string => typeof x === "string").join("\n");
    // Open the tab now (before waiting) so browsers don't block it.
    const wa = window.open("", "_blank");
    setBusy(true);
    try {
      const { orderNumber } = await placeOrder({
        data: {
          name, phone, email, address: address || undefined, notes: notes || undefined,
          items: lines.map((l) => ({
            name: l.product.name, variant: l.variant.label, color: l.color, size: l.size,
            qty: l.qty, price: l.price, total: l.qty * l.price, image: imageUrl(l.image),
          })),
        },
      });
      const url = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Order ${orderNumber}\n${msg}`)}`;
      if (wa) wa.location.href = url; else window.location.href = url;
      track("order_placed", orderNumber, { total, items: lines.length });
      toast.success(`Order ${orderNumber} saved`);
    } catch (err) {
      wa?.close();
      toast.error(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="container-x py-10 sm:py-16">
      <h1 className="text-3xl sm:text-4xl md:text-5xl">Checkout</h1>
      <p className="mt-3 text-muted-foreground">Send your order on WhatsApp — we'll confirm delivery and cost with you directly.</p>
      <form className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]" onSubmit={send}>
        <fieldset className="card grid h-fit gap-4 p-5 sm:p-6 sm:grid-cols-2">
          <legend className="px-2 font-display text-xl">Your details</legend>
          <div><label className="label">Full name</label><input required className="field" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label className="label">Phone</label><input required type="tel" className="field" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div className="sm:col-span-2"><label className="label">Email</label><input required type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="sm:col-span-2"><label className="label">Delivery location (optional)</label><input className="field" value={address} onChange={(e) => setAddress(e.target.value)} /></div>
          <div className="sm:col-span-2"><label className="label">Notes (optional)</label><textarea rows={3} className="field" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        </fieldset>
        <aside className="card h-fit p-6">
          <h2 className="text-2xl">Order summary</h2>
          <ul className="mt-6 space-y-4">
            {lines.map((l) => <li key={l.key} className="flex items-center gap-3 text-sm"><img src={l.image} alt="" className="h-14 w-14 rounded-lg object-cover" /><span className="flex-1">{l.product.name} × {l.qty}{optionLabel(l) && <span className="block text-xs text-muted-foreground">{optionLabel(l)}</span>}</span><span>{ksh(l.qty * l.price)}</span></li>)}
            {lines.length === 0 && <li className="text-sm text-muted-foreground">Your cart is empty. <Link to="/products" className="underline">Shop now</Link></li>}
          </ul>
          <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm"><div className="flex justify-between text-muted-foreground"><span>Delivery</span><span>Agreed on WhatsApp</span></div></div>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-semibold"><span>Total</span><span>{ksh(total)}</span></div>
          <button disabled={!lines.length || busy} className="btn-accent mt-6 w-full disabled:opacity-50">{busy ? "Placing order…" : "Checkout on WhatsApp"}</button>
        </aside>
      </form>
    </section>
  );
}
