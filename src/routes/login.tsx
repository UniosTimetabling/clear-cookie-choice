import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth-shell";
import { meta } from "@/components/site";

export const Route = createFileRoute("/login")({
  head: () => meta("Sign In | Hope & HomeKe", "Sign in to track orders, manage addresses and view your wishlist."),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  return (
    <AuthShell title="Welcome back" text="Sign in to your Hope & HomeKe account.">
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); nav({ to: "/account" }); }}>
        <div><label className="label">Email</label><input required type="email" className="field" /></div>
        <div><div className="flex justify-between"><label className="label">Password</label><Link to="/forgot-password" className="text-sm text-accent">Forgot?</Link></div><input required type="password" className="field" /></div>
        <button className="btn-primary w-full">Sign in</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">New here? <Link to="/register" className="font-semibold text-accent">Create an account</Link></p>
    </AuthShell>
  );
}
