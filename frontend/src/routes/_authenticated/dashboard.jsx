import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { listRoadmaps, deleteRoadmap } from "@/lib/roadmaps.functions.js";

import {
  ArrowRight,
  Plus,
  Sparkles,
  Trash2,
  TrendingUp,
  BookOpen,
  Target,
  Layers,
  Clock,
} from "lucide-react";
import {
  Button,
  Card,
  Badge,
  ProgressBar,
  ProgressRing,
  StatCard,
  Spinner,
} from "@/components/ui.jsx";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

function stats(roadmaps) {
  const list = roadmaps || [];
  const totals = list.reduce(
    (acc, r) => {
      const total = (r.modules || []).reduce((n, m) => n + (m.lessons?.length || 0), 0);
      const done = (r.completed_lessons || []).length;
      acc.total += total;
      acc.done += done;
      return acc;
    },
    { total: 0, done: 0 },
  );
  const pct = totals.total ? Math.round((totals.done / totals.total) * 100) : 0;
  const active = list[0];
  const activeTotal = active ? (active.modules || []).reduce((n, m) => n + (m.lessons?.length || 0), 0) : 0;
  const activeDone = active ? (active.completed_lessons || []).length : 0;
  const activePct = activeTotal ? Math.round((activeDone / activeTotal) * 100) : 0;
  return { pct, total: totals.total, done: totals.done, active, activeTotal, activeDone, activePct };
}

