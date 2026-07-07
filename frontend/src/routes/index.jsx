import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Target,
  BookOpen,
  Layers,
  Check,
  Star,
  Zap,
  Youtube,
  MessageSquare,
  Clock,
  Quote,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Pathwise — AI learning roadmaps that actually finish" },
      { name: "description", content: "Turn any goal into a structured plan of modules, lessons, and quizzes. Learn on your schedule with an AI that adjusts to you." },
      { property: "og:title", content: "Pathwise — AI learning roadmaps" },
      { property: "og:description", content: "Turn any goal into a structured plan. Modules, lessons, quizzes — generated for you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Landing() {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-[color:var(--color-background)] text-[color:var(--color-foreground)]">
      <Header />
      <Hero />
      
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 bg-[color:var(--color-background)]/80 backdrop-blur border-b border-[color:var(--color-border)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        <Link to="/" className="inline-flex items-center gap-2 min-w-0">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[color:var(--color-accent)] text-white font-serif italic text-lg">P</span>
          <span className="font-serif italic text-xl truncate">Pathwise.</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#features" className="text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]">Features</a>
          <a href="#how" className="text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]">How it works</a>
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          <Link to="/auth" search={{ mode: "signin" }} className="hidden sm:inline-flex items-center h-9 px-3 rounded-lg text-sm font-medium text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)] hover:bg-[color:var(--color-surface-2)] transition">
            Sign in
          </Link>
          <Link to="/auth" search={{ mode: "signup" }} className="inline-flex items-center gap-1.5 h-9 px-3 sm:px-4 rounded-lg bg-[color:var(--color-accent)] text-white text-sm font-medium hover:bg-[color:var(--color-accent-hover)] transition">
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, #fdece6, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-white px-3 py-1 text-[11px] sm:text-xs">
            <Sparkles className="h-3 w-3 text-[color:var(--color-accent)]" />
            <span className="text-[color:var(--color-muted-foreground)]">Learning plans that actually finish</span>
          </span>

          <h1 className="mx-auto mt-5 sm:mt-6 max-w-4xl font-serif text-4xl sm:text-5xl md:text-7xl leading-[1.05]">
            <TypedHeadline
              prefix="Turn any goal into a "
              accent="roadmap."
              speed={55}
            />
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-[color:var(--color-muted-foreground)] px-2">
            Pathwise breaks your ambition into modules, lessons, and quizzes — and adjusts to how you actually learn.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Link
              to="/auth" search={{ mode: "signup" }}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg bg-[color:var(--color-accent)] text-white text-sm font-medium hover:bg-[color:var(--color-accent-hover)] shadow-[0_8px_24px_-8px_rgba(232,93,58,0.5)] transition"
            >
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how" className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg border border-[color:var(--color-border-strong)] bg-white text-sm font-medium hover:bg-[color:var(--color-surface-2)] transition">
              See how it works
            </a>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3 text-xs text-[color:var(--color-muted-foreground)]">
            <span className="flex text-[color:var(--color-warning)]">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
            </span>
            <span>Loved by 4,200+ self-taught learners</span>
          </div>
        </motion.div>

        {/* Preview card — Live prompt-to-roadmap generator */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative mx-auto mt-12 sm:mt-20 max-w-4xl rounded-2xl border border-[color:var(--color-border)] bg-white shadow-[var(--shadow-lg)] overflow-hidden"
        >

          <div className="flex items-center gap-2 h-9 px-4 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-auto text-xs text-[color:var(--color-muted-foreground)] font-mono">pathwise.app/new</span>
          </div>
          <LiveRoadmapDemo />
        </motion.div>
      </div>
    </section>
  );
}

const DEMO_GOALS = [
  {
    prompt: "Learn 3D animation in Blender in 10 weeks",
    tag: "Creative",
    modules: [
      ["Interface & first render", "2 lessons"],
      ["Modeling fundamentals", "5 lessons"],
      ["Rigging & armatures", "4 lessons"],
      ["Animation principles", "6 lessons"],
    ],
  },
  {
    prompt: "Pass the AWS Solutions Architect exam",
    tag: "Career",
    modules: [
      ["Core services tour", "3 lessons"],
      ["Networking & VPC", "5 lessons"],
      ["Storage & databases", "4 lessons"],
      ["Practice exam sprint", "2 quizzes"],
    ],
  },
  {
    prompt: "Ship an iOS app with SwiftUI",
    tag: "Build",
    modules: [
      ["Swift essentials", "4 lessons"],
      ["SwiftUI layout system", "5 lessons"],
      ["State & data flow", "3 lessons"],
      ["App Store submission", "2 lessons"],
    ],
  },
  {
    prompt: "Reach conversational Japanese (N4)",
    tag: "Language",
    modules: [
      ["Hiragana & katakana", "3 lessons"],
      ["Core 600 vocabulary", "6 lessons"],
      ["Particles & sentence order", "4 lessons"],
      ["Listening drills", "5 quizzes"],
    ],
  },
];

function useTyped(text, speed = 45) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return out;
}

