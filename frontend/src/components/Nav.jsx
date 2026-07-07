import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, LogIn } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { getSession, signOut as signOutFn } from "@/lib/auth.functions.js";

export default function Nav() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const checkSession = useServerFn(getSession);
  const doSignOut = useServerFn(signOutFn);

  useEffect(() => {
    checkSession().then((res) => {
      if (res?.user) setUser(res.user);
    }).catch(console.error);
  }, [checkSession]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function signOut() {
    await doSignOut();
    setOpen(false);
    navigate({ to: "/", replace: true });
  }

  const navLinks = [
    { href: "#platform", label: "Platform" },
    { href: "#how", label: "How it works" },
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-black/[0.06]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5 text-[17px] font-semibold tracking-tight text-neutral-900">
          <img src="/logo.png" alt="Pathwise" width={28} height={28} className="h-7 w-7" />
          Pathwise
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[15px] text-neutral-700">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-neutral-900">{l.label}</a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Link to="/dashboard" className="rounded-full px-4 py-2 text-[15px] text-neutral-700 hover:text-neutral-900">Dashboard</Link>
              <Link to="/generate" className="inline-flex items-center rounded-full bg-neutral-900 px-5 py-2.5 text-[14px] font-medium text-white hover:bg-neutral-800">New roadmap</Link>
              <button onClick={signOut} className="rounded-full px-3 py-2 text-[14px] text-neutral-600 hover:text-neutral-900">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/auth" className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] text-neutral-700 hover:text-neutral-900">Login</Link>
              <Link to="/auth" search={{ mode: "signup" }} className="inline-flex items-center rounded-full bg-neutral-900 px-5 py-2.5 text-[14px] font-medium text-white hover:bg-neutral-800">Get started</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-900 hover:bg-neutral-50"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Mobile slide-over */}
      <div className={`md:hidden fixed inset-0 z-40 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        {/* backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        {/* panel */}
        <aside
          className={`absolute right-0 top-0 h-full w-[86%] max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200/70">
            <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5 text-[17px] font-semibold tracking-tight">
              <img src="/logo.png" alt="Pathwise" width={28} height={28} className="h-7 w-7" />
              Pathwise
            </Link>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-50"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <div className="flex flex-col">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3.5 text-[17px] font-medium text-neutral-900 hover:bg-neutral-50"
                >
                  {l.label}
                  <span className="text-neutral-300">→</span>
                </a>
              ))}
            </div>
          </nav>

          <div className="border-t border-neutral-200/70 px-6 py-6 space-y-3">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="block w-full text-center rounded-full border border-neutral-300 px-5 py-3 text-[15px] font-medium text-neutral-900 hover:bg-neutral-50">
                  Dashboard
                </Link>
                <Link to="/generate" onClick={() => setOpen(false)} className="block w-full text-center rounded-full bg-neutral-900 px-5 py-3 text-[15px] font-medium text-white hover:bg-neutral-800">
                  New roadmap
                </Link>
                <button onClick={signOut} className="w-full rounded-full px-5 py-2.5 text-[14px] text-neutral-500 hover:text-neutral-900">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 w-full rounded-full border border-neutral-300 px-5 py-3 text-[15px] font-medium text-neutral-900 hover:bg-neutral-50">
                  <LogIn size={16} /> Login
                </Link>
                <Link to="/auth" search={{ mode: "signup" }} onClick={() => setOpen(false)} className="block w-full text-center rounded-full bg-neutral-900 px-5 py-3 text-[15px] font-medium text-white hover:bg-neutral-800">
                  Get started
                </Link>
              </>
            )}
          </div>
        </aside>
      </div>
    </header>
  );
}
