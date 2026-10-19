import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Heart, LayoutDashboard, LogOut, MapPin, Package, Settings } from "lucide-react";

export const Route = createFileRoute("/account")({ component: AccountLayout });

const links = [
  { to: "/account", label: "Dashboard", icon: LayoutDashboard },
  { to: "/account/orders", label: "Orders", icon: Package },
  { to: "/account/wishlist", label: "Wishlist", icon: Heart },
  { to: "/account/addresses", label: "Addresses", icon: MapPin },
  { to: "/account/settings", label: "Settings", icon: Settings },
] as const;

function AccountLayout() {
  return (
    <section className="container-x grid gap-6 py-8 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10 md:py-12">
      <aside className="min-w-0">
        <p className="eyebrow">My account</p>
        <nav className="-mx-5 mt-4 flex gap-1 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-col md:px-0">
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: true }} className="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm hover:bg-muted" activeProps={{ className: "bg-secondary font-semibold" }}><Icon className="h-4 w-4" />{label}</Link>
          ))}
          <Link to="/login" className="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"><LogOut className="h-4 w-4" />Sign out</Link>
        </nav>
      </aside>
      <div className="min-w-0"><Outlet /></div>
    </section>
  );
}
