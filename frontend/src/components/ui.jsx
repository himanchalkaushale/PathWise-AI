import { forwardRef } from "react";

/* ---------- Button ---------- */
const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap select-none";
const btnSizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4",
  lg: "h-12 px-6 text-[15px]",
  icon: "h-10 w-10",
};
const btnVariants = {
  primary:
    "bg-[color:var(--color-accent)] text-white hover:bg-[color:var(--color-accent-hover)] shadow-[var(--shadow-sm)]",
  accent:
    "bg-[color:var(--color-accent)] text-white hover:bg-[color:var(--color-accent-hover)] shadow-[var(--shadow-sm)]",
  secondary:
    "bg-[color:var(--color-foreground)] text-white hover:bg-[color:var(--color-foreground)]/90",
  outline:
    "border border-[color:var(--color-border-strong)] bg-white text-[color:var(--color-foreground)] hover:border-[color:var(--color-foreground)] hover:bg-[color:var(--color-surface-2)]",
  ghost:
    "bg-transparent text-[color:var(--color-foreground)] hover:bg-[color:var(--color-surface-2)]",
  danger:
    "bg-[color:var(--color-danger)] text-white hover:opacity-90",
  link: "text-[color:var(--color-accent)] hover:underline underline-offset-4 px-0",
};

export const Button = forwardRef(function Button(
  { variant = "primary", size = "md", className = "", asChild, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`${btnBase} ${btnSizes[size]} ${btnVariants[variant]} ${className}`}
      {...props}
    />
  );
});

/* ---------- Inputs ---------- */
export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-[color:var(--color-border)] bg-white px-4 h-11 text-sm text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted-foreground)] transition focus:border-[color:var(--color-accent)] ${className}`}
      {...props}
    />
  );
}

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full rounded-lg border border-[color:var(--color-border)] bg-white px-4 py-3 text-sm text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted-foreground)] transition focus:border-[color:var(--color-accent)] ${className}`}
      {...props}
    />
  );
}

export function Label({ className = "", ...props }) {
  return (
    <label
      className={`text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted-foreground)] ${className}`}
      {...props}
    />
  );
}

/* ---------- Card ---------- */
export function Card({ className = "", ...props }) {
  return (
    <div
      className={`rounded-2xl border border-[color:var(--color-border)] bg-white shadow-[var(--shadow-sm)] ${className}`}
      {...props}
    />
  );
}

/* ---------- Badge / Tag ---------- */
const badgeStyles = {
  neutral: "bg-[color:var(--color-surface-2)] text-[color:var(--color-foreground)]",
  accent: "bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent-hover)]",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  outline: "border border-[color:var(--color-border-strong)] bg-white text-[color:var(--color-foreground)]",
};
export function Badge({ variant = "neutral", className = "", children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${badgeStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
export function Tag({ children }) {
  return <Badge variant="outline">{children}</Badge>;
}

/* ---------- Progress ---------- */
export function ProgressBar({ value = 0, className = "", tone = "accent" }) {
  const bg = tone === "accent" ? "bg-[color:var(--color-accent)]" : "bg-[color:var(--color-foreground)]";
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-2)] ${className}`}>
      <div
        className={`h-full rounded-full ${bg} transition-all duration-500 ease-out`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function ProgressRing({ value = 0, size = 72, stroke = 6 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (Math.max(0, Math.min(100, value)) / 100) * c;
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--color-surface-2)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="var(--color-accent)"
          strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={off}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="absolute font-mono text-sm font-semibold text-[color:var(--color-foreground)]">
        {Math.round(value)}%
      </span>
    </div>
  );
}

/* ---------- Sparkline ---------- */
export function Sparkline({ points = [], width = 96, height = 28, className = "" }) {
  if (!points.length) return <div className={className} style={{ width, height }} />;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const step = width / Math.max(1, points.length - 1);
  const d = points
    .map((p, i) => {
      const x = i * step;
      const y = height - ((p - min) / range) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} className={className} aria-hidden>
      <path d={d} fill="none" stroke="var(--color-accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- Stat card ---------- */
export function StatCard({ label, value, delta, sparkline, icon: Icon }) {
  const positive = typeof delta === "number" && delta >= 0;
  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted-foreground)]">
          {label}
        </span>
        {Icon && (
          <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-[color:var(--color-surface-2)] text-[color:var(--color-foreground)]">
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-3">
        <div className="font-serif text-4xl leading-none">{value}</div>
        {sparkline && <Sparkline points={sparkline} />}
      </div>
      {typeof delta === "number" && (
        <div className={`text-xs font-medium ${positive ? "text-emerald-700" : "text-[color:var(--color-danger)]"}`}>
          {positive ? "▲" : "▼"} {Math.abs(delta)}% <span className="text-[color:var(--color-muted-foreground)]">this week</span>
        </div>
      )}
    </Card>
  );
}

/* ---------- Spinner ---------- */
export function Spinner({ className = "" }) {
  return (
    <span
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  );
}

/* ---------- Segmented control ---------- */
export function Segmented({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-lg border border-[color:var(--color-border)] bg-white p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`px-3 h-8 text-xs font-medium rounded-md transition ${
              active
                ? "bg-[color:var(--color-foreground)] text-white shadow-[var(--shadow-sm)]"
                : "text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)]"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
