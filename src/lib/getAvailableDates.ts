// src/lib/getAvailableDates.ts
import fs from 'fs';
import path from 'path';

export function getAvailableDates(): { all: string[]; new_month: string } {
  const dir = path.join(process.cwd(), 'data/youtube_diffs');
  const files = fs.readdirSync(dir);

  const sortedDates = files
    .map(file => file.replace('_diff.json', ''))
    .sort((a, b) => (a < b ? 1 : -1)); // 新しい順に並べる

  return {
    all: sortedDates,
    new_month: sortedDates[0],
  };
}
