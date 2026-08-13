"use client";

import { useMemo, useState } from "react";
import type { AttendanceDay, DayKind } from "@/lib/types";
import { dayKindLabel, shortDate } from "@/lib/format";

/**
 * Working-day grid — columns are weeks, rows are Monday→Friday.
 *
 * Kinds are a validated 3-hue set (presente / permesso / assenza) plus two
 * neutrals. Every non-present cell also carries a glyph and the legend is always
 * on, so identity never rests on hue alone. Each cell is its own hit target with
 * a tooltip; the summary line below carries the same totals without hovering.
 */

const kindStyle: Record<DayKind, { fill: string; glyph: string | null; border?: string }> = {
  presente: { fill: "var(--bord-400)", glyph: null },
  ferie: { fill: "var(--ivory-500)", glyph: "F" },
  permesso: { fill: "#B07C2A", glyph: "P" },
  assenza: { fill: "#B03030", glyph: "A" },
  festivo: { fill: "var(--ivory-200)", glyph: null, border: "var(--ivory-400)" },
};

const rowLabels = ["Lun", "Mar", "Mer", "Gio", "Ven"];

function mondayOf(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  const dow = d.getUTCDay();
  const delta = dow === 0 ? -6 : 1 - dow;
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

export function AttendanceGrid({ days }: { days: AttendanceDay[] }) {
  const [active, setActive] = useState<AttendanceDay | null>(null);

  const { weeks, totals } = useMemo(() => {
    const workdays = [...days]
      .reverse()
      .filter((d) => new Date(`${d.date}T00:00:00Z`).getUTCDay() % 6 !== 0);

    const byWeek = new Map<string, (AttendanceDay | null)[]>();
    for (const day of workdays) {
      const key = mondayOf(day.date);
      if (!byWeek.has(key)) byWeek.set(key, [null, null, null, null, null]);
      const row = new Date(`${day.date}T00:00:00Z`).getUTCDay() - 1;
      byWeek.get(key)![row] = day;
    }

    const counts: Record<string, number> = { presente: 0, ferie: 0, permesso: 0, assenza: 0 };
    for (const d of workdays) counts[d.kind] = (counts[d.kind] ?? 0) + 1;

    return {
      weeks: [...byWeek.entries()].map(([key, cells]) => ({ key, cells })),
      totals: counts,
    };
  }, [days]);

  return (
    <div className="px-6 pb-5 pt-4">
      <div className="relative overflow-x-auto pb-1">
        <div className="flex min-w-max gap-[3px]">
          <div className="mr-2 flex flex-col justify-between gap-[3px] pt-px">
            {rowLabels.map((r) => (
              <span key={r} className="h-[21px] text-[10px] leading-[21px] text-ink-400">
                {r}
              </span>
            ))}
          </div>

          {weeks.map((week) => (
            <div key={week.key} className="flex flex-col gap-[3px]">
              {week.cells.map((day, row) => {
                if (!day) {
                  return (
                    <div
                      key={row}
                      className="h-[21px] w-[21px] rounded-[4px] border border-dashed border-ivory-400"
                    />
                  );
                }
                const style = kindStyle[day.kind];
                return (
                  <button
                    key={row}
                    type="button"
                    aria-label={`${shortDate(day.date)} — ${dayKindLabel[day.kind]}`}
                    onMouseEnter={() => setActive(day)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(day)}
                    onBlur={() => setActive(null)}
                    className="grid h-[21px] w-[21px] place-items-center rounded-[4px] text-[10px] font-bold text-ivory-50 transition-transform hover:scale-110"
                    style={{
                      background: style.fill,
                      border: style.border ? `1px solid ${style.border}` : undefined,
                      color: day.kind === "ferie" ? "var(--ink-500)" : "var(--ivory-50)",
                    }}
                  >
                    {style.glyph}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ivory-300 pt-3">
        {(["presente", "ferie", "permesso", "assenza"] as DayKind[]).map((kind) => (
          <span key={kind} className="inline-flex items-center gap-1.5 text-xs text-ink-500">
            <span
              aria-hidden
              className="grid h-3 w-3 place-items-center rounded-[2px] text-[8px] font-bold"
              style={{
                background: kindStyle[kind].fill,
                color: kind === "ferie" ? "var(--ink-500)" : "var(--ivory-50)",
              }}
            >
              {kindStyle[kind].glyph}
            </span>
            {dayKindLabel[kind]}
            <span className="tnum font-medium text-ink-900">{totals[kind] ?? 0}</span>
          </span>
        ))}
      </div>

      <p className="mt-3 min-h-[1.25rem] text-xs text-ink-400" role="status">
        {active ? (
          <>
            <span className="font-medium text-ink-900">{shortDate(active.date)}</span>
            {" · "}
            {dayKindLabel[active.kind]}
            {active.kind === "presente" ? (
              <>
                {" · "}
                <span className="tnum">
                  {active.checkIn}–{active.checkOut}
                </span>
                {" · "}
                <span className="tnum">
                  {active.hours.toLocaleString("it-IT", { minimumFractionDigits: 1 })} h
                </span>
                {active.lateMinutes > 0 ? (
                  <span className="text-[#7d5719]"> · {active.lateMinutes} min di ritardo</span>
                ) : null}
              </>
            ) : null}
          </>
        ) : (
          "Passa sopra una giornata per vederne il dettaglio."
        )}
      </p>
    </div>
  );
}
