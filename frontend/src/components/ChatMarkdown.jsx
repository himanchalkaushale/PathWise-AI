import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { Check, Copy } from "lucide-react";

function CodeBlock({ className, children }) {
  const [copied, setCopied] = useState(false);
  const lang = (className || "").replace("language-", "") || "text";
  const raw = String(children ?? "").replace(/\n$/, "");

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-[#1f2937] bg-[#0d1117] shadow-sm">
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#161b22] border-b border-[#1f2937] text-[11px] text-slate-400 font-mono">
        <span>{lang}</span>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1 hover:text-white transition"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className={`hljs ${className || ""}`}>{children}</code>
      </pre>
    </div>
  );
}

export default function ChatMarkdown({ children }) {
  return (
    <div className="chat-md text-[15px] leading-relaxed text-[color:var(--color-foreground)]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={{
          p: (p) => <p className="my-3 whitespace-pre-wrap" {...p} />,
          h1: (p) => <h1 className="font-serif text-2xl mt-5 mb-2" {...p} />,
          h2: (p) => <h2 className="font-serif text-xl mt-5 mb-2" {...p} />,
          h3: (p) => <h3 className="font-semibold text-base mt-4 mb-1.5" {...p} />,
          ul: (p) => <ul className="my-3 list-disc pl-6 space-y-1" {...p} />,
          ol: (p) => <ol className="my-3 list-decimal pl-6 space-y-1" {...p} />,
          li: (p) => <li className="leading-relaxed" {...p} />,
          a: (p) => (
            <a
              className="text-[color:var(--color-accent)] underline underline-offset-2 hover:opacity-80"
              target="_blank"
              rel="noreferrer"
              {...p}
            />
          ),
          blockquote: (p) => (
            <blockquote
              className="my-4 border-l-4 border-[color:var(--color-accent)] bg-[color:var(--color-accent-soft)]/30 px-3 py-1.5 italic"
              {...p}
            />
          ),
          table: (p) => (
            <div className="my-4 overflow-x-auto rounded-lg border border-[color:var(--color-border)]">
              <table className="w-full text-sm border-collapse" {...p} />
            </div>
          ),
          th: (p) => (
            <th className="text-left font-semibold px-3 py-2 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]" {...p} />
          ),
          td: (p) => (
            <td className="px-3 py-2 border-b border-[color:var(--color-border)] align-top" {...p} />
          ),
          pre: ({ children }) => <>{children}</>,
          code({ className, children, ...props }) {
            const isBlock = /language-/.test(className || "");
            if (isBlock) {
              return <CodeBlock className={className}>{children}</CodeBlock>;
            }
            return (
              <code
                className="rounded bg-[color:var(--color-surface-2)] px-1.5 py-0.5 font-mono text-[0.88em]"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
