import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Code2,
  Smartphone,
  BarChart3,
  Brain,
  Cloud,
  ShieldCheck,
  Blocks,
  Palette,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";
import { createRoadmap } from "@/lib/roadmaps.functions.js";
import { Button, Card, Badge, Input, Textarea, ProgressBar, Spinner } from "@/components/ui.jsx";

export const Route = createFileRoute("/_authenticated/generate")({ component: Generate });

const DOMAINS = [
  { key: "web", label: "Web Development", desc: "React, Next.js, full-stack", icon: Code2 },
  { key: "app", label: "App Development", desc: "iOS, Android, React Native", icon: Smartphone },
  { key: "data", label: "Data Science", desc: "Python, ML, statistics", icon: BarChart3 },
  { key: "ai", label: "AI / Machine Learning", desc: "LLMs, deep learning, MLOps", icon: Brain },
  { key: "cloud", label: "Cloud & DevOps", desc: "AWS, Docker, Kubernetes", icon: Cloud },
  { key: "cyber", label: "Cybersecurity", desc: "Pentesting, security", icon: ShieldCheck },
  { key: "blockchain", label: "Blockchain / Web3", desc: "Solidity, smart contracts", icon: Blocks },
  { key: "design", label: "UI / UX Design", desc: "Figma, design systems", icon: Palette },
];

const LEVELS = [
  { key: "beginner", label: "Beginner", desc: "Start from zero" },
  { key: "intermediate", label: "Intermediate", desc: "Know basics, want depth" },
  { key: "advanced", label: "Advanced", desc: "Ready for specialization" },
];

const DURATIONS = [
  { m: 1, label: "1 month", desc: "Sprint" },
  { m: 2, label: "2 months", desc: "Focused" },
  { m: 3, label: "3 months", desc: "Balanced" },
  { m: 6, label: "6 months", desc: "Deep dive" },
  { m: 12, label: "12 months", desc: "Mastery" },
];

const GEN_STEPS = [
  "Analyzing your goal and level",
  "Mapping prerequisites",
  "Structuring modules and timeline",
  "Drafting lessons and content",
  "Designing quizzes and checkpoints",
  "Wiring the pathway",
];

