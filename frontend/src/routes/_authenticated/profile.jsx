import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useRouteContext } from "@tanstack/react-router";
import { User, Mail, Calendar, Lock, Check, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = Route.useRouteContext();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  async function updatePassword(e) {
    e.preventDefault();
    setMsg({ type: "error", text: "Updating password is not implemented yet in the new auth." });
  }

  const initials = (user?.email || "?").slice(0, 2).toUpperCase();
  const joined = user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "—";

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 space-y-8">
      <header>
        <h1 className="font-serif italic text-4xl tracking-tight">Profile</h1>
        <p className="text-sm text-[color:var(--color-muted-foreground)] mt-1">Manage your account and security.</p>
      </header>

      <section className="rounded-2xl border border-[color:var(--color-border)] bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[color:var(--color-accent)] text-white text-lg font-bold">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{user?.email || "Loading…"}</p>
            <p className="text-xs text-[color:var(--color-muted-foreground)]">Free plan</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 text-sm">
          <InfoRow icon={Mail} label="Email" value={user?.email || "—"} />
          <InfoRow icon={User} label="User ID" value={user?.id ? user.id.slice(0, 8) + "…" : "—"} />
          <InfoRow icon={Calendar} label="Joined" value={joined} />
          <InfoRow icon={Check} label="Status" value={user?.email_confirmed_at ? "Verified" : "Unverified"} />
        </div>
      </section>

      <section className="rounded-2xl border border-[color:var(--color-border)] bg-white p-6">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="h-4 w-4" />
          <h2 className="font-semibold">Change password</h2>
        </div>
        <p className="text-sm text-[color:var(--color-muted-foreground)] mb-5">Enter your current password to set a new one.</p>

        <form onSubmit={updatePassword} className="space-y-4">
          <Field label="Current password" type="password" value={current} onChange={setCurrent} autoComplete="current-password" required />
          <Field label="New password" type="password" value={next} onChange={setNext} autoComplete="new-password" required />
          <Field label="Confirm new password" type="password" value={confirm} onChange={setConfirm} autoComplete="new-password" required />

          {msg && (
            <div className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${msg.type === "success" ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}`}>
              {msg.type === "success" ? <Check className="h-4 w-4 mt-0.5" /> : <AlertCircle className="h-4 w-4 mt-0.5" />}
              <span>{msg.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[color:var(--color-foreground)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      </section>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[color:var(--color-border)] px-3 py-2.5">
      <Icon className="h-4 w-4 text-[color:var(--color-muted-foreground)]" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-[color:var(--color-muted-foreground)]">{label}</p>
        <p className="text-sm truncate">{value}</p>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, ...rest }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-lg border border-[color:var(--color-border)] bg-white px-3 text-sm focus:outline-none focus:border-[color:var(--color-accent)]"
        {...rest}
      />
    </label>
  );
}