function Dashboard() {
  const fetchList = useServerFn(listRoadmaps);
  const del = useServerFn(deleteRoadmap);
  const router = useRouter();
  const [firstName, setFirstName] = useState("there");
  const { data, isLoading } = useQuery({ queryKey: ["roadmaps"], queryFn: () => fetchList() });

  const { user } = Route.useRouteContext();

  useEffect(() => {
    const email = user?.email || "";
    const name = email ? email.split("@")[0] : "there";
    setFirstName(name.split(/[.\s]/)[0].replace(/^./, (c) => c.toUpperCase()));
  }, [user]);

  async function remove(id) {
    if (!confirm("Delete this roadmap?")) return;
    await del({ data: { id } });
    router.invalidate();
  }

  const s = stats(data);
  const goalLabel = s.active?.goal?.split("—")[0]?.trim() || "Set your first goal";
  const spark = useMemo(() => {
    // fake 7-day rhythm derived from progress for visual signal
    const base = Math.max(1, s.done);
    return Array.from({ length: 7 }, (_, i) => Math.max(0, Math.round(Math.sin(i / 1.3) * (base / 3) + base / 2 + i)));
  }, [s.done]);

  const recent = (data || []).slice(0, 3);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-12">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-white p-5 sm:p-8 lg:p-10 mb-8 shadow-[var(--shadow-sm)]"
      >
        <div
          aria-hidden
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #fdece6, transparent 70%)" }}
        />
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <Badge variant="accent">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)]" />
              {new Date().toLocaleDateString(undefined, { weekday: "long" })}
            </Badge>
            <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight">
              Welcome back, <span className="italic text-[color:var(--color-accent)]">{firstName}</span>.
            </h1>
            <p className="mt-3 text-[color:var(--color-muted-foreground)] max-w-xl">
              You're {s.pct}% through your learning plan. Small steps compound — pick up where you left off.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {s.active && (
              <Link
                to="/roadmap/$id"
                params={{ id: s.active.id }}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-lg border border-[color:var(--color-border-strong)] bg-white text-sm font-medium hover:bg-[color:var(--color-surface-2)] transition"
              >
                <Clock className="h-4 w-4" strokeWidth={1.75} />
                Resume last lesson
              </Link>
            )}
            <Link
              to="/generate"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-[color:var(--color-accent)] text-white text-sm font-medium hover:bg-[color:var(--color-accent-hover)] shadow-[var(--shadow-sm)] transition"
            >
              <Sparkles className="h-4 w-4" strokeWidth={2} />
              New roadmap
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Overall Progress" value={`${s.pct}%`} icon={TrendingUp} delta={s.pct > 0 ? 4 : 0} />
        <StatCard label="Lessons Done" value={s.done} icon={BookOpen} sparkline={spark} />
        <StatCard label="Roadmaps" value={String(data?.length ?? 0).padStart(2, "0")} icon={Layers} />
        <StatCard label="Focus" value={<span className="text-lg">{goalLabel}</span>} icon={Target} />
      </section>

      {/* Continue + Recent activity */}
      <section className="grid gap-6 lg:grid-cols-12 mb-8">
        <Card className="lg:col-span-8 overflow-hidden">
          <div className="relative">
            <div
              aria-hidden
              className="h-24 w-full"
              style={{ background: "linear-gradient(120deg, #e85d3a 0%, #f0916f 60%, #fdece6 100%)" }}
            />
            <div className="absolute top-4 left-4 sm:left-6">
              <Badge variant="outline" className="!bg-white/90">Continue learning</Badge>
            </div>
          </div>
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            {isLoading ? (
              <div className="flex items-center gap-3 text-[color:var(--color-muted-foreground)]"><Spinner /> Loading…</div>
            ) : s.active ? (
              <>
                <div className="min-w-0 flex-1 w-full">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted-foreground)]">Currently learning</p>
                  <h2 className="mt-1 font-serif text-xl sm:text-2xl lg:text-3xl truncate">{s.active.title}</h2>
                  <p className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
                    {s.activeDone} of {s.activeTotal} lessons complete · {s.active.modules?.length || 0} modules
                  </p>
                  <div className="mt-4 max-w-md"><ProgressBar value={s.activePct} /></div>
                </div>
                <div className="flex items-center gap-4 sm:gap-5 w-full md:w-auto justify-between md:justify-end shrink-0">
                  <ProgressRing value={s.activePct} size={72} stroke={7} />
                  <Link
                    to="/roadmap/$id"
                    params={{ id: s.active.id }}
                    className="inline-flex items-center gap-2 h-11 px-4 sm:px-5 rounded-lg bg-[color:var(--color-foreground)] text-white text-sm font-medium hover:opacity-90 transition whitespace-nowrap"
                  >
                    Resume <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                <div className="min-w-0">
                  <h2 className="font-serif text-xl sm:text-2xl">No roadmap yet.</h2>
                  <p className="text-sm text-[color:var(--color-muted-foreground)]">Turn any goal into a step-by-step plan.</p>
                </div>
                <Button asChild variant="accent" size="lg" className="w-full sm:w-auto">
                  <Link to="/generate">
                    <Sparkles className="h-4 w-4" /> Create your first
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-4 p-4 sm:p-6">

          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg">Quick actions</h3>
          </div>
          <div className="space-y-2">
            <ActionRow to="/generate" icon={Plus} title="New roadmap" subtitle="Generate from a goal" />
            <ActionRow to="/roadmaps" icon={Layers} title="All roadmaps" subtitle={`${data?.length ?? 0} saved`} />
            {s.active && (
              <ActionRow
                to={`/roadmap/${s.active.id}`}
                icon={BookOpen}
                title="Continue current"
                subtitle={s.active.title}
              />
            )}
          </div>
        </Card>
      </section>

      {/* Recent roadmaps */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-serif text-2xl">Recent roadmaps</h2>
          <Link to="/roadmaps" className="text-sm text-[color:var(--color-accent)] hover:underline underline-offset-4">
            See all →
          </Link>
        </div>

        {isLoading ? (
          <Card className="p-10 flex justify-center"><Spinner /></Card>
        ) : recent.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="font-serif text-2xl">Nothing here yet.</p>
            <p className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">Generate your first roadmap to get started.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recent.map((r, i) => {
              const total = (r.modules || []).reduce((n, m) => n + (m.lessons?.length || 0), 0);
              const done = (r.completed_lessons || []).length;
              const pct = total ? Math.round((done / total) * 100) : 0;
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <Card className="group p-5 flex flex-col gap-4 h-full hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all">
                    <div className="flex items-center justify-between">
                      <Badge variant="accent">{r.level || "Beginner"}</Badge>
                      <button
                        aria-label="Delete roadmap"
                        onClick={() => remove(r.id)}
                        className="opacity-0 group-hover:opacity-100 h-8 w-8 grid place-items-center rounded-md text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-danger)] hover:bg-[color:var(--color-surface-2)] transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <Link to="/roadmap/$id" params={{ id: r.id }} className="block">
                      <h3 className="font-serif text-xl leading-snug line-clamp-2 group-hover:text-[color:var(--color-accent)] transition">
                        {r.title}
                      </h3>
                    </Link>
                    <div className="mt-auto">
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-muted-foreground)]">
                          {done}/{total} lessons
                        </span>
                        <span className="font-mono text-xs font-medium">{pct}%</span>
                      </div>
                      <ProgressBar value={pct} />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function ActionRow({ to, icon: Icon, title, subtitle }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-lg border border-[color:var(--color-border)] px-3 py-3 hover:border-[color:var(--color-accent)] hover:bg-[color:var(--color-accent-soft)]/40 transition"
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-[color:var(--color-surface-2)] text-[color:var(--color-foreground)] group-hover:bg-white group-hover:text-[color:var(--color-accent)] transition">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-xs text-[color:var(--color-muted-foreground)] truncate">{subtitle}</p>
      </div>
      <ArrowRight className="h-3.5 w-3.5 text-[color:var(--color-muted-foreground)] group-hover:text-[color:var(--color-accent)] group-hover:translate-x-0.5 transition" />
    </Link>
  );
}
