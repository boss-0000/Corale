"use client";

import { useState } from "react";
import Link from "next/link";

export interface BarItem {
  id: string;
  label: string;
  value: number;
  /** Displayed at the bar tip. Falls back to the raw value. */
  display?: string;
  /** Extra facts surfaced on hover/focus. */
  detail?: { label: string; value: string }[];
  href?: string;
}

/**
 * Horizontal bar list — single series, ranked.
 *
 * Bars are 10px (well under the 24px cap) so the band keeps its air; the
 * data-end is rounded and the baseline end is square; the value is
 * direct-labelled at the tip, so the hover detail only ever adds context.
 */
export function BarList({
  items,
  max,
  caption,
}: {
  items: BarItem[];
  /** Domain top. Defaults to the largest value. */
  max?: number;
  caption: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const domain = max ?? Math.max(...items.map((i) => i.value));

  return (
    <ul className="divide-y divide-ivory-300" aria-label={caption}>
      {items.map((item) => {
        const pct = Math.max(1.5, (item.value / domain) * 100);
        const isActive = active === item.id;

        const handlers = {
          className: "block px-6 py-3.5 transition-colors hover:bg-ivory-100",
          onMouseEnter: () => setActive(item.id),
          onMouseLeave: () => setActive(null),
          onFocus: () => setActive(item.id),
          onBlur: () => setActive(null),
        };

        const body = (
          <>
            <div className="flex items-baseline justify-between gap-4">
              <span className="truncate text-sm font-medium text-ink-900">{item.label}</span>
              <span className="tnum shrink-0 text-sm text-ink-700">
                {item.display ?? item.value.toLocaleString("it-IT")}
              </span>
            </div>

            {/* Square at the baseline, rounded at the data end */}
            <div className="mt-2 h-2.5 w-full rounded-sm bg-ivory-300">
              <div
                className="h-full rounded-l-sm rounded-r"
                style={{
                  width: `${pct}%`,
                  background: isActive ? "var(--bord-450)" : "var(--bord-400)",
                }}
              />
            </div>

            {item.detail && isActive ? (
              <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                {item.detail.map((d) => (
                  <div key={d.label} className="flex items-baseline gap-1.5">
                    <dt className="text-xs text-ink-400">{d.label}</dt>
                    <dd className="tnum text-xs font-medium text-ink-700">{d.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </>
        );

        return (
          <li key={item.id}>
            {item.href ? (
              <Link href={item.href} {...handlers}>
                {body}
              </Link>
            ) : (
              <div {...handlers}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
