/**
 * 12-point sparkline for stat tiles and table rows.
 *
 * De-emphasis hue for the history, accent for the current period, per the
 * stat-tile contract. No axes, no labels — the tile's value carries the number.
 */
export function Sparkline({
  points,
  width = 92,
  height = 28,
  label,
}: {
  points: number[];
  width?: number;
  height?: number;
  label: string;
}) {
  if (points.length < 2) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const pad = 4;

  const x = (i: number) => (i / (points.length - 1)) * (width - pad * 2) + pad;
  const y = (v: number) => height - pad - ((v - min) / span) * (height - pad * 2);

  const d = points.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)} ${y(v).toFixed(2)}`).join(" ");
  const lastX = x(points.length - 1);
  const lastY = y(points[points.length - 1]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      className="overflow-visible"
    >
      <path
        d={d}
        fill="none"
        stroke="var(--bord-250)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Surface ring keeps the end marker legible where it crosses the line. */}
      <circle cx={lastX} cy={lastY} r={4.5} fill="var(--ivory-50)" />
      <circle cx={lastX} cy={lastY} r={3} fill="var(--bord-500)" />
    </svg>
  );
}
