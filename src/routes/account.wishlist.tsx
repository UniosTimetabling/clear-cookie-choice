import { createFileRoute, Link } from "@tanstack/react-router";
import { products } from "@/lib/data";
import { useCart } from "@/lib/cart";
import { meta, ProductCard } from "@/components/site";

export const Route = createFileRoute("/account/wishlist")({
  head: () => meta("My Wishlist | Hope & HomeKe", "Products you've saved for later."),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist } = useCart();
  const list = products.filter((p) => wishlist.includes(p.slug));
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl">Wishlist</h1>
      {list.length === 0 ? (
        <div className="card mt-8 p-12 text-center"><p className="text-muted-foreground">Tap the heart on any product to save it here.</p><Link to="/products" className="btn-primary mt-6">Browse products</Link></div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      )}
    </div>
  );
}
