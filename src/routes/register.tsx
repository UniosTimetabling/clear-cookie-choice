import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth-shell";
import { meta } from "@/components/site";

export const Route = createFileRoute("/register")({
  head: () => meta("Create Account | Hope & HomeKe", "Create a Hope & HomeKe account for faster checkout and order tracking."),
  component: Register,
});

function Register() {
  const nav = useNavigate();
  return (
    <AuthShell title="Create account" text="Faster checkout, order tracking and saved favourites.">
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); nav({ to: "/account" }); }}>
        <div className="grid gap-4 sm:grid-cols-2"><div><label className="label">First name</label><input required className="field" /></div><div><label className="label">Last name</label><input required className="field" /></div></div>
        <div><label className="label">Email</label><input required type="email" className="field" /></div>
        <div><label className="label">Phone</label><input type="tel" className="field" /></div>
        <div><label className="label">Password</label><input required type="password" minLength={8} className="field" /></div>
        <button className="btn-primary w-full">Create account</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">Already registered? <Link to="/login" className="font-semibold text-accent">Sign in</Link></p>
    </AuthShell>
  );
}
