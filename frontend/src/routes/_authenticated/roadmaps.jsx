import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Grid3x3,
  List,
  Plus,
  Search,
  Trash2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { listRoadmaps, deleteRoadmap } from "@/lib/roadmaps.functions.js";
import {
  Card,
  Badge,
  ProgressBar,
  ProgressRing,
  Segmented,
  Spinner,
  Button,
} from "@/components/ui.jsx";

export const Route = createFileRoute("/_authenticated/roadmaps")({
  component: RoadmapsPage,
});

function RoadmapsPage() {
  const fetchList = useServerFn(listRoadmaps);
  const removeFn = useServerFn(deleteRoadmap);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["roadmaps"],
    queryFn: () => fetchList(),
  });

  const [view, setView] = useState("grid");
  const [level, setLevel] = useState("all");
  const [sort, setSort] = useState("recent");
  const [q, setQ] = useState("");

  async function remove(id) {
    if (!confirm("Delete this roadmap?")) return;
    await removeFn({ data: { id } });
    refetch();
  }

  const items = useMemo(() => {
    let list = (data || []).map((r) => {
      const total = (r.modules || []).reduce((n, m) => n + (m.lessons?.length || 0), 0);
      const done = (r.completed_lessons || []).length;
      return { ...r, total, done, pct: total ? Math.round((done / total) * 100) : 0 };
    });
    if (level !== "all") list = list.filter((r) => (r.level || "beginner").toLowerCase() === level);
    if (q) list = list.filter((r) => r.title?.toLowerCase().includes(q.toLowerCase()));
    if (sort === "progress") list.sort((a, b) => b.pct - a.pct);
    else if (sort === "az") list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    return list;
  }, [data, level, sort, q]);

  return (
    <main className="mx-auto max-w-6xl px-6 lg:px-10 py-8 lg:py-12">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted-foreground)]">
            Library
          </p>
          <h1 className="mt-2 font-serif text-4xl lg:text-5xl">My Roadmaps</h1>
          <p className="mt-1 text-[color:var(--color-muted-foreground)]">
            {data?.length ?? 0} saved · {items.length} shown
          </p>
        </div>
        <Button asChild variant="accent" size="lg">
          <Link to="/generate"><Sparkles className="h-4 w-4" /> New roadmap</Link>
        </Button>
      </header>

      {/* Toolbar */}
      <Card className="p-3 mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[color:var(--color-muted-foreground)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search roadmaps…"
            className="w-full h-10 rounded-lg border border-[color:var(--color-border)] bg-white pl-10 pr-3 text-sm placeholder:text-[color:var(--color-muted-foreground)] focus:border-[color:var(--color-accent)]"
          />
        </div>

        <Segmented
          value={level}
          onChange={setLevel}
          options={[
            { value: "all", label: "All" },
            { value: "beginner", label: "Beginner" },
            { value: "intermediate", label: "Intermediate" },
            { value: "advanced", label: "Advanced" },
          ]}
        />

        <Segmented
          value={sort}
          onChange={setSort}
          options={[
            { value: "recent", label: "Recent" },
            { value: "progress", label: "Progress" },
            { value: "az", label: "A–Z" },
          ]}
        />

        <div className="ml-auto flex items-center gap-1 rounded-lg border border-[color:var(--color-border)] p-1">
          <button
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={`grid h-8 w-8 place-items-center rounded-md transition ${view === "grid" ? "bg-[color:var(--color-foreground)] text-white" : "text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-surface-2)]"}`}
          >
            <Grid3x3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setView("list")}
            aria-label="List view"
            className={`grid h-8 w-8 place-items-center rounded-md transition ${view === "list" ? "bg-[color:var(--color-foreground)] text-white" : "text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-surface-2)]"}`}
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </Card>

      {isLoading ? (
        <Card className="p-16 flex justify-center"><Spinner /></Card>
      ) : items.length === 0 ? (
        <EmptyState hasAny={(data?.length ?? 0) > 0} />
      ) : view === "grid" ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: i * 0.03 }}
            >
              <RoadmapCard r={r} onDelete={() => remove(r.id)} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-white overflow-hidden">
          {items.map((r) => (
            <RoadmapRow key={r.id} r={r} onDelete={() => remove(r.id)} />
          ))}
        </div>
      )}
    </main>
  );
}

