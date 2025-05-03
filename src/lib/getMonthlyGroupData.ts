import fs from 'fs';
import path from 'path';
import { GroupStats } from '@/types/MonthlyTrend';

export function getMonthlyGroupData(groupKey: string): GroupStats[] {
  const dir = path.join(process.cwd(), 'data/monthly_summaries');
  const files = fs.readdirSync(dir)
    .filter(file => file.endsWith('_summary.json'))
    .sort(); // 時系列順にソート

  const result: GroupStats[] = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);

    if (!data[groupKey]) continue;

    const month = file.replace('_summary.json', '');
    result.push({
      ...data[groupKey],
      month
    });
  }

  return result;
}
