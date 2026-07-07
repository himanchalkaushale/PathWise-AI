import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Flag } from "lucide-react";
import { getRoadmap } from "@/lib/roadmaps.functions.js";
import { Button, Card, Badge, ProgressBar, Spinner } from "@/components/ui.jsx";
import ModuleLessons from "@/components/roadmap/ModuleLessons.jsx";
import ModuleQuiz from "@/components/roadmap/ModuleQuiz.jsx";

export const Route = createFileRoute("/_authenticated/roadmap/$id/module/$index")({
  component: ModulePage,
});

function ModulePage() {
  const { id, index } = Route.useParams();
  const navigate = useNavigate();
  const idx = parseInt(index, 10);
  const fetchOne = useServerFn(getRoadmap);
  const { data: r, isLoading, refetch } = useQuery({
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
  if (!r || !r.modules?.[idx]) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-serif text-4xl">Module not found</h1>
        <Button asChild variant="accent" className="mt-6">
          <Link to="/roadmap/$id" params={{ id }}>
            Back to pathway
          </Link>
        </Button>
      </main>
    );
  }

  const modules = r.modules;
  const module = modules[idx];
  const completed = new Set(r.completed_lessons || []);
  const totalL = module.lessons?.length || 0;
  const doneL = (module.lessons || []).filter((l) => completed.has(l.id)).length;
  const pct = totalL ? Math.round((doneL / totalL) * 100) : 0;
  const hasPrev = idx > 0;
  const hasNext = idx < modules.length - 1;

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-3xl px-6 lg:px-8 py-8 lg:py-10"
    >
      {/* Back bar / breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/roadmap/$id"
          params={{ id }}
          className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to pathway
        </Link>
        <div className="text-xs text-[color:var(--color-muted-foreground)] truncate">
          <span className="truncate">{r.title}</span>
          <span className="mx-2">/</span>
          <span className="text-[color:var(--color-foreground)]">Module {idx + 1}</span>
        </div>
      </div>

      {/* Module header */}
      <Card className="p-6 lg:p-8 mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="accent">
                Module {idx + 1} of {modules.length}
              </Badge>
              {module.duration && <Badge variant="outline">{module.duration}</Badge>}
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl leading-tight">{module.title}</h1>
            <p className="mt-3 text-[color:var(--color-muted-foreground)]">{module.summary}</p>
            <div className="mt-5 max-w-sm">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
                  {doneL}/{totalL} lessons
                </span>
                <span className="font-mono font-medium">{pct}%</span>
              </div>
              <ProgressBar value={pct} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPrev}
              onClick={() =>
                hasPrev &&
                navigate({
                  to: "/roadmap/$id/module/$index",
                  params: { id, index: String(idx - 1) },
                })
              }
              aria-label="Previous module"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNext}
              onClick={() =>
                hasNext &&
                navigate({
                  to: "/roadmap/$id/module/$index",
                  params: { id, index: String(idx + 1) },
                })
              }
              aria-label="Next module"
            >
              Next <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Lessons */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted-foreground)]">
            Lessons · {totalL}
          </span>
        </div>
        <ModuleLessons module={module} moduleIndex={idx} roadmap={r} onChange={refetch} />
      </section>

      {/* Quiz */}
      <section className="mb-10">
        <ModuleQuiz module={module} moduleIndex={idx} roadmap={r} onChange={refetch} />
      </section>

      {/* Footer nav */}
      <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--color-border)] pt-6">
        {hasPrev ? (
          <Button asChild variant="outline">
            <Link
              to="/roadmap/$id/module/$index"
              params={{ id, index: String(idx - 1) }}
            >
              <ArrowLeft className="h-4 w-4" /> Previous module
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {hasNext ? (
          <Button asChild variant="accent">
            <Link
              to="/roadmap/$id/module/$index"
              params={{ id, index: String(idx + 1) }}
            >
              Next module <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button asChild variant="accent">
            <Link to="/roadmap/$id" params={{ id }}>
              <Flag className="h-4 w-4" /> Finish roadmap
            </Link>
          </Button>
        )}
      </div>
    </motion.main>
  );
}
