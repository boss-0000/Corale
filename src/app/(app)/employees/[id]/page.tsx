import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, Card, CardHeader, Meter, StatusBadge } from "@/components/ui/primitives";
import { InsightQuote } from "@/components/InsightQuote";
import { AttendanceGrid } from "@/components/charts/AttendanceGrid";
import { TrendChart } from "@/components/charts/TrendChart";
import { getRepository } from "@/lib/data/repository";
import { REFERENCE_DATE, attainment } from "@/lib/data/mock";
import type { PerformanceMetric } from "@/lib/types";
import {
  contractLabel,
  currency,
  longDate,
  percent,
  periodLabel,
  tenure,
} from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/employees/[id]">): Promise<Metadata> {
  const { id } = await params;
  const employee = await getRepository().getEmployee(id);
  return {
    title: employee ? `${employee.firstName} ${employee.lastName} — Corale` : "Corale",
  };
}

function formatMetric(m: PerformanceMetric, value: number): string {
  if (m.unit === "€") return currency(value);
  if (m.unit === "%") return `${value.toLocaleString("it-IT")}%`;
  if (m.unit === "n") return value.toLocaleString("it-IT");
  return `${value.toLocaleString("it-IT")} ${m.unit}`;
}

export default async function EmployeePage({ params }: PageProps<"/employees/[id]">) {
  const { id } = await params;
  const repo = getRepository();

  const employee = await repo.getEmployee(id);
  if (!employee) notFound();

  const [department, insights, manager] = await Promise.all([
    repo.getDepartment(employee.departmentId),
    repo.listEmployeeInsights(employee.id),
    employee.managerId ? repo.getEmployee(employee.managerId) : Promise.resolve(null),
  ]);

  const { contract, compensation } = employee;
  const trendPoints = employee.performanceTrend.map((value, i) => ({
    label: `P${i + 1}`,
    value,
  }));

  return (
    <div className="mx-auto max-w-[1180px] px-6 py-8 lg:px-10 lg:py-10">
      <Link
        href="/employees"
        className="inline-flex items-center gap-1.5 text-sm text-ink-400 transition-colors hover:text-bord-500"
      >
        <svg aria-hidden width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 3.5 5 8l4.5 4.5" />
        </svg>
        Tutti i dipendenti
      </Link>

      {/* Identity header */}
      <header className="mt-5 flex flex-wrap items-start justify-between gap-6 border-b border-ivory-400 pb-7">
        <div className="flex items-center gap-5">
          <Avatar firstName={employee.firstName} lastName={employee.lastName} size="lg" />
          <div>
            <h1 className="font-display text-[1.75rem] leading-tight text-ink-900">
              {employee.firstName} {employee.lastName}
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              {employee.position} · {department?.name}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <StatusBadge status={employee.status} />
              <span className="text-xs text-ink-400">
                In azienda da {tenure(employee.hiredOn, REFERENCE_DATE)}
              </span>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
          <Figure label="Presenza" value={percent(employee.attendanceRate)} alert={employee.attendanceRate < 90} />
          <Figure label="Performance" value={String(employee.performanceScore)} alert={employee.performanceScore < 75} />
          <Figure label="Lordo mese" value={currency(compensation.grossTotal)} />
          <Figure label="Ore settimanali" value={`${contract.weeklyHours} h`} />
        </dl>
      </header>

      <div className="mt-7 grid items-start gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          {insights.length > 0 ? (
            <Card>
              <CardHeader
                eyebrow="Analisi automatica"
                title="Osservazione sul periodo"
                hint="Generata dai dati di presenza e performance della persona. Nessun dato è inferito: apri «Su quali dati» per la verifica."
              />
              <div className="space-y-8 px-6 py-7">
                {insights.map((insight) => (
                  <InsightQuote key={insight.id} insight={insight} />
                ))}
              </div>
            </Card>
          ) : null}

          <Card>
            <CardHeader
              eyebrow="Performance"
              title="Obiettivi del periodo"
              hint="Ogni indicatore ha un peso nel punteggio composito. La direzione di miglioramento è definita per singolo indicatore."
            />
            <ul className="divide-y divide-ivory-300">
              {employee.metrics.map((m) => {
                const pct = attainment(m);
                const tone = pct >= 100 ? "good" : pct >= 85 ? "accent" : pct >= 70 ? "warn" : "crit";
                return (
                  <li key={m.id} className="px-6 py-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-ink-900">{m.label}</span>
                        <span className="text-xs text-ink-300">
                          peso {Math.round(m.weight * 100)}%
                          {m.higherIsBetter ? "" : " · meglio se basso"}
                        </span>
                      </div>
                      <div className="tnum flex items-baseline gap-2 text-sm">
                        <span className="font-medium text-ink-900">
                          {formatMetric(m, m.value)}
                        </span>
                        <span className="text-ink-400">
                          / {formatMetric(m, m.target)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center gap-3">
                      <Meter
                        value={Math.min(pct, 100)}
                        tone={tone}
                        label={`${m.label}: ${Math.round(pct)}% dell’obiettivo`}
                      />
                      <span className="tnum w-12 shrink-0 text-right text-xs text-ink-400">
                        {Math.round(pct)}%
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card>
            <CardHeader
              eyebrow="Storico"
              title="Andamento del punteggio"
              hint="Ultimi 12 periodi di valutazione."
            />
            <TrendChart
              points={trendPoints}
              unit=""
              caption={`Punteggio composito di ${employee.firstName} ${employee.lastName} per periodo`}
            />
          </Card>

          <Card>
            <CardHeader
              eyebrow="Presenze"
              title="Ultimi 90 giorni"
              hint="Solo giornate lavorative. Il tratteggio indica giornate fuori dal periodo di rilevazione."
            />
            <AttendanceGrid days={employee.attendance} />
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <Card>
            <CardHeader eyebrow="Anagrafica" title="Dati e contratto" />
            <dl className="divide-y divide-ivory-300">
              <Row label="Email" value={employee.email} />
              <Row label="Telefono" value={employee.phone} />
              <Row label="Sede" value={employee.location} />
              <Row
                label="Responsabile"
                value={
                  manager ? (
                    <Link
                      href={`/employees/${manager.id}`}
                      className="text-bord-500 underline decoration-bord-200 underline-offset-2 hover:decoration-bord-500"
                    >
                      {manager.firstName} {manager.lastName}
                    </Link>
                  ) : (
                    "—"
                  )
                }
              />
              <Row label="Tipo di contratto" value={contractLabel[contract.type]} />
              <Row label="Livello" value={`${contract.level} · ${contract.ccnl}`} />
              <Row label="Inizio rapporto" value={longDate(contract.startDate)} />
              <Row
                label="Scadenza"
                value={contract.endDate ? longDate(contract.endDate) : "Nessuna"}
                alert={Boolean(contract.endDate)}
              />
              <Row label="Retribuzione annua lorda" value={currency(contract.grossAnnual)} />
            </dl>
          </Card>

          {/* The payroll module's core promise: every line traceable to its rule */}
          <Card>
            <CardHeader
              eyebrow={periodLabel(compensation.period)}
              title="Calcolo retributivo"
              hint="Ogni voce riporta la regola che l’ha prodotta, nella versione vigente al momento del calcolo."
            />
            <ul className="divide-y divide-ivory-300">
              <li className="px-6 py-3.5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-sm text-ink-700">Retribuzione base</span>
                  <span className="tnum text-sm font-medium text-ink-900">
                    {currency(compensation.baseMonthly, true)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-400">
                  RAL {currency(contract.grossAnnual)} su 13 mensilità
                </p>
              </li>

              {compensation.lines.map((line) => (
                <li key={line.label} className="px-6 py-3.5">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm text-ink-700">{line.label}</span>
                    <span
                      className={`tnum text-sm font-medium ${
                        line.amount < 0 ? "text-[#8c2626]" : "text-ink-900"
                      }`}
                    >
                      {line.amount < 0 ? "−" : "+"}
                      {currency(Math.abs(line.amount), true)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-ink-400">{line.rule}</p>
                </li>
              ))}

              <li className="flex items-baseline justify-between gap-4 bg-ivory-100 px-6 py-4">
                <span className="text-sm font-medium text-ink-900">Totale lordo</span>
                <span className="tnum text-base font-semibold text-ink-900">
                  {currency(compensation.grossTotal, true)}
                </span>
              </li>
            </ul>
            <p className="border-t border-ivory-300 px-6 py-3 text-xs leading-relaxed text-ink-400">
              Il calcolo è simulato prima di essere applicato. Ogni elaborazione
              viene registrata in modo immutabile insieme alle regole vigenti, così
              che qualsiasi periodo sia ricostruibile in sede di verifica.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Figure({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-ink-400">{label}</dt>
      <dd
        className={`mt-0.5 text-lg font-semibold ${alert ? "text-[#8c2626]" : "text-ink-900"}`}
      >
        {value}
      </dd>
    </div>
  );
}

function Row({
  label,
  value,
  alert,
}: {
  label: string;
  value: React.ReactNode;
  alert?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 px-6 py-3">
      <dt className="text-xs text-ink-400">{label}</dt>
      <dd className={`text-sm ${alert ? "font-medium text-[#7d5719]" : "text-ink-900"}`}>
        {value}
      </dd>
    </div>
  );
}
