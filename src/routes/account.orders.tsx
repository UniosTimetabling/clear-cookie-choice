import { createFileRoute } from "@tanstack/react-router";
import { ksh } from "@/lib/data";
import { sampleOrders } from "@/lib/orders";
import { meta } from "@/components/site";

export const Route = createFileRoute("/account/orders")({
  head: () => meta("My Orders | Hope & HomeKe", "Track your Hope & HomeKe orders and installations."),
  component: Orders,
});

function Orders() {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl">Orders</h1>
      <div className="mt-6 space-y-3 sm:hidden">
        {sampleOrders.map((o) => (
          <div key={o.id} className="card p-4 text-sm">
            <div className="flex items-center justify-between"><span className="font-semibold">{o.id}</span><span className={`rounded-full px-3 py-1 text-xs font-semibold ${o.status === "Processing" ? "bg-sand" : "bg-primary text-primary-foreground"}`}>{o.status}</span></div>
            <div className="mt-3 flex justify-between text-muted-foreground"><span>{o.date} · {o.items} items</span><span className="font-semibold text-foreground">{ksh(o.total)}</span></div>
          </div>
        ))}
      </div>
      <div className="card mt-8 hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-muted-foreground"><tr><th className="p-4">Order</th><th className="p-4">Date</th><th className="p-4">Items</th><th className="p-4">Total</th><th className="p-4">Status</th></tr></thead>
          <tbody className="divide-y divide-border">
            {sampleOrders.map((o) => (
              <tr key={o.id}><td className="p-4 font-semibold">{o.id}</td><td className="p-4">{o.date}</td><td className="p-4">{o.items}</td><td className="p-4">{ksh(o.total)}</td>
                <td className="p-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${o.status === "Processing" ? "bg-sand" : "bg-primary text-primary-foreground"}`}>{o.status}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
