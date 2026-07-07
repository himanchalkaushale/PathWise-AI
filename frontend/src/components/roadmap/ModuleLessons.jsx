import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, ChevronDown, ChevronUp, RefreshCw, Save, Send, Youtube, ExternalLink, Maximize, X } from "lucide-react";
import {
  toggleLesson,
  getLessonContent,
  saveLessonContent,
  extendLessonContent,
  suggestLessonVideos,
} from "@/lib/roadmaps.functions.js";
import { Spinner, Button } from "@/components/ui.jsx";
import MarkdownArticle from "@/components/MarkdownArticle.jsx";


export default function ModuleLessons({ module, moduleIndex, roadmap, onChange }) {
  const toggle = useServerFn(toggleLesson);
  const fetchContent = useServerFn(getLessonContent);
  const saveContent = useServerFn(saveLessonContent);
  const extendContent = useServerFn(extendLessonContent);
  const fetchVideos = useServerFn(suggestLessonVideos);
  const done = new Set(roadmap.completed_lessons || []);
  const [expanded, setExpanded] = useState(null);
  // per-lesson state: { content, saved, loading, saving, extending, topic, error, videos, videosLoading }
  const [contents, setContents] = useState({});
  const [fullScreenLesson, setFullScreenLesson] = useState(null);



  function patch(id, next) {
    setContents((c) => ({ ...c, [id]: { ...(c[id] || {}), ...next } }));
  }

  async function flip(lessonId) {
    await toggle({ data: { id: roadmap.id, lessonId } });
    onChange();
  }

  async function loadLesson(lesson, { regen = false } = {}) {
    patch(lesson.id, { loading: true, error: null });
    try {
      const { content, saved } = await fetchContent({
        data: { id: roadmap.id, moduleIndex, lessonId: lesson.id, regen },
      });
      patch(lesson.id, { content, saved: !!saved, loading: false });
    } catch (err) {
      patch(lesson.id, { loading: false, error: err.message });
    }
  }

  async function openLesson(lesson) {
    const isOpen = expanded === lesson.id;
    setExpanded(isOpen ? null : lesson.id);
    if (isOpen) return;
    const existing = contents[lesson.id];
    if (existing?.content) return;
    // Persisted content is treated as saved.
    if (lesson.content && lesson.content.trim()) {
      patch(lesson.id, { content: lesson.content, saved: true });
      return;
    }
    loadLesson(lesson);
  }

  async function save(lesson) {
    const body = contents[lesson.id]?.content;
    if (!body) return;
    patch(lesson.id, { saving: true });
    try {
      await saveContent({
        data: { id: roadmap.id, moduleIndex, lessonId: lesson.id, content: body },
      });
      patch(lesson.id, { saving: false, saved: true });
      onChange?.();
    } catch (err) {
      patch(lesson.id, { saving: false, error: err.message });
    }
  }

  async function extend(lesson) {
    const state = contents[lesson.id] || {};
    const topic = (state.topic || "").trim();
    const body = state.content || lesson.content || "";
    if (!topic || !body) return;
    patch(lesson.id, { extending: true, error: null });
    try {
      const { addition } = await extendContent({
        data: {
          id: roadmap.id,
          moduleIndex,
          lessonId: lesson.id,
          existing: body,
          topic,
        },
      });
      const merged = `${body.trimEnd()}\n\n${addition.trim()}\n`;
      patch(lesson.id, { content: merged, extending: false, topic: "", saved: false });
    } catch (err) {
      patch(lesson.id, { extending: false, error: err.message });
    }
  }

  async function loadVideos(lesson) {
    const body = contents[lesson.id]?.content || lesson.content || "";
    patch(lesson.id, { videosLoading: true, videosError: null });
    try {
      const { videos } = await fetchVideos({
        data: { id: roadmap.id, moduleIndex, lessonId: lesson.id, article: body },
      });
      patch(lesson.id, { videos, videosLoading: false });
    } catch (err) {
      patch(lesson.id, { videosLoading: false, videosError: err.message });
    }
  }





  return (
    <ul className="space-y-2">
      {(module.lessons || []).map((l, i) => {
        const isOpen = expanded === l.id;
        const isDone = done.has(l.id);
        const state = contents[l.id] || {};
        const body = state.content || l.content;
        const isPersisted = !!l.content;
        const canSave = !!body && !state.saved && !isPersisted;
        return (
          <li
            key={l.id}
            className={`rounded-xl border transition ${
              isDone ? "border-emerald-200 bg-emerald-50/30" : "border-[color:var(--color-border)] bg-white"
            }`}
          >
            <div className="flex items-start gap-3 p-4">
              <button
                onClick={() => flip(l.id)}
                aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border transition ${
                  isDone
                    ? "bg-[color:var(--color-accent)] border-[color:var(--color-accent)] text-white"
                    : "border-[color:var(--color-border-strong)] hover:border-[color:var(--color-accent)]"
                }`}
              >
                {isDone && <Check className="h-3 w-3" strokeWidth={3} />}
              </button>
              <div className="flex-1 flex items-center justify-between gap-3 min-w-0">
                <button className="flex-1 text-left min-w-0 py-1" onClick={() => openLesson(l)}>
                  <span
                    className={`text-[15px] font-medium ${
                      isDone ? "line-through text-[color:var(--color-muted-foreground)]" : ""
                    }`}
                  >
                    <span className="font-mono text-xs text-[color:var(--color-muted-foreground)] mr-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {l.title}
                  </span>
                </button>
                <div className="flex items-center gap-1 pr-2">
                  {isOpen && body && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFullScreenLesson(l);
                      }}
                      className="p-1.5 hover:bg-[color:var(--color-surface-2)] rounded transition"
                      title="Read Fullscreen"
                    >
                      <Maximize className="h-4 w-4 text-[color:var(--color-muted-foreground)] shrink-0" />
                    </button>
                  )}
                  <button onClick={() => openLesson(l)} className="p-1.5 hover:bg-[color:var(--color-surface-2)] rounded transition">
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-[color:var(--color-muted-foreground)] shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-[color:var(--color-muted-foreground)] shrink-0" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {isOpen && (
              <div className="border-t border-[color:var(--color-border)] px-5 py-5">
                {state.loading && (
                  <div className="space-y-2">
                    <div className="h-3 rounded shimmer bg-[color:var(--color-surface-2)]" />
                    <div className="h-3 rounded shimmer bg-[color:var(--color-surface-2)] w-11/12" />
                    <div className="h-3 rounded shimmer bg-[color:var(--color-surface-2)] w-4/5" />
                    <span className="inline-flex items-center gap-2 text-[color:var(--color-muted-foreground)] text-xs">
                      <Spinner /> Writing this lesson…
                    </span>
                  </div>
                )}
                {state.error && (
                  <div className="mb-3 rounded-md border border-[color:var(--color-danger)]/30 bg-red-50 p-3 text-sm text-[color:var(--color-danger)]">
                    {state.error}
                  </div>
                )}
                {body && <MarkdownArticle>{body}</MarkdownArticle>}
                {body && !state.loading && (
                  <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-[color:var(--color-border)] pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadLesson(l, { regen: true })}
                      disabled={state.loading}
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                    </Button>
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => save(l)}
                      disabled={!canSave || state.saving}
                    >
                      {state.saving ? <Spinner /> : <Save className="h-3.5 w-3.5" />}
                      {state.saved || isPersisted ? "Saved" : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadVideos(l)}
                      disabled={state.videosLoading}
                    >
                      {state.videosLoading ? <Spinner /> : <Youtube className="h-3.5 w-3.5" />}
                      {state.videosLoading ? "Finding…" : (state.videos ? "Refresh videos" : "Suggest videos")}
                    </Button>
                    {(state.saved || isPersisted) && (
                      <span className="text-xs text-[color:var(--color-muted-foreground)]">
                        Stored with your roadmap
                      </span>
                    )}
                  </div>
                )}
                {state.videosError && (
                  <div className="mt-3 rounded-md border border-[color:var(--color-danger)]/30 bg-red-50 p-3 text-xs text-[color:var(--color-danger)]">
                    {state.videosError}
                  </div>
                )}
                {Array.isArray(state.videos) && state.videos.length > 0 && (
                  <div className="mt-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/40 p-3">
                    <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted-foreground)]">
                      <Youtube className="h-3.5 w-3.5 text-red-600" /> Recommended videos
                    </div>
                    <ul className="space-y-2">
                      {state.videos.map((v, idx) => (
                        <li key={idx} className="text-sm">
                          <a
                            href={v.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-medium text-[color:var(--color-accent)] hover:underline"
                          >
                            {v.title}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                          {v.channel && (
                            <span className="ml-2 text-xs text-[color:var(--color-muted-foreground)]">· {v.channel}</span>
                          )}
                          {v.why && (
                            <div className="text-xs text-[color:var(--color-muted-foreground)]">{v.why}</div>
                          )}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-[11px] text-[color:var(--color-muted-foreground)]">
                      Links open a YouTube search for the suggested video.
                    </p>
                  </div>
                )}

                {body && !state.loading && (
                  <form
                    onSubmit={(e) => { e.preventDefault(); extend(l); }}
                    className="mt-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/40 p-3"
                  >
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted-foreground)] mb-2">
                      Add a topic to this lesson
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={state.topic || ""}
                        onChange={(e) => patch(l.id, { topic: e.target.value })}
                        placeholder="e.g. explain gradient descent with an example"
                        disabled={state.extending}
                        className="flex-1 h-10 rounded-lg border border-[color:var(--color-border)] bg-white px-3 text-sm placeholder:text-[color:var(--color-muted-foreground)] focus:border-[color:var(--color-accent)] focus:outline-none"
                      />
                      <Button
                        type="submit"
                        variant="accent"
                        size="sm"
                        disabled={state.extending || !(state.topic || "").trim()}
                      >
                        {state.extending ? <Spinner /> : <Send className="h-3.5 w-3.5" />}
                        {state.extending ? "Extending…" : "Extend"}
                      </Button>
                    </div>
                    <p className="mt-2 text-[11px] text-[color:var(--color-muted-foreground)]">
                      The rest of the article stays the same — a new section is appended. Click Save to keep it.
                    </p>
                  </form>
                )}

              </div>
            )}
          </li>
        );
      })}

      {fullScreenLesson && (
        <div className="fixed inset-0 z-[100] bg-white overflow-auto p-4 md:p-10 flex flex-col">
          <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto w-full pt-4">
            <h2 className="text-2xl font-bold text-[color:var(--color-foreground)] pr-4">
              {fullScreenLesson.title}
            </h2>
            <button
              onClick={() => setFullScreenLesson(null)}
              className="p-2 hover:bg-[color:var(--color-surface-2)] rounded-full transition flex-shrink-0"
              title="Close Fullscreen"
            >
              <X className="h-6 w-6 text-[color:var(--color-muted-foreground)]" />
            </button>
          </div>
          <div className="max-w-4xl mx-auto w-full pb-20">
            <MarkdownArticle>
              {contents[fullScreenLesson.id]?.content || fullScreenLesson.content}
            </MarkdownArticle>
          </div>
        </div>
      )}
    </ul>
  );
}
