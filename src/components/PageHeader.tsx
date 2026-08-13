import type { ReactNode } from "react";

/**
 * Editorial page header: brass eyebrow, then a two-line display title whose
 * second line is set in bordeaux italic — the concept's masthead device.
 */
export function PageHeader({
  eyebrow,
  title,
  titleSecondLine,
  lede,
  action,
}: {
  eyebrow: string;
  title: string;
  titleSecondLine?: string;
  lede?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="font-display text-[2.125rem] leading-[1.15] text-ink-900">
          {title}
          {titleSecondLine ? (
            <>
              <br />
              <em className="text-bord-500">{titleSecondLine}</em>
            </>
          ) : null}
        </h1>
        {lede ? <p className="mt-3 text-sm leading-relaxed text-ink-500">{lede}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