function Generate() {
  const create = useServerFn(createRoadmap);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState("");
  const [domain, setDomain] = useState(null);
  const [customGoal, setCustomGoal] = useState("");
  const [months, setMonths] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(chosenMonths) {
    setError("");
    setLoading(true);
    setStep(3);
    const goal = `${domain.label} — ${customGoal || `become proficient in ${domain.label}`}`;
    try {
      const row = await create({ data: { goal, level, months: chosenMonths } });
      navigate({ to: "/roadmap/$id", params: { id: row.id } });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 lg:px-10 py-8 lg:py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted-foreground)]">Create</p>
          <h1 className="mt-2 font-serif text-4xl lg:text-5xl">New roadmap</h1>
          <p className="mt-1 text-[color:var(--color-muted-foreground)]">Four quick steps. AI does the heavy lifting.</p>
        </div>
        <Stepper step={step} />
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <div>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <StepShell key="0" title="What's your current level?" subtitle="We'll calibrate depth and pace.">
                <div className="grid gap-3 md:grid-cols-3">
                  {LEVELS.map((l) => (
                    <button
                      key={l.key}
                      onClick={() => { setLevel(l.key); setStep(1); }}
                      className={`text-left rounded-xl border p-5 transition group ${
                        level === l.key
                          ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent-soft)]"
                          : "border-[color:var(--color-border)] bg-white hover:border-[color:var(--color-accent)]"
                      }`}
                    >
                      <div className="font-serif text-2xl">{l.label}</div>
                      <div className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">{l.desc}</div>
                      <div className="mt-4 text-xs uppercase tracking-widest text-[color:var(--color-accent)] opacity-0 group-hover:opacity-100 transition">Select →</div>
                    </button>
                  ))}
                </div>
              </StepShell>
            )}

            {step === 1 && (
              <StepShell key="1" title="What do you want to learn?" subtitle="Pick a domain and add specifics.">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {DOMAINS.map((d) => {
                    const Icon = d.icon;
                    const active = domain?.key === d.key;
                    return (
                      <button
                        key={d.key}
                        onClick={() => setDomain(d)}
                        className={`text-left rounded-xl border p-4 transition ${
                          active
                            ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent-soft)]"
                            : "border-[color:var(--color-border)] bg-white hover:border-[color:var(--color-accent)]"
                        }`}
                      >
                        <span className={`grid h-9 w-9 place-items-center rounded-lg mb-3 ${active ? "bg-[color:var(--color-accent)] text-white" : "bg-[color:var(--color-surface-2)] text-[color:var(--color-foreground)]"}`}>
                          <Icon className="h-4 w-4" strokeWidth={1.75} />
                        </span>
                        <div className="text-sm font-semibold">{d.label}</div>
                        <div className="mt-0.5 text-xs text-[color:var(--color-muted-foreground)]">{d.desc}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted-foreground)]">
                    Specific focus (optional)
                  </label>
                  <Textarea
                    className="mt-2 min-h-[92px]"
                    placeholder={domain ? `e.g. ${domain.label} with a portfolio project` : "Pick a domain above first"}
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    disabled={!domain}
                  />
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="ghost" onClick={() => setStep(0)}><ArrowLeft className="h-4 w-4" /> Back</Button>
                  <Button variant="accent" onClick={() => setStep(2)} disabled={!domain}>Next <ArrowRight className="h-4 w-4" /></Button>
                </div>
              </StepShell>
            )}

            {step === 2 && (
              <StepShell key="2" title="How much time do you have?" subtitle="We'll size the roadmap to fit.">
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {DURATIONS.map((d) => (
                    <button
                      key={d.m}
                      onClick={() => { setMonths(d.m); submit(d.m); }}
                      className="text-left rounded-xl border border-[color:var(--color-border)] bg-white p-5 transition hover:border-[color:var(--color-accent)] hover:bg-[color:var(--color-accent-soft)]/40"
                    >
                      <div className="font-serif text-2xl">{d.label}</div>
                      <div className="mt-1 text-xs text-[color:var(--color-muted-foreground)]">{d.desc}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="ghost" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4" /> Back</Button>
                </div>
              </StepShell>
            )}

            {step === 3 && (
              <GeneratingView
                key="3"
                error={error}
                months={months}
                domain={domain}
                level={level}
                onRetry={() => months && submit(months)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Live preview */}
        <aside className="lg:sticky lg:top-20 h-fit">
          <Card className="p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted-foreground)]">Preview</p>
            <h3 className="mt-2 font-serif text-2xl leading-snug">
              {domain?.label || "Your roadmap"}
              {customGoal && <span className="italic text-[color:var(--color-accent)]"> — {customGoal}</span>}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {level && <Badge variant="accent">{level}</Badge>}
              {domain && <Badge variant="outline">{domain.label}</Badge>}
              {months && <Badge variant="outline">{months} mo</Badge>}
            </div>
            <div className="mt-6 space-y-3">
              {["Fundamentals", "Core concepts", "Applied practice", "Capstone"].map((m, i) => (
                <div key={m} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-[color:var(--color-surface-2)] text-xs font-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm">{m}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-[color:var(--color-muted-foreground)]">
              Real modules, lessons, and quizzes generated once you finish the last step.
            </p>
          </Card>
        </aside>
      </div>
    </main>
  );
}

function StepShell({ title, subtitle, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <h2 className="font-serif text-3xl">{title}</h2>
      {subtitle && <p className="mt-1 text-[color:var(--color-muted-foreground)]">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </motion.section>
  );
}

function Stepper({ step }) {
  const labels = ["Level", "Topic", "Duration", "Generate"];
  return (
    <ol className="flex items-center gap-2">
      {labels.map((l, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={l} className="flex items-center gap-2">
            <span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold ${
              done ? "bg-[color:var(--color-accent)] text-white" :
              active ? "bg-[color:var(--color-foreground)] text-white" :
              "bg-[color:var(--color-surface-2)] text-[color:var(--color-muted-foreground)]"
            }`}>{done ? <Check className="h-3 w-3" /> : i + 1}</span>
            <span className={`text-xs font-medium ${active ? "text-[color:var(--color-foreground)]" : "text-[color:var(--color-muted-foreground)]"}`}>{l}</span>
            {i < labels.length - 1 && <span className="h-px w-6 bg-[color:var(--color-border)]" />}
          </li>
        );
      })}
    </ol>
  );
}

function GeneratingView({ error, months, domain, level, onRetry }) {
  const [current, setCurrent] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (error) return;
    const start = Date.now();
    const tick = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    const t = setInterval(() => setCurrent((c) => (c < GEN_STEPS.length - 1 ? c + 1 : c)), 3500);
    return () => { clearInterval(t); clearInterval(tick); };
  }, [error]);

  const pct = Math.min(96, Math.round(((current + 1) / GEN_STEPS.length) * 100));

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[color:var(--color-border)] bg-white overflow-hidden shadow-[var(--shadow-sm)]"
    >
      <div className="h-1 bg-[color:var(--color-surface-2)]">
        <div className="h-full bg-[color:var(--color-accent)] transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent-hover)]">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-serif text-2xl">Building your pathway…</h2>
            <p className="text-xs text-[color:var(--color-muted-foreground)]">{domain?.label} · {level} · {months} month{months > 1 ? "s" : ""}</p>
          </div>
        </div>

        <ul className="space-y-3">
          {GEN_STEPS.map((s, i) => {
            const state = error ? (i < current ? "done" : "pending") :
              i < current ? "done" : i === current ? "active" : "pending";
            return (
              <li key={s} className="flex items-center gap-3">
                <span className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-mono ${
                  state === "done" ? "bg-[color:var(--color-accent)] text-white" :
                  state === "active" ? "bg-[color:var(--color-foreground)] text-white" :
                  "bg-[color:var(--color-surface-2)] text-[color:var(--color-muted-foreground)]"
                }`}>{state === "done" ? <Check className="h-3.5 w-3.5" /> : state === "active" ? <Spinner /> : i + 1}</span>
                <span className={state === "pending" ? "text-[color:var(--color-muted-foreground)] text-sm" : "text-sm"}>{s}</span>
              </li>
            );
          })}
        </ul>

        {error && (
          <div className="mt-6 rounded-lg border border-[color:var(--color-danger)]/30 bg-red-50 p-4 text-sm text-[color:var(--color-danger)]">
            <div className="font-medium">Generation failed</div>
            <div className="mt-1 break-words">{error}</div>
            {onRetry && <div className="mt-4"><Button variant="accent" onClick={onRetry}>Try again</Button></div>}
          </div>
        )}
        <p className="mt-6 text-center text-xs text-[color:var(--color-muted-foreground)]">
          {error ? "Something went wrong." : `Elapsed: ${elapsed}s · usually 20–90s`}
        </p>
      </div>
    </motion.section>
  );
}
