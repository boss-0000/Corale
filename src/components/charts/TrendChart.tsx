"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

export interface TrendPoint {
  label: string;
  value: number;
}

/**
 * Single-series area + line with a snapping crosshair.
 *
 * Single series, so no legend — the card title names what is plotted. The value
 * is direct-labelled at the endpoint and every point is reachable through the
 * table view, so the tooltip enhances but never gates.
 */
export function TrendChart({
  points,
  unit = "%",
  caption,
}: {
  points: TrendPoint[];
  unit?: string;
  caption: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [active, setActive] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const gradientId = useId();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(Math.max(320, Math.round(entry.contentRect.width)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const height = 232;
  const pad = { top: 18, right: 52, bottom: 30, left: 44 };

  const values = points.map((p) => p.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  // Round the domain out to clean ticks so the axis carries the unlabelled values.
  const min = Math.floor((rawMin - 1) / 2) * 2;
  const max = Math.ceil((rawMax + 1) / 2) * 2;
  const span = max - min || 1;

  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const x = (i: number) => pad.left + (i / (points.length - 1)) * plotW;
  const y = (v: number) => pad.top + plotH - ((v - min) / span) * plotH;

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)} ${y(p.value).toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L${x(points.length - 1).toFixed(2)} ${(pad.top + plotH).toFixed(2)} L${pad.left} ${(pad.top + plotH).toFixed(2)} Z`;

  const ticks = [min, min + span / 2, max];

  const nearestIndex = useCallback(
    (clientX: number) => {
      const el = wrapRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const local = clientX - rect.left - pad.left;
      const step = plotW / (points.length - 1);
      return Math.max(0, Math.min(points.length - 1, Math.round(local / step)));
    },
    [plotW, points.length, pad.left],
  );

  const lastIdx = points.length - 1;
  const activePoint = active === null ? null : points[active];

  return (
    <div className="px-6 pb-5 pt-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-sm text-ink-400">{caption}</p>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="rounded border border-ivory-400 px-2.5 py-1 text-xs font-medium text-ink-500 transition-colors hover:border-ivory-500 hover:text-ink-900"
          aria-expanded={showTable}
        >
          {showTable ? "Nascondi tabella" : "Vedi tabella"}
        </button>
      </div>

      <div ref={wrapRef} className="relative w-full">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={caption}
          tabIndex={0}
          className="block w-full touch-none"
          onPointerMove={(e) => setActive(nearestIndex(e.clientX))}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive(lastIdx)}
          onBlur={() => setActive(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
              e.preventDefault();
              setActive((prev) => {
                const base = prev ?? lastIdx;
                return Math.max(0, Math.min(lastIdx, base + (e.key === "ArrowLeft" ? -1 : 1)));
              });
            }
            if (e.key === "Escape") setActive(null);
          }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--bord-500)" stopOpacity={0.14} />
              <stop offset="100%" stopColor="var(--bord-500)" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          {/* Gridlines — hairline, solid, recessive */}
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--grid)"
                strokeWidth={1}
              />
              <text
                x={pad.left - 10}
                y={y(t)}
                textAnchor="end"
                dominantBaseline="middle"
                className="tnum fill-ink-400 text-[11px]"
              >
                {t}
              </text>
            </g>
          ))}

          <path d={areaPath} fill={`url(#${gradientId})`} />
          <path
            d={linePath}
            fill="none"
            stroke="var(--bord-500)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X labels — every other week, so they never collide */}
          {points.map((p, i) =>
            i % 2 === 0 || i === lastIdx ? (
              <text
                key={p.label}
                x={x(i)}
                y={height - 10}
                textAnchor="middle"
                className="fill-ink-400 text-[11px]"
              >
                {p.label}
              </text>
            ) : null,
          )}

          {/* Crosshair — the reader aims at a week, not at a 2px line */}
          {active !== null ? (
            <line
              x1={x(active)}
              x2={x(active)}
              y1={pad.top}
              y2={pad.top + plotH}
              stroke="var(--ivory-500)"
              strokeWidth={1}
            />
          ) : null}

          {/* Endpoint marker + direct label */}
          <circle cx={x(lastIdx)} cy={y(points[lastIdx].value)} r={6} fill="var(--ivory-50)" />
          <circle cx={x(lastIdx)} cy={y(points[lastIdx].value)} r={4} fill="var(--bord-500)" />
          <text
            x={x(lastIdx) + 12}
            y={y(points[lastIdx].value)}
            dominantBaseline="middle"
            className="tnum fill-ink-900 text-[12px] font-semibold"
          >
            {points[lastIdx].value.toLocaleString("it-IT")}
            {unit}
          </text>

          {active !== null && active !== lastIdx ? (
            <>
              <circle cx={x(active)} cy={y(points[active].value)} r={6} fill="var(--ivory-50)" />
              <circle cx={x(active)} cy={y(points[active].value)} r={4} fill="var(--bord-500)" />
            </>
          ) : null}
        </svg>

        {activePoint ? (
          <div
            role="status"
            className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-md border border-ivory-400 bg-ivory-50 px-3 py-2 shadow-[0_4px_14px_rgba(36,28,26,0.10)]"
            style={{
              left: Math.min(Math.max(x(active!), 60), width - 60),
              top: Math.max(y(activePoint.value) - 62, 0),
            }}
          >
            <p className="tnum text-sm font-semibold text-ink-900">
              {activePoint.value.toLocaleString("it-IT")}
              {unit}
            </p>
            <p className="mt-0.5 text-xs text-ink-400">Settimana {activePoint.label.slice(1)}</p>
          </div>
        ) : null}
      </div>

      {showTable ? (
        <div className="mt-4 max-h-56 overflow-auto rounded border border-ivory-300">
          <table className="w-full text-sm">
            <caption className="sr-only">{caption}</caption>
            <thead className="sticky top-0 bg-ivory-100 text-left">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium text-ink-500">
                  Settimana
                </th>
                <th scope="col" className="px-3 py-2 text-right font-medium text-ink-500">
                  Valore
                </th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.label} className="border-t border-ivory-300">
                  <td className="px-3 py-1.5 text-ink-700">{p.label}</td>
                  <td className="tnum px-3 py-1.5 text-right text-ink-900">
                    {p.value.toLocaleString("it-IT")}
                    {unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