function TypedHeadline({ prefix, accent, speed = 70 }) {
  const full = prefix + accent;
  const [n, setN] = useState(0);
  const [phase, setPhase] = useState("typing"); // typing | hold | erasing

  useEffect(() => {
    let t;
    if (phase === "typing") {
      if (n < full.length) t = setTimeout(() => setN(n + 1), speed);
      else t = setTimeout(() => setPhase("hold"), 2200);
    } else if (phase === "hold") {
      t = setTimeout(() => setPhase("erasing"), 1600);
    } else {
      if (n > 0) t = setTimeout(() => setN(n - 1), 25);
      else t = setTimeout(() => setPhase("typing"), 400);
    }
    return () => clearTimeout(t);
  }, [n, phase, full.length, speed]);

  const shown = full.slice(0, Math.min(n, prefix.length));
  const accentShown = n > prefix.length ? full.slice(prefix.length, n) : "";

  return (
    <span>
      {shown}
      {accentShown && (
        <span className="italic text-[color:var(--color-accent)]">{accentShown}</span>
      )}
      <span
        aria-hidden
        className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.12em] bg-[color:var(--color-accent)] animate-pulse"
      />
    </span>
  );
}

function LiveRoadmapDemo() {
  const [idx, setIdx] = useState(0);
  const goal = DEMO_GOALS[idx];
  const typed = useTyped(goal.prompt, 38);
  const done = typed.length === goal.prompt.length;

  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => setIdx((i) => (i + 1) % DEMO_GOALS.length), 4200);
    return () => clearTimeout(id);
  }, [done, idx]);

  return (
    <div className="grid md:grid-cols-[1.05fr_1fr]">
      {/* Left: prompt composer */}
      <div className="p-4 sm:p-6 md:p-8 border-b md:border-b-0 md:border-r border-[color:var(--color-border)] bg-gradient-to-br from-white to-[color:var(--color-surface-2)]">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[color:var(--color-muted-foreground)]">
          <Sparkles className="h-3 w-3 text-[color:var(--color-accent)]" />
          Your goal
        </div>

        <div className="mt-3 rounded-xl border border-[color:var(--color-border)] bg-white p-4 shadow-sm">
          <div className="min-h-[56px] sm:min-h-[64px] text-left font-serif text-lg sm:text-xl md:text-2xl leading-snug break-words">
            {typed}
            <span className="ml-0.5 inline-block h-5 w-[2px] translate-y-0.5 bg-[color:var(--color-accent)] animate-pulse" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-surface-2)] px-2 py-0.5 text-[10px] font-medium text-[color:var(--color-muted-foreground)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)]" />
              {goal.tag}
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md bg-[color:var(--color-foreground)] px-2.5 py-1.5 text-[11px] font-medium text-white"
            >
              Generate <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-[11px] text-[color:var(--color-muted-foreground)]">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full rounded-full bg-[color:var(--color-accent)] ${done ? "opacity-0" : "animate-ping opacity-60"}`} />
            <span className={`relative inline-flex h-2 w-2 rounded-full ${done ? "bg-emerald-500" : "bg-[color:var(--color-accent)]"}`} />
          </span>
          {done ? "Roadmap ready" : "Pathwise is drafting your roadmap…"}
        </div>
      </div>

      {/* Right: generated roadmap */}
      <div className="p-4 sm:p-6 md:p-8 text-left">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-widest text-[color:var(--color-muted-foreground)]">Generated plan</div>
          <div className="font-mono text-[10px] text-[color:var(--color-muted-foreground)]">4 modules · ~10 wks</div>
        </div>

        <AnimatePresence mode="wait">
          <motion.ul
            key={idx}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
            className="mt-4 space-y-2"
          >
            {goal.modules.map(([title, meta], i) => (
              <motion.li
                key={title}
                variants={{
                  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
                  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35 } },
                }}
                className="group flex items-center gap-3 rounded-lg border border-[color:var(--color-border)] bg-white p-2.5"
              >
                <span className="grid h-7 w-7 place-items-center rounded-md bg-[color:var(--color-surface-2)] font-mono text-[11px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{title}</div>
                  <div className="text-[10px] text-[color:var(--color-muted-foreground)]">{meta}</div>
                </div>
                <Sparkles className="h-3.5 w-3.5 text-[color:var(--color-accent)] opacity-0 group-hover:opacity-100 transition" />
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>

        <div className="mt-4 flex items-center gap-1.5">
          {DEMO_GOALS.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${i === idx ? "w-6 bg-[color:var(--color-accent)]" : "w-2 bg-[color:var(--color-border-strong)]"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}



function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent)]">What you get</p>
        <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.05]">Everything you need. Nothing you don't.</h2>
      </div>

      <div className="mt-10 sm:mt-12 grid gap-4 md:grid-cols-4 md:auto-rows-[168px]">

        {/* Hero — Personalised plans (2×2) */}
        <BentoCard
          className="md:col-span-2 md:row-span-2"
          icon={Target}
          title="Personalised plans"
          desc="Answer a few questions. The AI drafts a roadmap sized to your level and your timeline."
        >
          <div className="mt-5 space-y-2">
            {[
              ["01", "Python foundations", 100],
              ["02", "SQL & modeling", 100],
              ["03", "Airflow pipelines", 42],
              ["04", "Cloud warehousing", 0],
            ].map(([n, t, p]) => (
              <div
                key={n}
                className="flex items-center gap-3 rounded-lg border border-[color:var(--color-border)] bg-white/70 p-2.5 transition group-hover:translate-x-0.5"
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-md text-[10px] font-mono ${
                    p === 100
                      ? "bg-emerald-600 text-white"
                      : "bg-[color:var(--color-surface-2)]"
                  }`}
                >
                  {p === 100 ? <Check className="h-3 w-3" /> : n}
                </span>
                <span className="min-w-0 flex-1 truncate text-xs">{t}</span>
                <div className="h-1 w-16 shrink-0 overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
                  <div
                    className="h-full bg-[color:var(--color-accent)] transition-[width] duration-700 group-hover:[width:var(--w)]"
                    style={{ width: `${p}%`, "--w": `${Math.min(100, p + 15)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Lessons on demand (2×1) */}
        <BentoCard
          className="md:col-span-2"
          icon={BookOpen}
          title="Lessons on demand"
          desc="Long-form markdown articles — headings, code, tables and LaTeX — streamed the moment you open a lesson. Nothing pre-generated, nothing wasted."
          compact
        >
          <div className="mt-3 rounded-lg border border-[color:var(--color-border)] bg-[#0d0d0d] overflow-hidden">
            {/* Fake editor chrome */}
            <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-red-400/70" />
              <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
              <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
              <span className="ml-2 font-mono text-[9.5px] text-white/40">lesson.md</span>
              <span className="ml-auto flex items-center gap-1 font-mono text-[9.5px] text-[color:var(--color-accent)]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--color-accent)]" />
                streaming
              </span>
            </div>
            <div className="p-3 font-mono text-[10.5px] leading-relaxed text-white/80 space-y-1">
              <div className="text-white font-semibold text-[12px]"># Airflow DAGs</div>
              <div className="text-white/60">Orchestrate ETL as a directed graph of tasks…</div>
              <div className="text-[color:var(--color-accent)] mt-1.5">## Example</div>
              <div>
                <span className="text-emerald-400">def</span>{" "}
                <span className="text-sky-300">extract</span>()<span className="text-white/60">:</span>
              </div>
              <div className="pl-3 text-white/60">
                <span className="text-white/40">return</span> read_source()
              </div>
              <div className="text-[color:var(--color-accent)] mt-1.5">## Latency model</div>
              <div className="text-white/70">
                <span className="text-white/50">$$</span>
                T = \sum_i t_i + \tau
                <span className="text-white/50">$$</span>
              </div>
              <div className="flex items-center gap-1 pt-1 text-white/40">
                <span className="h-2 w-24 animate-pulse rounded bg-white/10" />
                <span className="h-2 w-16 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Custom quizzes (1×1) */}
        <BentoCard icon={Zap} title="Custom quizzes" desc="1–40 questions, on demand." tiny>
          <div className="mt-auto flex items-end justify-between">
            <div className="flex gap-1">
              {[1, 1, 0, 1, 0, 1, 1, 1].map((v, i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    v
                      ? "bg-[color:var(--color-accent)]"
                      : "bg-[color:var(--color-border-strong)]"
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-[10px] text-[color:var(--color-muted-foreground)]">
              6/8
            </span>
          </div>
        </BentoCard>

        {/* Chat to extend (1×1) */}
        <BentoCard icon={MessageSquare} title="Chat to extend" desc="Grow any lesson with a prompt." tiny>
          <div className="mt-auto space-y-1.5">
            <div className="ml-auto w-fit max-w-full truncate rounded-lg rounded-br-sm bg-[color:var(--color-accent)] px-2 py-1 text-[10px] text-white">
              Add pytest examples
            </div>
            <div className="w-fit max-w-full truncate rounded-lg rounded-bl-sm bg-[color:var(--color-surface-2)] px-2 py-1 text-[10px]">
              ## Pytest examples…
            </div>
          </div>
        </BentoCard>

        {/* Curated videos (2×1) */}
        <BentoCard
          className="md:col-span-2"
          icon={Youtube}
          title="Curated videos"
          desc="One click surfaces YouTube lessons tuned to your level."
          compact
        >
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="relative aspect-video overflow-hidden rounded-md border border-[color:var(--color-border)] bg-gradient-to-br from-[#2a1a14] to-[#0d0d0d]"
              >
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white/90">
                    <span className="ml-[1px] h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-[color:var(--color-accent)]" />
                  </span>
                </span>
              </div>
            ))}
          </div>
        </BentoCard>

        {/* Track real progress (2×1) */}
        <BentoCard
          className="md:col-span-2"
          icon={Layers}
          title="Track real progress"
          desc="Every lesson and quiz feeds a ring you can watch grow."
          compact
        >
          <div className="mt-3 flex items-center gap-4">
            <ProgressDial value={64} />
            <div className="min-w-0 flex-1 space-y-1.5">
              {[
                ["Lessons", 24, 38],
                ["Quizzes", 9, 12],
              ].map(([l, a, b]) => (
                <div key={l}>
                  <div className="flex justify-between text-[10px] text-[color:var(--color-muted-foreground)]">
                    <span>{l}</span>
                    <span className="font-mono">
                      {a}/{b}
                    </span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
                    <div
                      className="h-full bg-[color:var(--color-accent)]"
                      style={{ width: `${(a / b) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </BentoCard>
      </div>
    </section>
  );
}

function BentoCard({ icon: Icon, title, desc, className = "", children, compact, tiny }) {
  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] hover:border-[color:var(--color-accent)]/40 ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[color:var(--color-accent-soft)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="relative flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent-hover)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <h3 className={`font-serif leading-tight ${tiny ? "text-lg" : compact ? "text-xl" : "text-2xl"}`}>
            {title}
          </h3>
          <p className={`mt-1 text-[color:var(--color-muted-foreground)] ${tiny ? "text-[11px]" : "text-xs"}`}>
            {desc}
          </p>
        </div>
      </div>
      {children && <div className="relative mt-3 flex flex-1 flex-col">{children}</div>}
    </div>
  );
}

function ProgressDial({ value }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="relative h-14 w-14 shrink-0">
      <svg viewBox="0 0 56 56" className="h-full w-full -rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" stroke="var(--color-surface-2)" strokeWidth="5" />
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          className="transition-[stroke-dashoffset] duration-700 group-hover:[stroke-dashoffset:0]"
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-mono text-[11px] font-semibold">
        {value}%
      </span>
    </div>
  );
}



function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "Tell us your goal",
      d: "One sentence. Pick a level and a timeline. That's the whole intake.",
      hint: "e.g. Become a data engineer in 12 weeks",
    },
    {
      n: "02",
      t: "AI drafts your path",
      d: "A full roadmap of modules and lessons, sized to your level. Ready in under a minute.",
      hint: "4–8 modules · 3–4 lessons each",
    },
    {
      n: "03",
      t: "Learn & track",
      d: "Open lessons on demand, generate custom quizzes, watch the ring fill.",
      hint: "Custom quiz · 1–40 questions",
    },
  ];
  return (
    <section id="how" className="bg-white border-y border-[color:var(--color-border)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent)]">How it works</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.05]">Three steps. Zero guesswork.</h2>

        </div>

        <div className="relative mt-16">
          {/* connector line */}
          <div
            aria-hidden
            className="hidden md:block absolute left-0 right-0 top-10 h-px"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, var(--color-border-strong) 0 8px, transparent 8px 16px)",
            }}
          />

          <ol className="relative grid gap-8 md:grid-cols-3 md:gap-6">
            {steps.map((s, i) => (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative ${i === 1 ? "md:mt-12" : ""} ${i === 2 ? "md:mt-4" : ""}`}
              >
                {/* number marker on the rail */}
                <div className="relative flex md:block">
                  <span className="relative z-10 grid h-20 w-20 place-items-center rounded-full border border-[color:var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
                    <span className="font-serif text-3xl italic text-[color:var(--color-accent)]">
                      {s.n}
                    </span>
                  </span>
                </div>

                <div className="mt-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-6">
                  <h3 className="font-serif text-2xl leading-tight">{s.t}</h3>
                  <p className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">{s.d}</p>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-dashed border-[color:var(--color-border-strong)] bg-white px-3 py-1.5 text-[11px] font-mono text-[color:var(--color-muted-foreground)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)]" />
                    {s.hint}
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}


function Testimonials() {
  const items = [
    {
      q: "I've bookmarked a hundred courses I never finished. Pathwise is the first plan I actually stuck with — modules are the right size and the quizzes catch what I skimmed.",
      n: "Amelia R.",
      r: "Career-switcher → Data engineer",
    },
    {
      q: "The chat-to-extend feature is the killer move. When a lesson glossed over something, I asked for more and it just… appended a real section. No re-generation, no losing my place.",
      n: "Marcus T.",
      r: "Self-taught ML engineer",
    },
    {
      q: "I use the custom quiz before every interview loop. 40 sharp questions per module, unlimited attempts. Nothing else on the market does this.",
      n: "Priya S.",
      r: "Senior backend, prepping for staff",
    },
  ];
  return (
    <section className="bg-[color:var(--color-background)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent)]">Loved by learners</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.05]">Real plans. Real progress.</h2>
        </div>
        <div className="mt-10 sm:mt-12 grid gap-5 md:grid-cols-3">

          {items.map((t) => (
            <figure key={t.n} className="rounded-2xl border border-[color:var(--color-border)] bg-white p-6 flex flex-col">
              <Quote className="h-6 w-6 text-[color:var(--color-accent)]" />
              <blockquote className="mt-4 text-[15px] leading-relaxed text-[color:var(--color-foreground)] flex-1">
                "{t.q}"
              </blockquote>
              <figcaption className="mt-6 pt-4 border-t border-[color:var(--color-border)]">
                <div className="font-medium text-sm">{t.n}</div>
                <div className="text-xs text-[color:var(--color-muted-foreground)] mt-0.5">{t.r}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: "How is this different from a chatbot?",
      a: "You get a persistent, structured plan — modules, lessons, quizzes, progress — not a chat history. The AI is under the hood; the surface is a roadmap you can return to.",
    },
    {
      q: "How long does a roadmap take to generate?",
      a: "The skeleton (modules + lesson titles) is ready in under a minute. Full lesson articles are generated on demand when you open a lesson, so nothing is wasted.",
    },
    {
      q: "Can I customise a roadmap after it's generated?",
      a: "Yes. Every lesson supports a chat-to-extend box: ask for a topic and a new section is appended without touching the rest of the article. Quizzes can be regenerated at any size.",
    },
    {
      q: "Is my progress saved?",
      a: "All roadmaps, completions and best quiz scores are saved to your account and sync across devices.",
    },
  ];
  return (
    <section className="border-y border-[color:var(--color-border)] bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent)]">FAQ</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.05]">Answers, briefly.</h2>
        </div>
        <div className="mt-10 sm:mt-12 divide-y divide-[color:var(--color-border)] border-y border-[color:var(--color-border)]">
          {items.map((it) => (
            <details key={it.q} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                <span className="font-serif text-base sm:text-lg">{it.q}</span>

                <span className="grid h-7 w-7 place-items-center rounded-full border border-[color:var(--color-border)] text-[color:var(--color-muted-foreground)] transition group-open:rotate-45 group-open:bg-[color:var(--color-accent)] group-open:text-white group-open:border-transparent">
                  <span className="text-lg leading-none">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted-foreground)]">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}


function CTA() {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24">
      <div
        className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-white text-center"
        style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #2a1a14 50%, #e85d3a 130%)" }}
      >
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="relative">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-tight">Pick a goal. We'll draw the map.</h2>
          <p className="mt-3 text-white/70 max-w-lg mx-auto text-sm sm:text-base">
            Free to start. No credit card. Your first roadmap in under a minute.
          </p>
          <Link to="/auth" search={{ mode: "signup" }} className="mt-7 sm:mt-8 inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-[color:var(--color-accent)] text-white font-medium hover:bg-[color:var(--color-accent-hover)] transition">
            Get started <ArrowRight className="h-4 w-4" />
          </Link>

        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-border)] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-wrap items-center justify-between gap-4 text-sm text-[color:var(--color-muted-foreground)]">
        <div className="inline-flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-[color:var(--color-accent)] text-white font-serif italic text-xs">P</span>
          <span className="font-serif italic">Pathwise.</span>
        </div>
        <p>© {new Date().getFullYear()} Pathwise. Built with care.</p>
      </div>
    </footer>
  );
}
