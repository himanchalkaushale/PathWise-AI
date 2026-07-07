import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default function MarkdownArticle({ children, className = "" }) {
  return (
    <div
      className={`article-prose max-w-none text-[15.5px] leading-[1.75] text-[color:var(--color-foreground)]/90 ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: (p) => <h1 className="font-serif text-3xl mt-8 mb-3" {...p} />,
          h2: (p) => (
            <h2
              className="font-serif text-2xl mt-8 mb-3 pb-1 border-b border-[color:var(--color-border)]"
              {...p}
            />
          ),
          h3: (p) => <h3 className="font-serif text-xl mt-6 mb-2" {...p} />,
          h4: (p) => <h4 className="font-semibold text-base mt-5 mb-2" {...p} />,
          p: (p) => <p className="my-4" {...p} />,
          ul: (p) => <ul className="my-4 list-disc pl-6 space-y-1.5" {...p} />,
          ol: (p) => <ol className="my-4 list-decimal pl-6 space-y-1.5" {...p} />,
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
              className="my-5 border-l-4 border-[color:var(--color-accent)] bg-[color:var(--color-accent-soft)]/40 px-4 py-2 italic text-[color:var(--color-foreground)]/85"
              {...p}
            />
          ),
          hr: () => <hr className="my-8 border-[color:var(--color-border)]" />,
          table: (p) => (
            <div className="my-5 overflow-x-auto rounded-lg border border-[color:var(--color-border)]">
              <table className="w-full text-sm border-collapse" {...p} />
            </div>
          ),
          thead: (p) => <thead className="bg-[color:var(--color-surface-2)]" {...p} />,
          th: (p) => (
            <th className="text-left font-semibold px-3 py-2 border-b border-[color:var(--color-border)]" {...p} />
          ),
          td: (p) => (
            <td className="px-3 py-2 border-b border-[color:var(--color-border)] align-top" {...p} />
          ),
          code({ className, children, ...props }) {
            // react-markdown v10: no `inline` prop. Language-tagged code blocks
            // arrive with a `language-*` className; everything else is inline.
            const isBlock = /language-/.test(className || "");
            if (!isBlock) {
              return (
                <code
                  className="rounded bg-[color:var(--color-surface-2)] px-1.5 py-0.5 font-mono text-[0.88em] text-[color:var(--color-foreground)]"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={`font-mono text-[13px] ${className || ""}`} {...props}>
                {children}
              </code>
            );
          },

          pre: (p) => (
            <pre
              className="my-5 overflow-x-auto rounded-xl bg-[#0f172a] p-4 text-[13px] leading-relaxed text-slate-100"
              {...p}
            />
          ),
          strong: (p) => <strong className="font-semibold" {...p} />,
          em: (p) => <em className="italic" {...p} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
