import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { meta } from "@/components/site";

export const Route = createFileRoute("/forgot-password")({
  head: () => meta("Reset Password | Hope & HomeKe", "Reset the password for your Hope & HomeKe account."),
  component: Forgot,
});

function Forgot() {
  const [sent, setSent] = useState(false);
  return (
    <AuthShell title={sent ? "Check your email" : "Reset password"} text={sent ? "If an account exists, we've sent a reset link." : "Enter your email and we'll send you a reset link."}>
      {!sent && (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          {/* reset link in the email opens /reset-password */}
          <div><label className="label">Email</label><input required type="email" className="field" /></div>
          <button className="btn-primary w-full">Send reset link</button>
        </form>
      )}
      <p className="mt-6 text-center text-sm"><Link to="/login" className="font-semibold text-accent">Back to sign in</Link></p>
    </AuthShell>
  );
}
