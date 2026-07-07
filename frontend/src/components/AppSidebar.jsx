import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getSession, signOut as signOutFn } from "@/lib/auth.functions.js";
import {
  LayoutDashboard,
  Map,
  Sparkles,
  LogOut,
  Menu,
  X,
  Search,
  Plus,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, match: (p) => p === "/dashboard" },
  { to: "/generate", label: "New Roadmap", icon: Sparkles, match: (p) => p === "/generate" },
  { to: "/roadmaps", label: "My Roadmaps", icon: Map, match: (p) => p === "/roadmaps" || p.startsWith("/roadmap/") },
  { to: "/chat", label: "Assistant", icon: MessageSquare, match: (p) => p === "/chat" || p.startsWith("/chat/") },
];

const CRUMBS = {
  "/dashboard": "Dashboard",
  "/roadmaps": "My Roadmaps",
  "/generate": "New Roadmap",
};

function currentCrumb(path) {
  if (CRUMBS[path]) return CRUMBS[path];
  if (path.startsWith("/roadmap/")) return "Roadmap";
  return "Pathwise";
}

export default function AppSidebar() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  const checkSession = useServerFn(getSession);
  const doSignOut = useServerFn(signOutFn);

  useEffect(() => {
    checkSession().then((res) => {
      if (res?.user) setUser(res.user);
    }).catch(console.error);
  }, []);
  useEffect(() => { setOpen(false); }, [path]);

  async function signOut() {
    await doSignOut();
    nav({ to: "/", replace: true });
  }

  const initials = (user?.email || "?").slice(0, 2).toUpperCase();
  const email = user?.email || "Loading…";

  const Rail = (
    <div className="flex h-full flex-col bg-[color:var(--color-sidebar)] text-[color:var(--color-sidebar-foreground)]">
      <div className="px-6 pt-7 pb-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[color:var(--color-accent)] text-white font-serif italic text-lg">P</span>
          <span className="font-serif text-xl italic tracking-tight">Pathwise.</span>
        </Link>
      </div>

      <div className="px-3">
        <div className="mb-1 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-sidebar-muted)]">
          Workspace
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV.map((item) => {
          const active = item.match(path);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`group relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-white/[0.06] text-white"
                  : "text-[color:var(--color-sidebar-muted)] hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r bg-[color:var(--color-accent)]" />
              )}
              <Icon className={`h-[18px] w-[18px] ${active ? "text-[color:var(--color-accent)]" : ""}`} strokeWidth={1.75} />
              {item.label}
              {active && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mb-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center gap-3">
          <Link to="/profile" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color:var(--color-accent)] text-white text-xs font-bold font-mono hover:opacity-90" aria-label="Profile">
            {initials}
          </Link>
          <Link to="/profile" className="min-w-0 flex-1 group">
            <p className="truncate text-xs font-semibold text-white group-hover:underline">{email}</p>
            <p className="text-[10px] uppercase tracking-wider text-[color:var(--color-sidebar-muted)]">View profile</p>
          </Link>
          <button
            onClick={signOut}
            aria-label="Sign out"
            className="grid h-8 w-8 place-items-center rounded-md text-[color:var(--color-sidebar-muted)] hover:text-white hover:bg-white/[0.06] transition"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 z-30">{Rail}</aside>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-[color:var(--color-border)] bg-white/80 backdrop-blur px-4 py-3">
        <Link to="/dashboard" className="inline-flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-[color:var(--color-accent)] text-white font-serif italic text-sm">P</span>
          <span className="font-serif italic text-lg">Pathwise.</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="inline-grid h-9 w-9 place-items-center rounded-lg border border-[color:var(--color-border)]"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed inset-0 z-40 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute left-0 top-0 h-full w-72 transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 z-10 grid h-8 w-8 place-items-center rounded-md text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          {Rail}
        </div>
      </div>
    </>
  );
}

/* Top bar shared inside content area */
export function TopBar({ actions }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const crumb = currentCrumb(path);
  return (
    <div className="hidden lg:flex items-center justify-between border-b border-[color:var(--color-border)] bg-white/70 backdrop-blur px-8 h-14 sticky top-0 z-20">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[color:var(--color-muted-foreground)]">Pathwise</span>
        <ChevronRight className="h-3.5 w-3.5 text-[color:var(--color-muted-foreground)]" />
        <span className="font-medium text-[color:var(--color-foreground)]">{crumb}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[color:var(--color-muted-foreground)]" />
          <input
            placeholder="Search roadmaps…"
            className="h-9 w-64 rounded-lg border border-[color:var(--color-border)] bg-white pl-9 pr-3 text-sm placeholder:text-[color:var(--color-muted-foreground)] focus:border-[color:var(--color-accent)]"
          />
        </div>
        {actions ?? (
          <Link
            to="/generate"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[color:var(--color-accent)] text-white text-sm font-medium hover:bg-[color:var(--color-accent-hover)] transition"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            New
          </Link>
        )}
      </div>
    </div>
  );
}