function RoadmapCard({ r, onDelete }) {
  return (
    <Card className="group overflow-hidden flex flex-col h-full hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all">
      <div className="relative h-28">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #e85d3a 0%, #f4a58a 55%, #fdece6 100%)" }}
        />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 40%, rgba(255,255,255,0.6), transparent 40%)" }} />
        <div className="absolute top-3 left-3"><Badge variant="outline" className="!bg-white/90">{r.level || "Beginner"}</Badge></div>
        <div className="absolute -bottom-6 right-4"><ProgressRing value={r.pct} size={56} stroke={5} /></div>
      </div>
      <div className="p-5 pt-8 flex flex-col gap-3 flex-1">
        <Link to="/roadmap/$id" params={{ id: r.id }}>
          <h3 className="font-serif text-xl leading-snug line-clamp-2 group-hover:text-[color:var(--color-accent)] transition">
            {r.title}
          </h3>
        </Link>
        <p className="text-xs text-[color:var(--color-muted-foreground)]">
          {r.done}/{r.total} lessons · {r.modules?.length || 0} modules
        </p>
        <div className="mt-auto"><ProgressBar value={r.pct} /></div>
        <div className="flex items-center gap-2 pt-1">
          <Link
            to="/roadmap/$id"
            params={{ id: r.id }}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[color:var(--color-foreground)] text-white text-xs font-medium hover:opacity-90 transition"
          >
            Open <ArrowRight className="h-3 w-3" />
          </Link>
          <button
            onClick={onDelete}
            aria-label="Delete"
            className="ml-auto grid h-9 w-9 place-items-center rounded-lg text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-danger)] hover:bg-[color:var(--color-surface-2)] transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </Card>
  );
}

function RoadmapRow({ r, onDelete }) {
  return (
    <div className="group flex flex-col md:flex-row md:items-center gap-4 px-5 md:px-6 py-5 border-b border-[color:var(--color-border)] last:border-b-0 hover:bg-[color:var(--color-surface-2)]/50 transition">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <Badge variant="accent">{r.level || "Beginner"}</Badge>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
            {r.modules?.length || 0} modules
          </span>
        </div>
        <Link to="/roadmap/$id" params={{ id: r.id }} className="block">
          <h3 className="font-serif text-lg leading-tight truncate group-hover:text-[color:var(--color-accent)] transition">
            {r.title}
          </h3>
        </Link>
      </div>
      <div className="flex items-center gap-6 md:gap-8">
        <div className="w-40">
          <div className="flex justify-between text-[11px] mb-1"><span className="uppercase tracking-wider text-[color:var(--color-muted-foreground)]">Progress</span><span className="font-mono font-medium">{r.pct}%</span></div>
          <ProgressBar value={r.pct} />
        </div>
        <div className="flex gap-2">
          <Link to="/roadmap/$id" params={{ id: r.id }} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[color:var(--color-foreground)] text-white text-xs font-medium hover:opacity-90 transition">
            Open <ArrowRight className="h-3 w-3" />
          </Link>
          <button onClick={onDelete} aria-label="Delete" className="grid h-9 w-9 place-items-center rounded-lg border border-[color:var(--color-border)] text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-danger)] hover:border-[color:var(--color-danger)] transition">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ hasAny }) {
  return (
    <Card className="p-16 text-center">
      <div
        aria-hidden
        className="mx-auto mb-6 h-20 w-20 rounded-2xl grid place-items-center"
        style={{ background: "linear-gradient(135deg, #fdece6, #f4a58a)" }}
      >
        <Sparkles className="h-8 w-8 text-[color:var(--color-accent-hover)]" strokeWidth={1.75} />
      </div>
      <h2 className="font-serif text-3xl">{hasAny ? "No matches." : "Nothing here yet."}</h2>
      <p className="mt-2 text-sm text-[color:var(--color-muted-foreground)]">
        {hasAny ? "Try clearing filters." : "Start with a goal — any goal."}
      </p>
      <div className="mt-6">
        <Button asChild variant="accent" size="lg">
          <Link to="/generate"><Plus className="h-4 w-4" /> Create roadmap</Link>
        </Button>
      </div>
    </Card>
  );
}
