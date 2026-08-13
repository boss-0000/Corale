import { Sparkline } from "@/components/charts/Sparkline";
import { signed } from "@/lib/format";

/**
 * Stat tile: brass eyebrow · value · delta · optional sparkline.
 *
 * The value stays in the UI sans even though the brand face is a serif — a
 * serif figure on a metric reads as decoration. The unit rides small and
 * baseline-aligned beside it, as in the concept. Proportional figures here;
 * `tabular-nums` is reserved for columns that must align.
 */
export function StatTile({
  label,
  value,
  unit,
  delta,
  deltaUnit = "",
  deltaPeriod,
  upIsGood = true,
  trend,
}: {
  label: string;
  value: string;
  /** Small suffix beside the figure: "%", "K", "/5". */
  unit?: string;
  delta?: number;
  deltaUnit?: string;
  deltaPeriod: string;
  upIsGood?: boolean;
  trend?: number[];
}) {
  const good = delta === undefined || delta === 0 ? null : delta > 0 === upIsGood;
  const deltaInk =
    good === null ? "text-ink-400" : good ? "text-[#1f6b3f]" : "text-[#8c2626]";
  const arrow = delta === undefined || delta === 0 ? "" : delta > 0 ? "↑ " : "↓ ";

  return (
    <div className="flex flex-col justify-between border-r border-ivory-400 px-6 py-5 last:border-r-0">
      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-brass-600">
        {label}
      </p>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="flex items-baseline gap-0.5 leading-none text-ink-900">
            <span className="text-[2rem] font-semibold">{value}</span>
            {unit ? (
              <span className="text-base font-medium text-ink-400">{unit}</span>
            ) : null}
          </p>
          {delta !== undefined ? (
            <p className="mt-2.5 text-xs">
              <span className={`font-medium ${deltaInk}`}>
                {arrow}
                {signed(delta, deltaUnit).replace(/^[+−]/, "")}
              </span>{" "}
              <span className="text-ink-400">{deltaPeriod}</span>
            </p>
          ) : null}
        </div>

        {trend ? (
          <Sparkline points={trend} label={`Andamento di ${label.toLowerCase()}`} />
        ) : null}
      </div>
    </div>
  );
}
