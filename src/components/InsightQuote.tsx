import Link from "next/link";
import type { Insight } from "@/lib/types";
import { SeverityTag } from "@/components/ui/primitives";
import { dateTime } from "@/lib/format";

/**
 * The product's signature element.
 *
 * An observation from the analysis layer, set as an editorial pull-quote rather
 * than a chat bubble. Every claim ships with the figures it was derived from —
 * open "Su quali dati" and the reader sees exactly what the model was given.
 * That is the difference between an assistant and a system of record.
 *
 * `hero` is the full-bleed espresso panel that leads the dashboard; `inline` is
 * the light, ruled variant used where several observations sit side by side.
 */
export function InsightQuote({
  insight,
  variant = "inline",
}: {
  insight: Insight;
  variant?: "hero" | "inline";
}) {
  if (variant === "hero") return <HeroInsight insight={insight} />;
  return <InlineInsight insight={insight} />;
}

function HeroInsight({ insight }: { insight: Insight }) {
  return (
    <article className="relative overflow-hidden rounded-lg bg-espresso-900 px-8 py-8 sm:px-10 sm:py-9">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brass-400" />
        <span className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-brass-400">
          Insight generato dall’IA
        </span>
        <span aria-hidden className="text-espresso-700">·</span>
        <span className="text-[0.625rem] uppercase tracking-[0.18em] text-espresso-ink-dim">
          {dateTime(insight.generatedAt)}
        </span>
      </div>

      <blockquote className="mt-6 flex gap-4">
        <span
          aria-hidden
          className="font-display text-[3.25rem] leading-[0.7] text-brass-400"
        >
          “
        </span>
        <p className="max-w-3xl font-display text-[1.375rem] italic leading-[1.5] text-espresso-ink sm:text-[1.5rem]">
          {insight.quote}
        </p>
      </blockquote>

      <p className="mt-5 max-w-3xl pl-9 text-sm leading-relaxed text-espresso-ink-dim">
        {insight.recommendation}
      </p>

      <div className="mt-7 border-t border-espresso-700 pt-5">
        <dl className="flex flex-wrap gap-x-8 gap-y-2">
          {insight.evidence.map((e) => (
            <div key={e.label} className="flex items-baseline gap-2">
              <dt className="text-xs text-espresso-ink-dim">{e.label}</dt>
              <dd className="tnum text-xs font-medium text-espresso-ink">{e.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs italic text-espresso-ink-dim">
          Osservazione su {insight.subject.name} — ogni cifra è interrogata dal
          database al momento della generazione, mai dedotta.
        </p>
      </div>
    </article>
  );
}

function InlineInsight({ insight }: { insight: Insight }) {
  const rule = {
    good: "bg-good",
    warn: "bg-warn",
    crit: "bg-crit",
  }[insight.severity];

  return (
    <article className="relative pl-5">
      <span
        aria-hidden
        className={`absolute left-0 top-1 h-[calc(100%-0.5rem)] w-[3px] rounded-full ${rule}`}
      />

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <SeverityTag severity={insight.severity} />
        <span aria-hidden className="text-ivory-500">·</span>
        {insight.subject.kind === "employee" ? (
          <Link
            href={`/employees/${insight.subject.id}`}
            className="text-xs font-medium text-ink-500 underline decoration-ivory-500 underline-offset-2 hover:text-bord-500"
          >
            {insight.subject.name}
          </Link>
        ) : (
          <span className="text-xs font-medium text-ink-500">{insight.subject.name}</span>
        )}
      </div>

      <blockquote className="mt-2.5">
        <p className="font-display text-[1.0625rem] italic leading-[1.55] text-ink-900">
          {insight.quote}
        </p>
      </blockquote>

      <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{insight.recommendation}</p>

      <details className="group mt-3">
        <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-xs font-medium text-ink-400 transition-colors hover:text-brass-600">
          <svg
            aria-hidden
            width="10"
            height="10"
            viewBox="0 0 10 10"
            className="transition-transform group-open:rotate-90"
          >
            <path
              d="M3 1.5 7 5 3 8.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Su quali dati
        </summary>
        <dl className="mt-2.5 space-y-1.5 border-l border-ivory-400 pl-3.5">
          {insight.evidence.map((e) => (
            <div key={e.label} className="flex flex-wrap items-baseline gap-x-2">
              <dt className="text-xs text-ink-400">{e.label}</dt>
              <dd className="tnum text-xs font-medium text-ink-900">{e.value}</dd>
            </div>
          ))}
        </dl>
      </details>

      <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-ink-300">
        Corale · Analisi automatica · {dateTime(insight.generatedAt)}
      </p>
    </article>
  );
}
