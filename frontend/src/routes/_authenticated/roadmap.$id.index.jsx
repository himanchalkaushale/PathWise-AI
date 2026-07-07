import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Play, Share2 } from "lucide-react";
import { getRoadmap } from "@/lib/roadmaps.functions.js";
import { Button, Card, Badge, ProgressBar, ProgressRing, Spinner } from "@/components/ui.jsx";

export const Route = createFileRoute("/_authenticated/roadmap/$id/")({ component: RoadmapPage });

function RoadmapPage() {
  const { id } = Route.useParams();
  const fetchOne = useServerFn(getRoadmap);
  const { data: r, isLoading } = useQuery({
    queryKey: ["roadmap", id],
    queryFn: () => fetchOne({ data: { id } }),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (!r) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-serif text-4xl">Roadmap not found</h1>
        <p className="mt-2 text-[color:var(--color-muted-foreground)]">It may have been deleted.</p>
        <Button asChild variant="accent" className="mt-6">
          <Link to="/roadmaps">Back to library</Link>
        </Button>
      </main>
    );
  }

  const modules = r.modules || [];
  const completed = new Set(r.completed_lessons || []);
  const total = modules.reduce((n, m) => n + (m.lessons?.length || 0), 0);
  const done = completed.size;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const nextIndex = modules.findIndex((m) =>
    (m.lessons || []).some((l) => !completed.has(l.id)),
  );
  const resumeIndex = nextIndex >= 0 ? nextIndex : 0;

  return (
    <main className="mx-auto max-w-3xl px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-6">
        <Link
          to="/roadmaps"
          className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
        >
          <ArrowLeft className="h-4 w-4" /> Library
        </Link>
      </div>

      <Card className="p-6 lg:p-8 mb-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="accent">{r.level || "Beginner"}</Badge>
              <Badge variant="outline">{modules.length} modules</Badge>
              <Badge variant="outline">{total} lessons</Badge>
            </div>
            <h1 className="font-serif text-3xl lg:text-5xl leading-tight">{r.title}</h1>
            <p className="mt-3 text-[color:var(--color-muted-foreground)]">{r.goal}</p>
            <div className="mt-5 max-w-md">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
                  {done}/{total} lessons
                </span>
                <span className="font-mono font-medium">{pct}%</span>
              </div>
              <ProgressBar value={pct} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ProgressRing value={pct} size={92} stroke={7} />
            <div className="flex flex-col gap-2">
              <Button asChild variant="accent">
                <Link
                  to="/roadmap/$id/module/$index"
                  params={{ id: r.id, index: String(resumeIndex) }}
                >
                  <Play className="h-4 w-4" /> {nextIndex >= 0 ? "Resume" : "Review"}
                </Link>
              </Button>
              <Button variant="outline" size="sm" aria-label="Share">
                <Share2 className="h-3.5 w-3.5" /> Share
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="mb-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)]" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted-foreground)]">
          Pathway · {modules.length} modules
        </span>
      </div>

      <div className="flex flex-col items-center">
        {modules.map((m, i) => {
          const modDone = (m.lessons || []).filter((l) => completed.has(l.id)).length;
          const totalL = m.lessons?.length || 0;
          const isDone = totalL > 0 && modDone === totalL;
          const score = r.quiz_scores?.[i];
          return (
            <div key={i} className="flex w-full flex-col items-center">
              <PathwayNode
                roadmapId={r.id}
                index={i}
                module={m}
                done={modDone}
                total={totalL}
                completed={isDone}
                score={score}
              />
              {i < modules.length - 1 && <Connector done={isDone} />}
            </div>
          );
        })}

        <div className="mt-6 flex flex-col items-center">
          <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-dashed border-[color:var(--color-border-strong)] text-[color:var(--color-muted-foreground)]">
            ★
          </div>
          <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted-foreground)]">
            Goal reached
          </div>
        </div>
      </div>
    </main>
  );
}

function PathwayNode({ roadmapId, index, module, done, total, completed, score }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <motion.div whileHover={{ y: -2 }} className="w-full">
      <Link
        to="/roadmap/$id/module/$index"
        params={{ id: roadmapId, index: String(index) }}
        className={`group block w-full rounded-2xl border bg-white p-6 transition-all ${
          completed
            ? "border-emerald-400/60"
            : "border-[color:var(--color-border)] hover:border-[color:var(--color-accent)]/60 hover:shadow-[var(--shadow-md)]"
        }`}
      >
        <div className="flex items-start gap-5">
          <div
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl font-mono text-sm font-semibold ${
              completed
                ? "bg-emerald-600 text-white"
                : "bg-[color:var(--color-surface-2)] text-[color:var(--color-foreground)] group-hover:bg-[color:var(--color-accent)] group-hover:text-white"
            }`}
          >
            {completed ? <Check className="h-5 w-5" /> : String(index + 1).padStart(2, "0")}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted-foreground)]">
                Module {index + 1}
                {module.duration ? ` · ${module.duration}` : ""}
              </div>
              {score != null && (
                <Badge variant="accent">
                  Quiz {score}/{module.quiz?.length || 3}
                </Badge>
              )}
            </div>
            <h3 className="mt-1.5 font-serif text-2xl leading-snug">{module.title}</h3>
            <p className="mt-2 text-sm text-[color:var(--color-muted-foreground)] line-clamp-2">
              {module.summary}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <ProgressBar value={pct} className="flex-1" />
              <span className="font-mono text-[11px] text-[color:var(--color-muted-foreground)]">
                {done}/{total}
              </span>
              <ArrowRight className="h-4 w-4 text-[color:var(--color-muted-foreground)] transition group-hover:translate-x-0.5 group-hover:text-[color:var(--color-accent)]" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Connector({ done }) {
  return (
    <svg width="2" height="48" className="my-0" aria-hidden>
      <line
        x1="1"
        y1="0"
        x2="1"
        y2="48"
        stroke={done ? "var(--color-accent)" : "var(--color-border-strong)"}
        strokeWidth="2"
        strokeDasharray={done ? "0" : "4 4"}
      />
    </svg>
  );
}
