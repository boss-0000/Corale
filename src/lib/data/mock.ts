import type {
  ActivityEntry,
  AttendanceDay,
  Compensation,
  CompanyStats,
  CurrentUser,
  DayKind,
  Department,
  Employee,
  Insight,
  PerformanceMetric,
} from "@/lib/types";

/**
 * Deterministic seed data for the prototype.
 *
 * Everything is generated from a fixed seed and a fixed reference date so that
 * server and client render identical markup — no `Math.random()`, no `new Date()`
 * at module scope. Swapping this file for API calls does not touch the UI.
 */

/** The "today" the prototype is frozen at. */
export const REFERENCE_DATE = "2026-08-12";
export const CURRENT_PERIOD = "2026-07";

/** mulberry32 — small, fast, deterministic. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function addDays(iso: string, delta: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

function round(n: number, places = 0): number {
  const f = 10 ** places;
  return Math.round(n * f) / f;
}

/* -------------------------------------------------------------------------- */
/* Departments                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Headcount and monthly cost are derived from the employee seeds below, not
 * invented — a dashboard whose totals disagree with its own list is the fastest
 * way to lose a reader's trust.
 */
export const departments: Department[] = [
  {
    id: "dep-design",
    name: "Design",
    leadId: "emp-002",
    headcount: 3,
    performance: 91,
    attendance: 96.4,
    monthlyCost: 9480,
  },
  {
    id: "dep-tech",
    name: "Tecnologia",
    leadId: "emp-005",
    headcount: 3,
    performance: 87,
    attendance: 94.1,
    monthlyCost: 11380,
  },
  {
    id: "dep-marketing",
    name: "Marketing",
    leadId: "emp-008",
    headcount: 3,
    performance: 74,
    attendance: 88.6,
    monthlyCost: 8690,
  },
  {
    id: "dep-sales",
    name: "Vendite",
    leadId: "emp-011",
    headcount: 3,
    performance: 82,
    attendance: 92.3,
    monthlyCost: 9540,
  },
  {
    id: "dep-people",
    name: "Persone e Cultura",
    leadId: "emp-001",
    headcount: 2,
    performance: 89,
    attendance: 97.1,
    monthlyCost: 7920,
  },
];

/* -------------------------------------------------------------------------- */
/* Employee seeds — the hand-authored part                                     */
/* -------------------------------------------------------------------------- */

interface Seed {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  departmentId: string;
  managerId: string | null;
  role: Employee["role"];
  status: Employee["status"];
  hiredOn: string;
  location: string;
  contractType: Employee["contract"]["type"];
  contractEnd: string | null;
  weeklyHours: number;
  grossAnnual: number;
  level: string;
  performanceScore: number;
  attendanceRate: number;
  /** Direction of the trailing trend: rising, flat, or falling. */
  trend: "up" | "flat" | "down";
}

