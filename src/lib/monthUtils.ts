export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 0-indexed
  return `${year}-${month}`;
  //return '2025-05';
}

export function getTwoMonthsAgo(currentMonth: string): string {
  const [year, month] = currentMonth.split('-').map(Number);

  const date = new Date(year, month - 3); // 2ヶ月前 → -3（JSは0月始まり）
  const prevYear = date.getFullYear();
  const prevMonth = String(date.getMonth() + 1).padStart(2, '0');

  return `${prevYear}-${prevMonth}`;
}

export function getLatestMonth(dates: string[]): string | null {
  if (dates.length === 0) return null;
  return [...dates].sort((a, b) => b.localeCompare(a))[0];
}
