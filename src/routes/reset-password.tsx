import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { meta } from "@/components/site";

export const Route = createFileRoute("/reset-password")({
  head: () => meta("Choose a New Password | Hope & HomeKe", "Set a new password for your Hope & HomeKe account."),
  component: ResetPassword,
});

function ResetPassword() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (done) {
    return (
      <AuthShell title="Password updated" text="Your password has been changed. You can now sign in with your new password.">
        <Link to="/login" className="btn-primary w-full">Sign in</Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Choose a new password" text="Use at least 8 characters, mixing letters and numbers.">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const p1 = String(f.get("p1"));
          if (p1.length < 8) return setError("Password must be at least 8 characters.");
          if (p1 !== String(f.get("p2"))) return setError("Passwords don't match.");
          setError("");
          setDone(true);
        }}
      >
        <div><label className="label">New password</label><input name="p1" required type="password" className="field" /></div>
        <div><label className="label">Confirm new password</label><input name="p2" required type="password" className="field" /></div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button className="btn-primary w-full">Update password</button>
      </form>
      <p className="mt-6 text-center text-sm"><Link to="/login" className="font-semibold text-accent">Back to sign in</Link></p>
    </AuthShell>
  );
}
