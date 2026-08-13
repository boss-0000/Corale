"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/ui/primitives";
import type { CurrentUser } from "@/lib/types";
import { initials } from "@/lib/format";

interface NavItem {
  href: string;
  label: string;
  /** Right-aligned figure, as in the concept's rail. */
  count?: string;
  /** Modules belonging to a later phase are shown but not linked. */
  phase?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const buildGroups = (personCount: number): NavGroup[] => [
  {
    title: "Panoramica",
    items: [
      { href: "/dashboard", label: "Dashboard", count: "01" },
      { href: "/employees", label: "Persone", count: String(personCount) },
    ],
  },
  {
    title: "Operazioni",
    items: [
      { href: "/attendance", label: "Presenze", phase: "Fase 2" },
      { href: "/performance", label: "Prestazioni", phase: "Fase 3" },
      { href: "/payroll", label: "Buste paga", phase: "Fase 4" },
    ],
  },
  {
    title: "Analisi",
    items: [
      { href: "/reports", label: "Report", phase: "Fase 5" },
      { href: "/insights", label: "Insight IA", phase: "Fase 5" },
    ],
  },
];

export function AppShell({
  user,
  personCount,
  children,
}: {
  user: CurrentUser;
  personCount: number;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const groups = buildGroups(personCount);

  const rail = (
    <div className="flex h-full flex-col bg-espresso-900">
      <div className="px-7 pb-8 pt-7">
        <Link href="/dashboard" className="inline-block">
          <Wordmark tone="ivory" subtitle="HR Suite" />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-4" aria-label="Navigazione principale">
        {groups.map((group) => (
          <div key={group.title} className="mb-7">
            <p className="mb-2 px-3 text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-brass-400">
              {group.title}
            </p>
            <ul>
              {group.items.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                if (item.phase) {
                  return (
                    <li key={item.href}>
                      <span
                        title="Modulo previsto in una fase successiva"
                        className="flex cursor-default items-center justify-between gap-3 rounded px-3 py-[0.4rem] text-[0.9375rem] text-espresso-ink/35"
                      >
                        {item.label}
                        <span className="rounded border border-espresso-700 px-1.5 py-px text-[9px] font-medium tracking-wide">
                          {item.phase}
                        </span>
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex items-center justify-between gap-3 rounded px-3 py-[0.4rem] text-[0.9375rem] transition-colors ${
                        active
                          ? "bg-espresso-800 text-espresso-ink"
                          : "text-espresso-ink/70 hover:bg-espresso-800/60 hover:text-espresso-ink"
                      }`}
                    >
                      {active ? (
                        <span
                          aria-hidden
                          className="absolute inset-y-1 -left-1 w-[2px] rounded-full bg-brass-400"
                        />
                      ) : null}
                      {item.label}
                      {item.count ? (
                        <span className="font-display text-xs italic text-espresso-ink-dim">
                          {item.count}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-espresso-700 px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brass-500 font-display text-xs font-semibold text-espresso-900"
          >
            {initials(user.name.split(" ")[0], user.name.split(" ")[1])}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-espresso-ink">{user.name}</p>
            <p className="truncate text-xs text-espresso-ink-dim">{user.position}</p>
          </div>
          <Link
            href="/login"
            aria-label="Esci"
            className="rounded p-1.5 text-espresso-ink-dim transition-colors hover:bg-espresso-800 hover:text-espresso-ink"
          >
            <svg aria-hidden width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 14v2.5H4V3.5h8V6M8.5 10h8.5M14.5 7.5 17 10l-2.5 2.5" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* The espresso paints the whole column, not just the sticky viewport
          slice — otherwise the rail stops dead at the fold on a long page. */}
      <aside className="hidden w-[236px] shrink-0 bg-espresso-900 lg:block">
        <div className="sticky top-0 h-screen">{rail}</div>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Chiudi la navigazione"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-espresso-900/50"
          />
          <aside className="absolute inset-y-0 left-0 w-[260px]">{rail}</aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-ivory-400 px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Apri la navigazione"
            className="rounded p-1.5 text-ink-500 hover:bg-ivory-300"
          >
            <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M3.5 6h13M3.5 10h13M3.5 14h13" />
            </svg>
          </button>
          <Wordmark />
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
