import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useServerFn } from "@tanstack/react-start";
import { signIn, signUp, getSession } from "@/lib/auth.functions.js";
import { Button, Card, Input, Label, Spinner } from "@/components/ui.jsx";
import { ArrowRight, Sparkles, Check } from "lucide-react";

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => ({ mode: s?.mode === "signup" ? "signup" : "signin" }),
  component: AuthPage,
});

function AuthPage() {
  const { mode: initial } = Route.useSearch();
  const [mode, setMode] = useState(initial);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isSignup = mode === "signup";

  const checkSession = useServerFn(getSession);
  const doSignIn = useServerFn(signIn);
  const doSignUp = useServerFn(signUp);

  useEffect(() => {
    checkSession().then((res) => {
      if (res?.session) navigate({ to: "/dashboard", replace: true });
    }).catch(console.error);
  }, [navigate, checkSession]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();
      const fn = isSignup ? doSignUp : doSignIn;
      
      await fn({ data: { email: cleanEmail, password: cleanPassword } });
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function googleSignIn() {
    setError("Google sign-in is disabled in this environment");
  }

  return (
    <main className="min-h-dvh grid lg:grid-cols-2 bg-[color:var(--color-background)]">
      {/* Form side */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-10">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[color:var(--color-accent)] text-white font-serif italic text-lg">P</span>
            <span className="font-serif italic text-xl">Pathwise.</span>
          </Link>

          <h1 className="font-serif text-4xl lg:text-5xl leading-tight">
            {isSignup ? "Start your path." : "Welcome back."}
          </h1>
          <p className="mt-2 text-[color:var(--color-muted-foreground)]">
            {isSignup ? "Turn any goal into a clear plan." : "Sign in to continue learning."}
          </p>

          {/* Mode switcher */}
          <div className="mt-8 inline-flex rounded-lg border border-[color:var(--color-border)] p-1 bg-white">
            {["signin", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 h-9 text-xs font-semibold rounded-md transition ${
                  mode === m
                    ? "bg-[color:var(--color-foreground)] text-white"
                    : "text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
                }`}
              >
                {m === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={googleSignIn}
            disabled={googleLoading}
            className="mt-6 w-full h-11 rounded-lg border border-[color:var(--color-border-strong)] bg-white flex items-center justify-center gap-2 text-sm font-medium hover:bg-[color:var(--color-surface-2)] transition disabled:opacity-60"
          >
            {googleLoading ? <Spinner /> : <GoogleIcon />}
            Continue with Google
          </button>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[color:var(--color-border)]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted-foreground)]">or</span>
            <div className="h-px flex-1 bg-[color:var(--color-border)]" />
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                className="mt-1.5"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                className="mt-1.5"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-[color:var(--color-danger)]/30 bg-red-50 p-3 text-xs text-[color:var(--color-danger)]">
                {error}
              </div>
            )}

            <Button variant="accent" size="lg" type="submit" disabled={loading} className="w-full">
              {loading ? <Spinner /> : <>{isSignup ? "Create account" : "Sign in"} <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>

          <p className="mt-6 text-xs text-[color:var(--color-muted-foreground)]">
            By continuing you agree to our terms and privacy policy.
          </p>
        </motion.div>
      </div>

      {/* Visual side */}
      <div className="relative hidden lg:block overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #1f1815 40%, #e85d3a 120%)" }}
        />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="relative h-full p-12 flex flex-col justify-between text-white">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">Pathwise</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight max-w-md">
              A calm, structured way to <em className="text-[color:var(--color-accent)]">learn anything.</em>
            </h2>
          </div>

          {/* Stylized roadmap */}
          <div className="max-w-sm space-y-4">
            {[
              { t: "Structured modules", d: "AI drafts a coherent syllabus" },
              { t: "Lessons on demand", d: "Content generated when you need it" },
              { t: "Progress that compounds", d: "Small daily reps, visible growth" },
            ].map((f) => (
              <div key={f.t} className="flex items-start gap-3">
                <span className="mt-1 grid h-6 w-6 place-items-center rounded-full bg-white/10 text-[color:var(--color-accent)]">
                  <Check className="h-3 w-3" />
                </span>
                <div>
                  <p className="text-sm font-medium">{f.t}</p>
                  <p className="text-xs text-white/60">{f.d}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-white/50 flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> Trusted for personal learning plans
          </p>
        </div>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
