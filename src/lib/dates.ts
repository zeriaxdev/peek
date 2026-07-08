const DAY = 86_400_000;

/** Whole days from local midnight-today to the given YYYY-MM-DD (negative = past). */
export function daysLeft(date: string, now = new Date()): number {
  const target = new Date(`${date}T00:00:00`);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / DAY);
}

/** "today" | "1 day" | "3 days" | "past" */
export function deadlineLabel(days: number): string {
  if (days < 0) return "past";
  if (days === 0) return "today";
  if (days === 1) return "1 day";
  return `${days} days`;
}