const seeds: Seed[] = [
  {
    id: "emp-001",
    firstName: "Giulia",
    lastName: "Ferrari",
    position: "Direzione Persone e Cultura",
    departmentId: "dep-people",
    managerId: null,
    role: "admin",
    status: "attivo",
    hiredOn: "2019-03-04",
    location: "Milano",
    contractType: "indeterminato",
    contractEnd: null,
    weeklyHours: 40,
    grossAnnual: 68000,
    level: "Quadro",
    performanceScore: 93,
    attendanceRate: 98.2,
    trend: "flat",
  },
  {
    id: "emp-002",
    firstName: "Marta",
    lastName: "Bellini",
    position: "Design Lead",
    departmentId: "dep-design",
    managerId: "emp-001",
    role: "manager",
    status: "attivo",
    hiredOn: "2020-09-14",
    location: "Milano",
    contractType: "indeterminato",
    contractEnd: null,
    weeklyHours: 40,
    grossAnnual: 54000,
    level: "1° livello",
    performanceScore: 95,
    attendanceRate: 97.6,
    trend: "up",
  },
  {
    id: "emp-003",
    firstName: "Sofia",
    lastName: "Ricci",
    position: "Product Designer",
    departmentId: "dep-design",
    managerId: "emp-002",
    role: "employee",
    status: "attivo",
    hiredOn: "2022-01-10",
    location: "Bologna",
    contractType: "indeterminato",
    contractEnd: null,
    weeklyHours: 40,
    grossAnnual: 38500,
    level: "3° livello",
    performanceScore: 88,
    attendanceRate: 96.1,
    trend: "up",
  },
  {
    id: "emp-004",
    firstName: "Luca",
    lastName: "Moretti",
    position: "Motion Designer",
    departmentId: "dep-design",
    managerId: "emp-002",
    role: "employee",
    status: "ferie",
    hiredOn: "2023-06-01",
    location: "Remoto",
    contractType: "determinato",
    contractEnd: "2026-11-30",
    weeklyHours: 32,
    grossAnnual: 31000,
    level: "4° livello",
    performanceScore: 84,
    attendanceRate: 94.8,
    trend: "flat",
  },
  {
    id: "emp-005",
    firstName: "Elena",
    lastName: "Conti",
    position: "Engineering Manager",
    departmentId: "dep-tech",
    managerId: "emp-001",
    role: "manager",
    status: "attivo",
    hiredOn: "2018-11-05",
    location: "Torino",
    contractType: "indeterminato",
    contractEnd: null,
    weeklyHours: 40,
    grossAnnual: 62000,
    level: "Quadro",
    performanceScore: 90,
    attendanceRate: 95.4,
    trend: "flat",
  },
  {
    id: "emp-006",
    firstName: "Andrea",
    lastName: "Fontana",
    position: "Backend Engineer",
    departmentId: "dep-tech",
    managerId: "emp-005",
    role: "employee",
    status: "attivo",
    hiredOn: "2021-04-19",
    location: "Torino",
    contractType: "indeterminato",
    contractEnd: null,
    weeklyHours: 40,
    grossAnnual: 45000,
    level: "2° livello",
    performanceScore: 86,
    attendanceRate: 93.2,
    trend: "flat",
  },
  {
    id: "emp-007",
    firstName: "Chiara",
    lastName: "Greco",
    position: "Frontend Engineer",
    departmentId: "dep-tech",
    managerId: "emp-005",
    role: "employee",
    status: "attivo",
    hiredOn: "2024-02-12",
    location: "Remoto",
    contractType: "indeterminato",
    contractEnd: null,
    weeklyHours: 40,
    grossAnnual: 41000,
    level: "3° livello",
    performanceScore: 79,
    attendanceRate: 90.7,
    trend: "down",
  },
  {
    id: "emp-008",
    firstName: "Davide",
    lastName: "Russo",
    position: "Marketing Lead",
    departmentId: "dep-marketing",
    managerId: "emp-001",
    role: "manager",
    status: "attivo",
    hiredOn: "2021-07-26",
    location: "Milano",
    contractType: "indeterminato",
    contractEnd: null,
    weeklyHours: 40,
    grossAnnual: 51000,
    level: "1° livello",
    performanceScore: 77,
    attendanceRate: 91.5,
    trend: "down",
  },
  {
    id: "emp-009",
    firstName: "Alessia",
    lastName: "Barbieri",
    position: "Content Strategist",
    departmentId: "dep-marketing",
    managerId: "emp-008",
    role: "employee",
    status: "permesso",
    hiredOn: "2023-10-02",
    location: "Firenze",
    contractType: "indeterminato",
    contractEnd: null,
    weeklyHours: 36,
    grossAnnual: 34000,
    level: "4° livello",
    performanceScore: 71,
    attendanceRate: 86.3,
    trend: "down",
  },
  {
    id: "emp-010",
    firstName: "Matteo",
    lastName: "Villa",
    position: "Performance Marketing",
    departmentId: "dep-marketing",
    managerId: "emp-008",
    role: "employee",
    status: "attivo",
    hiredOn: "2025-01-13",
    location: "Milano",
    contractType: "apprendistato",
    contractEnd: "2027-01-12",
    weeklyHours: 40,
    grossAnnual: 28000,
    level: "5° livello",
    performanceScore: 75,
    attendanceRate: 92.9,
    trend: "up",
  },
  {
    id: "emp-011",
    firstName: "Francesca",
    lastName: "Lombardi",
    position: "Head of Sales",
    departmentId: "dep-sales",
    managerId: "emp-001",
    role: "manager",
    status: "attivo",
    hiredOn: "2020-02-17",
    location: "Roma",
    contractType: "indeterminato",
    contractEnd: null,
    weeklyHours: 40,
    grossAnnual: 58000,
    level: "Quadro",
    performanceScore: 89,
    attendanceRate: 94.6,
    trend: "up",
  },
  {
    id: "emp-012",
    firstName: "Simone",
    lastName: "Costa",
    position: "Account Executive",
    departmentId: "dep-sales",
    managerId: "emp-011",
    role: "employee",
    status: "attivo",
    hiredOn: "2022-08-22",
    location: "Roma",
    contractType: "indeterminato",
    contractEnd: null,
    weeklyHours: 40,
    grossAnnual: 36000,
    level: "3° livello",
    performanceScore: 83,
    attendanceRate: 93.8,
    trend: "flat",
  },
  {
    id: "emp-013",
    firstName: "Nadia",
    lastName: "Esposito",
    position: "Sales Development",
    departmentId: "dep-sales",
    managerId: "emp-011",
    role: "employee",
    status: "assente",
    hiredOn: "2024-09-09",
    location: "Napoli",
    contractType: "determinato",
    contractEnd: "2026-09-08",
    weeklyHours: 40,
    grossAnnual: 30000,
    level: "4° livello",
    performanceScore: 68,
    attendanceRate: 81.4,
    trend: "down",
  },
  {
    id: "emp-014",
    firstName: "Paolo",
    lastName: "Marchetti",
    position: "People Operations",
    departmentId: "dep-people",
    managerId: "emp-001",
    role: "employee",
    status: "attivo",
    hiredOn: "2023-03-27",
    location: "Milano",
    contractType: "indeterminato",
    contractEnd: null,
    weeklyHours: 40,
    grossAnnual: 35000,
    level: "3° livello",
    performanceScore: 87,
    attendanceRate: 97.9,
    trend: "flat",
  },
];

