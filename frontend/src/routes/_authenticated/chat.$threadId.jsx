import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  createThread,
  deleteThread,
  getThreadMessages,
  listThreads,
} from "@/lib/chat.functions";
import { MessageSquarePlus, Send, Trash2, Sparkles, Loader2, PanelLeftClose, PanelLeftOpen, MessageSquare } from "lucide-react";
import ChatMarkdown from "@/components/ChatMarkdown";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  loader: async ({ params }) => {
    const [threads, messages] = await Promise.all([
      listThreads(),
      getThreadMessages({ data: { threadId: params.threadId } }),
    ]);
    return { threads, initialMessages: messages };
  },
  component: ChatPage,
  errorComponent: ({ error }) => (
    <div className="p-8 text-sm text-red-600">Chat failed to load: {String(error?.message ?? error)}</div>
  ),
});

function ChatPage() {
  const { threadId } = Route.useParams();
  const { threads: initialThreads, initialMessages } = Route.useLoaderData();
  const nav = useNavigate();

  const [threads, setThreads] = useState(initialThreads);
  useEffect(() => setThreads(initialThreads), [initialThreads]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { threadId },
      }),
    [threadId],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
  });

  const [input, setInput] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [threadId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const isBusy = status === "submitted" || status === "streaming";

  async function onSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isBusy) return;
    setInput("");
    await sendMessage({ text });
    // refresh threads for title
    setTimeout(async () => {
      try {
        setThreads(await listThreads());
      } catch {}
    }, 1200);
  }

  async function onNewChat() {
    const t = await createThread();
    setThreads((prev) => [t, ...prev]);
    nav({ to: "/chat/$threadId", params: { threadId: t.id } });
  }

  async function onDelete(id, e) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this chat?")) return;
    await deleteThread({ data: { id } });
    const remaining = threads.filter((t) => t.id !== id);
    setThreads(remaining);
    if (id === threadId) {
      if (remaining[0]) nav({ to: "/chat/$threadId", params: { threadId: remaining[0].id } });
      else {
        const t = await createThread();
        setThreads([t]);
        nav({ to: "/chat/$threadId", params: { threadId: t.id } });
      }
    }
  }

  const ThreadList = (
    <>
      <div className="p-3 border-b border-[color:var(--color-border)] flex items-center gap-2">
        <button
          onClick={onNewChat}
          className="flex-1 inline-flex items-center gap-2 justify-center rounded-lg bg-[color:var(--color-foreground)] text-white h-10 text-sm font-medium hover:opacity-90 transition"
        >
          <MessageSquarePlus className="h-4 w-4" /> New chat
        </button>
        <button
          onClick={() => setPanelOpen(false)}
          aria-label="Close panel"
          className="lg:hidden h-10 w-10 grid place-items-center rounded-lg border border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-2)] transition"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {threads.length === 0 && (
          <div className="text-xs text-[color:var(--color-muted-foreground)] p-3">No conversations yet.</div>
        )}
        {threads.map((t) => {
          const active = t.id === threadId;
          return (
            <div
              key={t.id}
              onClick={() => {
                nav({ to: "/chat/$threadId", params: { threadId: t.id } });
                setPanelOpen(false);
              }}
              className={`group flex items-center gap-2 rounded-md px-3 py-2 text-sm cursor-pointer transition ${
                active
                  ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-foreground)]"
                  : "text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-surface-2)]"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate flex-1">{t.title || "New chat"}</span>
              <button
                onClick={(e) => onDelete(t.id, e)}
                aria-label="Delete"
                className="opacity-0 group-hover:opacity-100 text-[color:var(--color-muted-foreground)] hover:text-red-600 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <div className="h-[calc(100dvh-3.5rem)] relative flex bg-[color:var(--color-surface-2)] overflow-hidden">
      {/* Desktop: inline sidebar column, aligned next to the app sidebar */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-[color:var(--color-border)] bg-white">
        {ThreadList}
      </aside>

      {/* Mobile: overlay drawer */}
      {panelOpen && (
        <div
          onClick={() => setPanelOpen(false)}
          className="lg:hidden absolute inset-0 z-20 bg-black/30 backdrop-blur-[1px]"
        />
      )}
      <aside
        className={`lg:hidden absolute z-30 top-0 left-0 h-full w-72 flex flex-col border-r border-[color:var(--color-border)] bg-white shadow-xl transition-transform duration-200 ease-out ${
          panelOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {ThreadList}
      </aside>

      {/* Chat area */}
      <section className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-[color:var(--color-border)] bg-white/70 backdrop-blur flex items-center px-4 gap-2">
          <button
            onClick={() => setPanelOpen((v) => !v)}
            aria-label="Toggle conversations"
            className="lg:hidden h-9 w-9 grid place-items-center rounded-lg border border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-2)] transition"
          >
            {panelOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </button>
          <Sparkles className="h-4 w-4 text-[color:var(--color-accent)]" />
          <h1 className="font-serif italic text-lg truncate flex-1 min-w-0">PathwiseAI</h1>
          <button
            onClick={onNewChat}
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[color:var(--color-border)] text-sm hover:bg-[color:var(--color-surface-2)] transition"
          >
            <MessageSquarePlus className="h-4 w-4" /> New
          </button>
        </header>


        <div ref={scrollRef} className="flex-1 overflow-y-auto bg-gradient-to-b from-white via-white to-[color:var(--color-surface-2)]">
          <div className="mx-auto max-w-3xl px-6 py-10 space-y-8">
            {messages.length === 0 && (
              <div className="text-center py-20">
                <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[color:var(--color-accent)]/10 ring-1 ring-[color:var(--color-accent)]/20">
                  <Sparkles className="h-6 w-6 text-[color:var(--color-accent)]" />
                </div>
                <h2 className="font-serif italic text-3xl tracking-tight">How can I help you learn today?</h2>
                <p className="mt-3 text-sm text-[color:var(--color-muted-foreground)] max-w-md mx-auto">
                  Ask about any topic, plan a roadmap, or get a concept explained — thoughtfully, at your pace.
                </p>
                <div className="mt-8 grid sm:grid-cols-2 gap-2.5 max-w-xl mx-auto text-left">
                  {[
                    "Explain gradient descent like I'm new to it",
                    "Plan a 6-week roadmap to learn Rust",
                    "Give me 5 spaced-repetition prompts on SQL joins",
                    "Compare Airflow vs Prefect for a solo project",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="group rounded-xl border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm hover:border-[color:var(--color-accent)] hover:shadow-sm transition text-left flex items-start gap-2"
                    >
                      <Sparkles className="h-3.5 w-3.5 mt-0.5 text-[color:var(--color-accent)] opacity-60 group-hover:opacity-100 shrink-0" />
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <Message key={m.id} role={m.role} parts={m.parts} />
            ))}

            {status === "submitted" && (
              <div className="flex gap-3">
                <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[color:var(--color-accent)]/10 ring-1 ring-[color:var(--color-accent)]/20 text-[color:var(--color-accent)]">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="flex items-center gap-1.5 pt-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)] animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)] animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)] animate-bounce" />
                </div>
              </div>
            )}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {String(error.message || error)}
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="border-t border-[color:var(--color-border)] bg-white/80 backdrop-blur px-4 py-4"
        >
          <div className="mx-auto max-w-3xl">
            <div className="relative flex items-end rounded-2xl border border-[color:var(--color-border)] bg-white shadow-sm focus-within:border-[color:var(--color-accent)] focus-within:ring-2 focus-within:ring-[color:var(--color-accent)]/15 transition">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSubmit(e);
                  }
                }}
                rows={1}
                placeholder="Message PathwiseAI…"
                className="flex-1 resize-none bg-transparent px-4 py-3.5 pr-14 text-sm min-h-[52px] max-h-48 focus:outline-none placeholder:text-[color:var(--color-muted-foreground)]"
              />
              <button
                type="submit"
                disabled={isBusy || !input.trim()}
                className="absolute right-2 bottom-2 h-9 w-9 grid place-items-center rounded-xl bg-[color:var(--color-accent)] text-white hover:bg-[color:var(--color-accent-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition"
                aria-label="Send"
              >
                {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-2 text-[11px] text-[color:var(--color-muted-foreground)] text-center">
              PathwiseAI can make mistakes. Enter to send · Shift+Enter for newline
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}

function Message({ role, parts }) {
  const text = (parts || []).filter((p) => p.type === "text").map((p) => p.text).join("");
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[color:var(--color-foreground)] text-white px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[color:var(--color-accent)]/10 ring-1 ring-[color:var(--color-accent)]/20 text-[color:var(--color-accent)]">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0 pt-1">
        {text ? (
          <ChatMarkdown>{text}</ChatMarkdown>
        ) : (
          <span className="text-[color:var(--color-muted-foreground)]">…</span>
        )}
      </div>
    </div>
  );
}

