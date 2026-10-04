const LOCALE = "id-ID";

const monthFormatter = new Intl.DateTimeFormat(LOCALE, {
  month: "short",
  year: "2-digit",
  timeZone: "UTC",
});

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const numberFormatter = new Intl.NumberFormat(LOCALE);

/** `2026-10` → `Okt 26` */
export function formatPeriodLabel(period: string): string {
  const [year, month] = period.split("-").map(Number);
  if (!year || !month) return period;
  return monthFormatter.format(new Date(Date.UTC(year, month - 1, 1)));
}

export function formatDisplayDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "-" : dateFormatter.format(date);
}

export function formatCount(value: number): string {
  return numberFormatter.format(value);
}