/* -------------------------------------------------------------------------- */
/* Derived detail — generated deterministically per employee                   */
/* -------------------------------------------------------------------------- */

const metricTemplates: Record<string, Omit<PerformanceMetric, "value">[]> = {
  "dep-design": [
    { id: "m1", label: "Consegne nei tempi", target: 95, unit: "%", weight: 0.3, higherIsBetter: true },
    { id: "m2", label: "Revisioni per progetto", target: 3, unit: "n", weight: 0.2, higherIsBetter: false },
    { id: "m3", label: "Soddisfazione stakeholder", target: 90, unit: "%", weight: 0.3, higherIsBetter: true },
    { id: "m4", label: "Contributi al design system", target: 12, unit: "n", weight: 0.2, higherIsBetter: true },
  ],
  "dep-tech": [
    { id: "m1", label: "Ticket risolti", target: 40, unit: "n", weight: 0.3, higherIsBetter: true },
    { id: "m2", label: "Copertura test", target: 80, unit: "%", weight: 0.25, higherIsBetter: true },
    { id: "m3", label: "Incidenti in produzione", target: 2, unit: "n", weight: 0.25, higherIsBetter: false },
    { id: "m4", label: "Tempo medio di review", target: 8, unit: "h", weight: 0.2, higherIsBetter: false },
  ],
  "dep-marketing": [
    { id: "m1", label: "Lead qualificati", target: 120, unit: "n", weight: 0.35, higherIsBetter: true },
    { id: "m2", label: "Costo per acquisizione", target: 45, unit: "€", weight: 0.25, higherIsBetter: false },
    { id: "m3", label: "Contenuti pubblicati", target: 16, unit: "n", weight: 0.2, higherIsBetter: true },
    { id: "m4", label: "Engagement medio", target: 4.5, unit: "%", weight: 0.2, higherIsBetter: true },
  ],
  "dep-sales": [
    { id: "m1", label: "Fatturato generato", target: 85000, unit: "€", weight: 0.4, higherIsBetter: true },
    { id: "m2", label: "Tasso di chiusura", target: 22, unit: "%", weight: 0.25, higherIsBetter: true },
    { id: "m3", label: "Nuovi contatti", target: 60, unit: "n", weight: 0.2, higherIsBetter: true },
    { id: "m4", label: "Tempo medio di ciclo", target: 28, unit: "gg", weight: 0.15, higherIsBetter: false },
  ],
  "dep-people": [
    { id: "m1", label: "Tempo medio di assunzione", target: 32, unit: "gg", weight: 0.3, higherIsBetter: false },
    { id: "m2", label: "Retention a 12 mesi", target: 90, unit: "%", weight: 0.3, higherIsBetter: true },
    { id: "m3", label: "Ore di formazione erogate", target: 45, unit: "h", weight: 0.2, higherIsBetter: true },
    { id: "m4", label: "Pratiche evase nei tempi", target: 98, unit: "%", weight: 0.2, higherIsBetter: true },
  ],
};

