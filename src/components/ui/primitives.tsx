import type { ReactNode } from "react";
import type { EmployeeStatus, Severity } from "@/lib/types";
import { initials as toInitials, statusLabel } from "@/lib/format";

/* -------------------------------------------------------------------------- */
/* Card                                                                        */
/* -------------------------------------------------------------------------- */

export function Card({
  children,
  className = "",
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article";
}) {
  return (
    <Tag
      className={`rounded-lg border border-ivory-400 bg-ivory-50 shadow-[0_1px_2px_rgba(36,28,26,0.04)] ${className}`}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({
  eyebrow,
  title,
  hint,
  action,
}: {
  eyebrow?: string;
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-ivory-300 px-6 py-5">
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow mb-1.5">{eyebrow}</p> : null}
        <h2 className="font-display text-lg text-ink-900">{title}</h2>
        {hint ? <p className="mt-1 text-sm text-ink-400">{hint}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Status — colour is never the only channel: every badge carries icon + label */
/* -------------------------------------------------------------------------- */

const statusStyles: Record<EmployeeStatus, { tint: string; ink: string; dot: string }> = {
  attivo: { tint: "bg-good-tint", ink: "text-[#245f3c]", dot: "bg-good" },
  ferie: { tint: "bg-ivory-300", ink: "text-ink-500", dot: "bg-ink-400" },
  permesso: { tint: "bg-warn-tint", ink: "text-[#7d5719]", dot: "bg-warn" },
  assente: { tint: "bg-crit-tint", ink: "text-[#7d2222]", dot: "bg-crit" },
};

export function StatusBadge({ status }: { status: EmployeeStatus }) {
  const s = statusStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.tint} ${s.ink}`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {statusLabel[status]}
    </span>
  );
}

const severityStyles: Record<Severity, { rule: string; ink: string; label: string }> = {
  good: { rule: "bg-good", ink: "text-[#245f3c]", label: "Positivo" },
  warn: { rule: "bg-warn", ink: "text-[#7d5719]", label: "Da osservare" },
  crit: { rule: "bg-crit", ink: "text-[#7d2222]", label: "Richiede attenzione" },
};

export function SeverityTag({ severity }: { severity: Severity }) {
  const s = severityStyles[severity];
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-medium ${s.ink}`}>
      <SeverityIcon severity={severity} />
      {s.label}
    </span>
  );
}

export function SeverityIcon({ severity }: { severity: Severity }) {
  const common = { width: 13, height: 13, viewBox: "0 0 16 16", "aria-hidden": true } as const;
  if (severity === "good") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="8" cy="8" r="6.4" />
        <path d="M5.4 8.2 7.2 10l3.4-3.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (severity === "warn") {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="8" cy="8" r="6.4" />
        <path d="M8 4.8v4" strokeLinecap="round" />
        <circle cx="8" cy="11" r=".9" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M8 2.2 14.6 13.4H1.4L8 2.2Z" strokeLinejoin="round" />
      <path d="M8 6.6v3.1" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r=".9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Avatar                                                                      */
/* -------------------------------------------------------------------------- */

const avatarSizes = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-xs",
  lg: "h-16 w-16 text-lg",
} as const;

export function Avatar({
  firstName,
  lastName,
  size = "md",
}: {
  firstName: string;
  lastName: string;
  size?: keyof typeof avatarSizes;
}) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-bord-200 bg-bord-100 font-display font-semibold text-bord-600 ${avatarSizes[size]}`}
    >
      {toInitials(firstName, lastName)}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Wordmark                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The wordmark: "Cor·a·le" with the middle "a" set in brass italic.
 *
 * The letter that carries the accent is the one the name turns on — it is the
 * mark's only ornament, and it repeats as the brass thread across the product.
 */
export function Wordmark({
  tone = "ink",
  size = "md",
  subtitle,
}: {
  tone?: "ink" | "ivory";
  size?: "md" | "lg" | "xl";
  subtitle?: string;
}) {
  const color = tone === "ivory" ? "text-espresso-ink" : "text-ink-900";
  const accent = tone === "ivory" ? "text-brass-400" : "text-brass-500";
  const sub = tone === "ivory" ? "text-espresso-ink-dim" : "text-ink-400";
  const scale = {
    md: "text-[1.4rem]",
    lg: "text-[2rem]",
    xl: "text-[clamp(3.5rem,7vw,5.5rem)]",
  }[size];

  return (
    <span className={`inline-block ${color}`}>
      <span className={`block font-display font-normal leading-none tracking-tight ${scale}`}>
        Cor<em className={accent}>a</em>le
      </span>
      {subtitle ? (
        <span
          className={`mt-1.5 block text-[0.5625rem] font-semibold uppercase tracking-[0.34em] ${sub}`}
        >
          {subtitle}
        </span>
      ) : null}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Meter — a labelled progress bar, used for goal attainment                   */
/* -------------------------------------------------------------------------- */

export function Meter({
  value,
  max = 100,
  tone = "accent",
  label,
}: {
  value: number;
  max?: number;
  tone?: "accent" | "good" | "warn" | "crit";
  label: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill = {
    accent: "bg-bord-500",
    good: "bg-good",
    warn: "bg-warn",
    crit: "bg-crit",
  }[tone];
  const track = {
    accent: "bg-bord-100",
    good: "bg-good-tint",
    warn: "bg-warn-tint",
    crit: "bg-crit-tint",
  }[tone];

  return (
    <div
      role="meter"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={`h-1.5 w-full overflow-hidden rounded-full ${track}`}
    >
      <div className={`h-full rounded-full ${fill}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
