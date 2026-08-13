"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Department, Employee, EmployeeStatus } from "@/lib/types";
import { Avatar, StatusBadge } from "@/components/ui/primitives";
import { Sparkline } from "@/components/charts/Sparkline";
import { contractLabel, percent, statusLabel } from "@/lib/format";

type SortKey = "name" | "attendance" | "performance";

const statuses: EmployeeStatus[] = ["attivo", "ferie", "permesso", "assente"];

export function EmployeeTable({
  employees,
  departments,
}: {
  employees: Employee[];
  departments: Department[];
}) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<SortKey>("name");
  const [asc, setAsc] = useState(true);

  const deptName = useMemo(
    () => Object.fromEntries(departments.map((d) => [d.id, d.name])),
    [departments],
  );

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = employees.filter((e) => {
      if (department && e.departmentId !== department) return false;
      if (status && e.status !== status) return false;
      if (term) {
        const hay = `${e.firstName} ${e.lastName} ${e.position} ${e.email}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });

    const dir = asc ? 1 : -1;
    return filtered.sort((a, b) => {
      if (sort === "attendance") return (a.attendanceRate - b.attendanceRate) * dir;
      if (sort === "performance") return (a.performanceScore - b.performanceScore) * dir;
      return `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`, "it") * dir;
    });
  }, [employees, search, department, status, sort, asc]);

  const toggleSort = (key: SortKey) => {
    if (sort === key) setAsc((v) => !v);
    else {
      setSort(key);
      setAsc(key === "name");
    }
  };

  const selectClass =
    "rounded-md border border-ivory-400 bg-ivory-50 px-3 py-2 text-sm text-ink-700 transition-colors focus:border-bord-400 focus:outline-none focus:ring-2 focus:ring-bord-200";

  return (
    <div>
      {/* Filters — one row, above the content they scope */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <svg
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-300"
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          >
            <circle cx="9" cy="9" r="5.5" />
            <path d="m13.2 13.2 3.3 3.3" />
          </svg>
          <label htmlFor="emp-search" className="sr-only">
            Cerca fra i dipendenti
          </label>
          <input
            id="emp-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca per nome, ruolo o email…"
            className="w-full rounded-md border border-ivory-400 bg-ivory-50 py-2 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-300 transition-colors focus:border-bord-400 focus:outline-none focus:ring-2 focus:ring-bord-200"
          />
        </div>

        <label htmlFor="emp-dept" className="sr-only">
          Filtra per reparto
        </label>
        <select
          id="emp-dept"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className={selectClass}
        >
          <option value="">Tutti i reparti</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <label htmlFor="emp-status" className="sr-only">
          Filtra per stato
        </label>
        <select
          id="emp-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={selectClass}
        >
          <option value="">Tutti gli stati</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {statusLabel[s]}
            </option>
          ))}
        </select>

        {search || department || status ? (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setDepartment("");
              setStatus("");
            }}
            className="text-sm text-ink-400 underline decoration-ivory-500 underline-offset-4 transition-colors hover:text-bord-500"
          >
            Azzera
          </button>
        ) : null}
      </div>

      <p className="mt-3 text-xs text-ink-400" role="status">
        {rows.length} {rows.length === 1 ? "persona" : "persone"} su {employees.length}
      </p>

      <div className="mt-4 overflow-x-auto rounded-lg border border-ivory-400 bg-ivory-50">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <caption className="sr-only">
            Elenco dei dipendenti con reparto, contratto, presenza e performance
          </caption>
          <thead>
            <tr className="border-b border-ivory-400">
              <Th onClick={() => toggleSort("name")} active={sort === "name"} asc={asc}>
                Persona
              </Th>
              <Th>Reparto</Th>
              <Th>Contratto</Th>
              <Th
                align="right"
                onClick={() => toggleSort("attendance")}
                active={sort === "attendance"}
                asc={asc}
              >
                Presenza
              </Th>
              <Th
                align="right"
                onClick={() => toggleSort("performance")}
                active={sort === "performance"}
                asc={asc}
              >
                Performance
              </Th>
              <Th>Stato</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr
                key={e.id}
                className="border-b border-ivory-300 transition-colors last:border-0 hover:bg-ivory-100"
              >
                <td className="px-5 py-3.5">
                  <Link href={`/employees/${e.id}`} className="flex items-center gap-3">
                    <Avatar firstName={e.firstName} lastName={e.lastName} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink-900">
                        {e.firstName} {e.lastName}
                      </span>
                      <span className="block truncate text-xs text-ink-400">{e.position}</span>
                    </span>
                  </Link>
                </td>
                <td className="px-5 py-3.5 text-sm text-ink-700">{deptName[e.departmentId]}</td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-ink-700">{contractLabel[e.contract.type]}</span>
                  <span className="block text-xs text-ink-400">
                    {e.contract.weeklyHours} h/sett · {e.contract.level}
                  </span>
                </td>
                <td className="tnum px-5 py-3.5 text-right text-sm">
                  <span className={e.attendanceRate < 90 ? "text-[#8c2626]" : "text-ink-900"}>
                    {percent(e.attendanceRate)}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-3">
                    <Sparkline
                      points={e.performanceTrend}
                      width={64}
                      height={22}
                      label={`Andamento di ${e.firstName} ${e.lastName}`}
                    />
                    <span
                      className={`tnum w-7 text-right text-sm font-medium ${
                        e.performanceScore < 75 ? "text-[#8c2626]" : "text-ink-900"
                      }`}
                    >
                      {e.performanceScore}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={e.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-400">
            Nessun risultato per i filtri selezionati.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Th({
  children,
  onClick,
  active,
  asc,
  align = "left",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  asc?: boolean;
  align?: "left" | "right";
}) {
  const base = `px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-ink-400 ${
    align === "right" ? "text-right" : ""
  }`;

  if (!onClick) {
    return (
      <th scope="col" className={base}>
        {children}
      </th>
    );
  }

  return (
    <th scope="col" className={base} aria-sort={active ? (asc ? "ascending" : "descending") : "none"}>
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1 uppercase tracking-[0.08em] transition-colors hover:text-ink-900 ${
          active ? "text-ink-900" : ""
        }`}
      >
        {children}
        <svg
          aria-hidden
          width="9"
          height="9"
          viewBox="0 0 10 10"
          className={`transition-opacity ${active ? "opacity-100" : "opacity-30"}`}
        >
          <path
            d={active && !asc ? "M2 3.5 5 6.5 8 3.5" : "M2 6.5 5 3.5 8 6.5"}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </th>
  );
}
