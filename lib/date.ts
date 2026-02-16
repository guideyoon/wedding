const DATE_REGEX = /(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/g;

function toIsoDate(year: string, month: string, day: string): string {
  const mm = month.padStart(2, "0");
  const dd = day.padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

export function parseDateRangeText(dateRangeText: string): {
  startDate: string;
  endDate: string;
} | null {
  const matches = [...dateRangeText.matchAll(DATE_REGEX)];
  if (matches.length === 0) {
    return null;
  }

  const first = matches[0];
  const last = matches[matches.length - 1];

  return {
    startDate: toIsoDate(first[1], first[2], first[3]),
    endDate: toIsoDate(last[1], last[2], last[3]),
  };
}

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime());
}

export function getNowIsoString(): string {
  return new Date().toISOString();
}

function toDateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeekMonday(input: Date): Date {
  const date = toDateOnly(input);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

function endOfWeekSunday(input: Date): Date {
  const start = startOfWeekMonday(input);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end;
}

function startOfMonth(input: Date): Date {
  return new Date(input.getFullYear(), input.getMonth(), 1);
}

function endOfMonth(input: Date): Date {
  return new Date(input.getFullYear(), input.getMonth() + 1, 0);
}

export function isDateInCurrentWeek(dateText: string, now: Date): boolean {
  if (!isIsoDate(dateText)) {
    return false;
  }
  const date = new Date(`${dateText}T00:00:00`);
  return date >= startOfWeekMonday(now) && date <= endOfWeekSunday(now);
}

export function isDateInCurrentMonth(dateText: string, now: Date): boolean {
  if (!isIsoDate(dateText)) {
    return false;
  }
  const date = new Date(`${dateText}T00:00:00`);
  return date >= startOfMonth(now) && date <= endOfMonth(now);
}

