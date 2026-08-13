import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { StatTile } from "@/components/StatTile";
import { InsightQuote } from "@/components/InsightQuote";
import { Card, CardHeader } from "@/components/ui/primitives";
import { TrendChart } from "@/components/charts/TrendChart";
import { BarList } from "@/components/charts/BarList";
import { getRepository } from "@/lib/data/repository";
import { REFERENCE_DATE, CURRENT_PERIOD } from "@/lib/data/mock";
import {
  currency,
  dateTime,
  longDate,
  percent,
  periodLabel,
} from "@/lib/format";

export const metadata: Metadata = {
  title: "Dashboard — Corale",
};

export default async function DashboardPage() {
  const repo = getRepository();
  const [user, stats, departments, insights, activity, employees] = await Promise.all([
    repo.getCurrentUser(),
    repo.getCompanyStats(),
    repo.listDepartments(),
    repo.listCompanyInsights(),
    repo.listActivity(5),
    repo.listEmployees(),
  ]);

  const [lead, ...secondary] = insights;
  const ranked = [...departments].sort((a, b) => b.performance - a.performance);
  const needAttention = employees
    .filter((e) => e.attendanceRate < 90 || e.performanceScore < 75)
    .sort((a, b) => a.performanceScore - b.performanceScore);

  const present = employees.filter((e) => e.status === "attivo").length;
  const away = employees.length - present;

  return (
    <div className="mx-auto max-w-[1240px] px-6 py-8 lg:px-12 lg:py-10">
      {/* Masthead rule, as on a cover page */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ivory-400 pb-5">
        <p className="text-xs uppercase tracking-[0.16em] text-ink-400">
          {longDate(REFERENCE_DATE)}
          <span className="mx-2 text-ivory-500">·</span>
          <span className="text-brass-600">Milano</span>
        </p>
        <p className="text-xs uppercase tracking-[0.16em] text-ink-400">
          Periodo di riferimento
          <span className="mx-2 text-ivory-500">·</span>
          <span className="text-ink-900">{periodLabel(CURRENT_PERIOD)}</span>
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
        <PageHeader
          eyebrow="Panoramica · Terzo trimestre"
          title={`Buongiorno, ${user.name.split(" ")[0]}.`}
          titleSecondLine="Ecco il ritratto di oggi."
        />

        <dl className="min-w-[260px] space-y-2 border-l border-ivory-400 pl-6">
          <SummaryRow label="Persone attive" value={String(stats.headcount)} />
          <SummaryRow label="In servizio oggi" value={String(present)} />
          <SummaryRow label="Assenti o in ferie" value={String(away)} />
          <SummaryRow label="Osservazioni aperte" value={String(insights.length)} />
        </dl>
      </div>

      {/* Stat strip — one ruled band, as in the concept */}
      <section className="mt-9 grid rounded-lg border border-ivory-400 bg-ivory-50 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Presenza media"
          value={stats.attendanceRate.toLocaleString("it-IT", { minimumFractionDigits: 1 })}
          unit="%"
          delta={stats.attendanceDelta}
          deltaUnit=" pt"
          deltaPeriod="dal mese scorso"
          trend={stats.attendanceTrend.map((p) => p.value)}
        />
        <StatTile
          label="Prestazione team"
          value={stats.performanceAvg.toLocaleString("it-IT", { minimumFractionDigits: 1 })}
          unit="/100"
          delta={stats.performanceDelta}
          deltaUnit=" pt"
          deltaPeriod="sopra la media"
        />
        <StatTile
          label="Costo lavoro (mese)"
          value={`€ ${Math.round(stats.monthlyCost / 1000)}`}
          unit="k"
          delta={stats.monthlyCostDelta}
          deltaUnit="%"
          deltaPeriod="sul preventivo"
          upIsGood={false}
        />
        <StatTile
          label="Organico attivo"
          value={String(stats.headcount)}
          delta={stats.headcountDelta}
          deltaPeriod="rispetto a giugno"
        />
      </section>

      {/* The signature: the lead observation as a full espresso panel */}
      <section className="mt-6">
        <InsightQuote insight={lead} variant="hero" />
      </section>

      <section className="mt-6 grid items-start gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Card>
            <CardHeader
              eyebrow="Presenze"
              title="Andamento settimanale"
              hint="Percentuale di giornate lavorate sul totale previsto, ultime 12 settimane."
            />
            <TrendChart
              points={stats.attendanceTrend}
              unit="%"
              caption="Tasso di presenza aziendale per settimana"
            />
          </Card>

          <Card>
            <CardHeader
              eyebrow="Analisi automatica"
              title="Altre osservazioni"
              hint="Ogni osservazione può essere aperta per vedere i dati su cui si fonda."
              action={
                <span className="hidden text-xs text-ink-400 sm:inline">
                  {dateTime(lead.generatedAt)}
                </span>
              }
            />
            <div className="grid gap-8 px-6 py-7 sm:grid-cols-2">
              {secondary.map((insight) => (
                <InsightQuote key={insight.id} insight={insight} />
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader
              eyebrow="Notifiche"
              title="Situazioni da verificare"
              hint="Persone sotto la soglia di presenza (90%) o di prestazione (75) definite nelle impostazioni."
              action={
                <Link
                  href="/employees"
                  className="text-sm text-bord-500 underline decoration-bord-200 underline-offset-4 transition-colors hover:decoration-bord-500"
                >
                  Vedi tutti
                </Link>
              }
            />
            <ul className="divide-y divide-ivory-300">
              {needAttention.map((e) => {
                const dept = departments.find((d) => d.id === e.departmentId);
                return (
                  <li key={e.id}>
                    <Link
                      href={`/employees/${e.id}`}
                      className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-3.5 transition-colors hover:bg-ivory-100"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink-900">
                          {e.firstName} {e.lastName}
                        </p>
                        <p className="text-xs italic text-ink-400">
                          {e.position} · {dept?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-xs text-ink-400">
                          Presenza{" "}
                          <span
                            className={`tnum font-medium ${e.attendanceRate < 90 ? "text-[#8c2626]" : "text-ink-900"}`}
                          >
                            {percent(e.attendanceRate)}
                          </span>
                        </span>
                        <span className="text-xs text-ink-400">
                          Prestazione{" "}
                          <span
                            className={`tnum font-medium ${e.performanceScore < 75 ? "text-[#8c2626]" : "text-ink-900"}`}
                          >
                            {e.performanceScore}
                          </span>
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <Card>
            <CardHeader
              eyebrow="Reparti"
              title="Prestazioni per reparto"
              hint="Punteggio composito 0–100 sul periodo."
            />
            <BarList
              caption="Punteggio di prestazione per reparto"
              max={100}
              items={ranked.map((d) => ({
                id: d.id,
                label: d.name,
                value: d.performance,
                display: String(d.performance),
                detail: [
                  { label: "Organico", value: String(d.headcount) },
                  { label: "Presenza", value: percent(d.attendance) },
                  { label: "Costo", value: currency(d.monthlyCost) },
                ],
              }))}
            />
          </Card>

          <Card>
            <CardHeader eyebrow="Tracciabilità" title="Attività recenti" />
            <ul className="divide-y divide-ivory-300">
              {activity.map((entry) => (
                <li key={entry.id} className="flex gap-4 px-6 py-3">
                  <span className="tnum shrink-0 font-display text-xs italic text-brass-600">
                    {dateTime(entry.at).split(", ")[1] ?? ""}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm leading-snug text-ink-700">
                      <span className="font-medium text-ink-900">{entry.actor}</span>{" "}
                      {entry.action}
                    </p>
                    <p className="mt-0.5 text-xs italic text-ink-400">{entry.target}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-8">
      <dt className="text-sm text-ink-500">{label}</dt>
      <dd className="tnum text-sm font-medium text-ink-900">{value}</dd>
    </div>
  );
}