function buildMetrics(seed: Seed, rand: () => number): PerformanceMetric[] {
  const templates = metricTemplates[seed.departmentId];
  // Scale achievement around the composite score so the parts agree with the
  // whole. For "lower is better" metrics the bias inverts, otherwise a strong
  // performer would show more production incidents than a weak one.
  const bias = seed.performanceScore / 85;
  return templates.map((t) => {
    const jitter = 0.85 + rand() * 0.3;
    const factor = t.higherIsBetter ? bias : 2 - bias;
    const value = round(t.target * factor * jitter, t.target < 10 ? 1 : 0);
    return { ...t, value };
  });
}

/** Goal attainment as a percentage, direction-aware. */
export function attainment(metric: PerformanceMetric): number {
  if (metric.higherIsBetter) {
    return metric.target === 0 ? 0 : (metric.value / metric.target) * 100;
  }
  return metric.value === 0 ? 200 : (metric.target / metric.value) * 100;
}

function buildAttendance(seed: Seed, rand: () => number): AttendanceDay[] {
  const days: AttendanceDay[] = [];
  for (let i = 0; i < 90; i++) {
    const date = addDays(REFERENCE_DATE, -i);
    const dow = new Date(`${date}T00:00:00Z`).getUTCDay();

    if (dow === 0 || dow === 6) {
      days.push({ date, kind: "festivo", hours: 0, checkIn: null, checkOut: null, lateMinutes: 0 });
      continue;
    }

    const roll = rand() * 100;
    const missRate = 100 - seed.attendanceRate;
    let kind: DayKind = "presente";
    if (roll < missRate * 0.45) kind = "assenza";
    else if (roll < missRate * 0.8) kind = "ferie";
    else if (roll < missRate) kind = "permesso";

    if (kind !== "presente") {
      days.push({ date, kind, hours: 0, checkIn: null, checkOut: null, lateMinutes: 0 });
      continue;
    }

    const dailyHours = seed.weeklyHours / 5;
    // Punctuality correlates with the attendance rate.
    const lateMinutes =
      rand() < (100 - seed.attendanceRate) / 55 ? Math.floor(4 + rand() * 38) : 0;
    const startMin = 9 * 60 + lateMinutes;
    const endMin = startMin + Math.round(dailyHours * 60) + 60; // + lunch
    const fmt = (m: number) =>
      `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

    days.push({
      date,
      kind,
      hours: round(dailyHours + (rand() - 0.45), 1),
      checkIn: fmt(startMin),
      checkOut: fmt(endMin),
      lateMinutes,
    });
  }
  return days;
}

function buildCompensation(seed: Seed, rand: () => number): Compensation {
  const baseMonthly = round(seed.grossAnnual / 13, 2); // 13 mensilità
  const lines: Compensation["lines"] = [];

  // Performance bonus — the configurable rule the client cares most about.
  if (seed.performanceScore >= 85) {
    const pct = seed.performanceScore >= 92 ? 0.12 : 0.08;
    lines.push({
      label: "Bonus performance",
      amount: round(baseMonthly * pct, 2),
      rule: `Punteggio ${seed.performanceScore} ≥ ${seed.performanceScore >= 92 ? 92 : 85} → ${pct * 100}% della retribuzione base`,
    });
  }

  if (seed.attendanceRate >= 96) {
    lines.push({
      label: "Premio presenza",
      amount: 120,
      rule: "Tasso di presenza ≥ 96% nel periodo → € 120 forfettari",
    });
  }

  if (seed.departmentId === "dep-sales") {
    const commission = round(400 + rand() * 1800, 2);
    lines.push({
      label: "Provvigioni",
      amount: commission,
      rule: "2,1% sul fatturato incassato nel periodo",
    });
  }

  if (seed.location === "Remoto") {
    lines.push({
      label: "Indennità lavoro da remoto",
      amount: 80,
      rule: "Sede contrattuale «Remoto» → € 80 mensili",
    });
  }

  if (seed.attendanceRate < 85) {
    lines.push({
      label: "Trattenuta assenze non giustificate",
      amount: -round(baseMonthly * 0.04, 2),
      rule: "Tasso di presenza < 85% → trattenuta 4% della retribuzione base",
    });
  }

  const grossTotal = round(
    baseMonthly + lines.reduce((sum, l) => sum + l.amount, 0),
    2,
  );

  return { period: CURRENT_PERIOD, baseMonthly, lines, grossTotal };
}

function buildTrend(seed: Seed, rand: () => number): number[] {
  const end = seed.performanceScore;
  const slope = seed.trend === "up" ? -9 : seed.trend === "down" ? 11 : 0;
  const points: number[] = [];
  for (let i = 0; i < 12; i++) {
    const progress = i / 11;
    const base = end + slope * (1 - progress);
    points.push(round(Math.max(40, Math.min(100, base + (rand() - 0.5) * 5))));
  }
  return points;
}

function hashSeed(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const employees: Employee[] = seeds.map((seed) => {
  const rand = rng(hashSeed(seed.id));
  return {
    id: seed.id,
    firstName: seed.firstName,
    lastName: seed.lastName,
    email: `${seed.firstName.toLowerCase()}.${seed.lastName.toLowerCase()}@corale.it`,
    phone: `+39 3${String(20 + (hashSeed(seed.id) % 60))} ${String(1000000 + (hashSeed(seed.id) % 8999999))}`,
    role: seed.role,
    position: seed.position,
    departmentId: seed.departmentId,
    managerId: seed.managerId,
    status: seed.status,
    hiredOn: seed.hiredOn,
    location: seed.location,
    contract: {
      type: seed.contractType,
      startDate: seed.hiredOn,
      endDate: seed.contractEnd,
      weeklyHours: seed.weeklyHours,
      grossAnnual: seed.grossAnnual,
      ccnl: "CCNL Commercio e Terziario",
      level: seed.level,
    },
    performanceScore: seed.performanceScore,
    attendanceRate: seed.attendanceRate,
    metrics: buildMetrics(seed, rand),
    attendance: buildAttendance(seed, rand),
    compensation: buildCompensation(seed, rand),
    performanceTrend: buildTrend(seed, rand),
  };
});

/* -------------------------------------------------------------------------- */
/* Company-level aggregates                                                    */
/* -------------------------------------------------------------------------- */

const attendanceWeeks = [
  93.1, 94.0, 92.6, 94.8, 95.2, 94.1, 92.9, 91.4, 90.2, 91.8, 93.4, 92.1,
];

export const companyStats: CompanyStats = {
  headcount: departments.reduce((s, d) => s + d.headcount, 0),
  headcountDelta: 2,
  attendanceRate: 92.1,
  attendanceDelta: -1.3,
  performanceAvg: 84.6,
  performanceDelta: 1.8,
  monthlyCost: departments.reduce((s, d) => s + d.monthlyCost, 0),
  monthlyCostDelta: 4.2,
  attendanceTrend: attendanceWeeks.map((value, i) => ({
    label: `S${23 + i}`,
    value,
  })),
};

/* -------------------------------------------------------------------------- */
/* Insights — the editorial signature of the product                           */
/* -------------------------------------------------------------------------- */

export const insights: Insight[] = [
  {
    id: "ins-001",
    severity: "crit",
    quote:
      "Le assenze nel reparto Marketing si concentrano il lunedì: quasi due terzi delle giornate perse cadono a inizio settimana.",
    recommendation:
      "Verificare i carichi assegnati il venerdì e valutare uno spostamento delle riunioni di allineamento.",
    evidence: [
      { label: "Assenze del lunedì", value: "61% del totale" },
      { label: "Periodo osservato", value: "ultime 12 settimane" },
      { label: "Scostamento dalla media aziendale", value: "+38 punti" },
    ],
    subject: { kind: "department", id: "dep-marketing", name: "Marketing" },
    generatedAt: "2026-08-12T07:15:00Z",
  },
  {
    id: "ins-002",
    severity: "warn",
    quote:
      "Il punteggio di Vendite cresce mentre il tempo medio di ciclo si allunga: il team chiude di più, ma più lentamente.",
    recommendation:
      "Rivedere la soglia del bonus provvigionale, oggi legata solo al valore e non alla durata del ciclo.",
    evidence: [
      { label: "Fatturato vs obiettivo", value: "+11%" },
      { label: "Tempo medio di ciclo", value: "34 gg (obiettivo 28)" },
      { label: "Trattative aperte oltre 45 gg", value: "9" },
    ],
    subject: { kind: "department", id: "dep-sales", name: "Vendite" },
    generatedAt: "2026-08-12T07:15:00Z",
  },
  {
    id: "ins-003",
    severity: "good",
    quote:
      "Design mantiene il punteggio più alto dell'azienda con il costo per persona più basso fra i reparti operativi.",
    recommendation:
      "Documentare le pratiche del reparto come riferimento per gli altri team.",
    evidence: [
      { label: "Punteggio composito", value: "91 / 100" },
      { label: "Costo medio per persona", value: "€ 3.160 / mese" },
      { label: "Consegne nei tempi", value: "94%" },
    ],
    subject: { kind: "department", id: "dep-design", name: "Design" },
    generatedAt: "2026-08-12T07:15:00Z",
  },
];

export const employeeInsights: Record<string, Insight[]> = {
  "emp-013": [
    {
      id: "ins-101",
      severity: "crit",
      quote:
        "Il tasso di presenza è sceso di 9 punti in due mesi, con un contratto in scadenza fra quattro settimane.",
      recommendation:
        "Programmare un colloquio prima del rinnovo: il calo è iniziato dopo la riassegnazione del portafoglio.",
      evidence: [
        { label: "Presenza attuale", value: "81,4%" },
        { label: "Presenza a giugno", value: "90,6%" },
        { label: "Scadenza contratto", value: "8 settembre 2026" },
      ],
      subject: { kind: "employee", id: "emp-013", name: "Nadia Esposito" },
      generatedAt: "2026-08-12T07:15:00Z",
    },
  ],
  "emp-007": [
    {
      id: "ins-102",
      severity: "warn",
      quote:
        "Il punteggio è in calo da cinque periodi consecutivi, mentre il volume di ticket assegnati è cresciuto del 24%.",
      recommendation:
        "Il calo sembra legato al carico, non alla qualità: valutare una redistribuzione prima della prossima revisione degli obiettivi.",
      evidence: [
        { label: "Punteggio", value: "79 (era 88 a marzo)" },
        { label: "Ticket assegnati", value: "+24%" },
        { label: "Copertura test", value: "76% (obiettivo 80%)" },
      ],
      subject: { kind: "employee", id: "emp-007", name: "Chiara Greco" },
      generatedAt: "2026-08-12T07:15:00Z",
    },
  ],
  "emp-002": [
    {
      id: "ins-103",
      severity: "good",
      quote:
        "Superati tutti e quattro gli obiettivi del periodo, con il contributo al design system più alto del reparto.",
      recommendation:
        "Il punteggio supera la soglia del bonus maggiorato: verificare la disponibilità di budget prima dell'elaborazione.",
      evidence: [
        { label: "Punteggio composito", value: "95 / 100" },
        { label: "Obiettivi superati", value: "4 su 4" },
        { label: "Soglia bonus 12%", value: "≥ 92" },
      ],
      subject: { kind: "employee", id: "emp-002", name: "Marta Bellini" },
      generatedAt: "2026-08-12T07:15:00Z",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* Activity log                                                                */
/* -------------------------------------------------------------------------- */

export const activity: ActivityEntry[] = [
  {
    id: "act-1",
    at: "2026-08-12T08:42:00Z",
    actor: "Giulia Ferrari",
    action: "ha modificato la regola «Bonus performance»",
    target: "Regole retributive",
  },
  {
    id: "act-2",
    at: "2026-08-12T08:05:00Z",
    actor: "Corale",
    action: "ha generato 3 osservazioni sul periodo",
    target: "Analisi automatica",
  },
  {
    id: "act-3",
    at: "2026-08-11T17:20:00Z",
    actor: "Elena Conti",
    action: "ha approvato la richiesta di ferie",
    target: "Luca Moretti",
  },
  {
    id: "act-4",
    at: "2026-08-11T14:58:00Z",
    actor: "Paolo Marchetti",
    action: "ha caricato il contratto aggiornato",
    target: "Matteo Villa",
  },
  {
    id: "act-5",
    at: "2026-08-11T09:31:00Z",
    actor: "Francesca Lombardi",
    action: "ha rivisto gli obiettivi del periodo",
    target: "Vendite",
  },
  {
    id: "act-6",
    at: "2026-08-10T16:12:00Z",
    actor: "Giulia Ferrari",
    action: "ha registrato una nuova assunzione",
    target: "Anagrafica dipendenti",
  },
];

export const currentUser: CurrentUser = {
  id: "emp-001",
  name: "Giulia Ferrari",
  role: "admin",
  position: "Direzione Persone e Cultura",
};
