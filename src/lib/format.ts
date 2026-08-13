import type { DayKind, EmployeeStatus, Severity } from "@/lib/types";

/** Fixed locale so server and client agree — never the runtime's default. */
const LOCALE = "it-IT";

const eur0 = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const eur2 = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const num1 = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function currency(value: number, cents = false): string {
  return (cents ? eur2 : eur0).format(value);
}

/** Compact for stat tiles: € 151K rather than € 150.900. */
export function currencyCompact(value: number): string {
  if (Math.abs(value) >= 1000) {
    return `€ ${num1.format(value / 1000)}K`;
  }
  return eur0.format(value);
}

export function percent(value: number, places = 1): string {
  return `${new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: places,
    maximumFractionDigits: places,
  }).format(value)}%`;
}

export function signed(value: number, unit = ""): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  const abs = Math.abs(value);
  // Whole numbers stay whole — "+3 persone", not "+3,0 persone".
  const body = Number.isInteger(abs) ? abs.toLocaleString(LOCALE) : num1.format(abs);
  return `${sign}${body}${unit}`;
}

export function longDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function shortDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    timeZone: "UTC",
  });
}

export function dateTime(iso: string): string {
  return new Date(iso).toLocaleString(LOCALE, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export function periodLabel(period: string): string {
  const [year, month] = period.split("-");
  const label = new Date(Date.UTC(Number(year), Number(month) - 1, 1)).toLocaleDateString(
    LOCALE,
    { month: "long", year: "numeric", timeZone: "UTC" },
  );
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/** Years and months of service at the frozen reference date. */
export function tenure(hiredOn: string, reference: string): string {
  const from = new Date(`${hiredOn}T00:00:00Z`);
  const to = new Date(`${reference}T00:00:00Z`);
  let months =
    (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
    (to.getUTCMonth() - from.getUTCMonth());
  if (to.getUTCDate() < from.getUTCDate()) months -= 1;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${rest} mes${rest === 1 ? "e" : "i"}`;
  if (rest === 0) return `${years} ann${years === 1 ? "o" : "i"}`;
  return `${years} ann${years === 1 ? "o" : "i"} e ${rest} mes${rest === 1 ? "e" : "i"}`;
}

export const statusLabel: Record<EmployeeStatus, string> = {
  attivo: "In servizio",
  ferie: "In ferie",
  permesso: "In permesso",
  assente: "Assente",
};

export const dayKindLabel: Record<DayKind, string> = {
  presente: "Presente",
  ferie: "Ferie",
  permesso: "Permesso",
  assenza: "Assenza",
  festivo: "Non lavorativo",
};

export const contractLabel: Record<string, string> = {
  indeterminato: "Tempo indeterminato",
  determinato: "Tempo determinato",
  apprendistato: "Apprendistato",
  collaborazione: "Collaborazione",
  stage: "Stage",
};

export const severityLabel: Record<Severity, string> = {
  good: "Positivo",
  warn: "Da osservare",
  crit: "Richiede attenzione",
};
