import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { meta } from "@/components/site";

export const Route = createFileRoute("/account/settings")({
  head: () => meta("Account Settings | Hope & HomeKe", "Update your profile, password and notification preferences."),
  component: Settings,
});

function Settings() {
  const save = (e: React.FormEvent) => { e.preventDefault(); toast.success("Saved"); };
  return (
    <div className="space-y-8">
      <h1 className="text-3xl sm:text-4xl">Settings</h1>
      <form onSubmit={save} className="card grid gap-4 p-5 sm:p-6 sm:grid-cols-2">
        <h2 className="text-xl sm:col-span-2">Profile</h2>
        <div><label className="label">First name</label><input className="field" /></div>
        <div><label className="label">Last name</label><input className="field" /></div>
        <div><label className="label">Email</label><input type="email" className="field" /></div>
        <div><label className="label">Phone</label><input type="tel" className="field" /></div>
        <button className="btn-primary w-full sm:w-fit">Save profile</button>
      </form>
      <form onSubmit={save} className="card grid gap-4 p-5 sm:p-6 sm:grid-cols-2">
        <h2 className="text-xl sm:col-span-2">Password</h2>
        <div><label className="label">Current password</label><input type="password" className="field" /></div>
        <div><label className="label">New password</label><input type="password" className="field" /></div>
        <button className="btn-primary w-full sm:w-fit">Update password</button>
      </form>
      <form onSubmit={save} className="card space-y-3 p-6">
        <h2 className="text-xl">Notifications</h2>
        {["Order updates by SMS", "Promotions by email", "Design tips newsletter"].map((n) => <label key={n} className="flex items-center gap-3 text-sm"><input type="checkbox" defaultChecked className="h-4 w-4 accent-accent" />{n}</label>)}
        <button className="btn-primary w-full sm:w-fit">Save preferences</button>
      </form>
    </div>
  );
}
