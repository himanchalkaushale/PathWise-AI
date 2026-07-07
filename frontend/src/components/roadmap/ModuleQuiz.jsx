import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { generateModuleQuiz } from "@/lib/roadmaps.functions.js";
import { Button, Card, Input, Spinner } from "@/components/ui.jsx";

export default function ModuleQuiz({ module, moduleIndex, roadmap }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [quiz, setQuiz] = useState([]);
  const [count, setCount] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const gen = useServerFn(generateModuleQuiz);

  async function generate() {
    setLoading(true);
    setError("");
    setSubmitted(false);
    setAnswers({});
    try {
      const n = Math.max(1, Math.min(40, Number(count) || 15));
      const { quiz: q } = await gen({ data: { id: roadmap.id, moduleIndex, count: n } });
      if (!q?.length) throw new Error("No questions returned");
      setQuiz(q);
    } catch (e) {
      setError(e.message || "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  }

  const score = quiz.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0);

  return (
    <Card className="p-6 lg:p-8">
      <div 
        className="flex items-center justify-between gap-4 flex-wrap cursor-pointer group select-none" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-muted-foreground)]">
            Checkpoint
          </div>
          <div className="font-serif text-2xl mt-1">Module quiz</div>
          <p className="text-sm text-[color:var(--color-muted-foreground)] mt-1">
            Generate a custom quiz for this module. Default 15, max 40.
          </p>
        </div>
        <div className="p-2 hover:bg-[color:var(--color-surface-2)] rounded-full transition text-[color:var(--color-muted-foreground)]">
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </div>

      {isOpen && (
        <>
          <div className="mt-5 rounded-lg border border-dashed border-[color:var(--color-border)] p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Sparkles className="h-4 w-4 text-[color:var(--color-accent)]" />
          <span className="text-sm font-medium">Generate quiz</span>
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-xs text-[color:var(--color-muted-foreground)]">Questions</label>
            <Input
              type="number"
              min={1}
              max={40}
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="!h-9 !w-20 !px-2 text-center"
            />
            <Button variant="accent" size="sm" onClick={generate} disabled={loading}>
              {loading ? <Spinner size={14} /> : <Sparkles className="h-3.5 w-3.5" />}
              {loading ? "Generating…" : quiz.length ? "Regenerate" : "Generate"}
            </Button>
          </div>
        </div>
        {error && <p className="mt-2 text-xs text-[color:var(--color-danger)]">{error}</p>}
      </div>

      {quiz.length > 0 && (
        <div className="mt-6 space-y-6">
          {quiz.map((q, i) => (
            <div key={i}>
              <p className="text-[15px] font-medium">
                {i + 1}. {q.q}
              </p>
              <div className="mt-2.5 space-y-1.5">
                {q.options.map((o, j) => {
                  const picked = answers[i] === j;
                  const correct = submitted && j === q.answer;
                  const wrong = submitted && picked && j !== q.answer;
                  return (
                    <label
                      key={j}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-3 text-sm transition ${
                        correct
                          ? "border-emerald-500 bg-emerald-50"
                          : wrong
                          ? "border-[color:var(--color-danger)] bg-red-50"
                          : picked
                          ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent-soft)]"
                          : "border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)]"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q${moduleIndex}-${i}`}
                        checked={picked}
                        onChange={() => !submitted && setAnswers({ ...answers, [i]: j })}
                        className="accent-[color:var(--color-accent)]"
                      />
                      {o}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
          {!submitted ? (
            <Button
              variant="accent"
              onClick={() => setSubmitted(true)}
              disabled={Object.keys(answers).length !== quiz.length}
            >
              Submit answers
            </Button>
          ) : (
            <p className="text-sm text-[color:var(--color-muted-foreground)]">
              Scored {score}/{quiz.length}
            </p>
          )}
        </div>
      )}
        </>
      )}
    </Card>
  );
}
