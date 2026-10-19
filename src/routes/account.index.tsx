import { createFileRoute, Link } from "@tanstack/react-router";
import { ksh } from "@/lib/data";
import { sampleOrders } from "@/lib/orders";
import { useCart } from "@/lib/cart";
import { meta } from "@/components/site";

export const Route = createFileRoute("/account/")({
  head: () => meta("My Account | Hope & HomeKe", "Your Hope & HomeKe account overview."),
  component: Dashboard,
});

function Dashboard() {
  const { wishlist, count } = useCart();
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl">Hello there 👋</h1>
      <p className="mt-2 text-muted-foreground">Here's what's happening with your account.</p>
      <div className="mt-6 grid grid-cols-3 gap-3 sm:mt-8 sm:gap-4">
        {[["Orders", sampleOrders.length, "/account/orders"], ["Wishlist", wishlist.length, "/account/wishlist"], ["In cart", count, "/cart"]].map(([l, n, to]) => (
          <Link key={l as string} to={to as "/cart"} className="card p-4 hover:border-accent sm:p-6"><p className="font-display text-3xl sm:text-4xl">{n}</p><p className="text-sm text-muted-foreground">{l}</p></Link>
        ))}
      </div>
      <h2 className="mt-12 text-2xl">Recent orders</h2>
      <div className="card mt-4 divide-y divide-border">
        {sampleOrders.map((o) => <div key={o.id} className="grid grid-cols-2 gap-1 p-4 text-sm sm:flex sm:justify-between sm:p-5"><span className="font-semibold">{o.id}</span><span className="order-last text-muted-foreground sm:order-none">{o.date}</span><span className="text-right sm:text-left">{ksh(o.total)}</span></div>)}
      </div>
    </div>
  );
}
