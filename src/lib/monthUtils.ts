export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 0-indexed
  return `${year}-${month}`;
  //return '2025-05';
}

export function getPreviousMonth(currentMonth: string): string {
  const [year, month] = currentMonth.split('-').map(Number);

  const date = new Date(year, month - 2); // JavaScriptは0月始まりなので -2 にする
  const prevYear = date.getFullYear();
  const prevMonth = String(date.getMonth() + 1).padStart(2, '0');

  return `${prevYear}-${prevMonth}`;
}
