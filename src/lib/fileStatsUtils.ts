// src/lib/getAvailableDates.ts
import fs from 'fs';
import path from 'path';

import { ChannelData } from '@/types/ChannelData';

interface StatsEntry {
  id: string;
  subscribers: number;
  views: number;
}

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

export function saveStatsToFile(channelData: ChannelData[]) {
  const filePath = path.join(process.cwd(), 'data', 'cache', 'last_successful_stats.json');
  const dirPath = path.dirname(filePath);

  // ディレクトリがなければ作成
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // 上書き保存
  fs.writeFileSync(filePath, JSON.stringify(channelData, null, 2));
  console.log(`[Save] チャンネルデータを保存しました: ${filePath}`);
}

export function getStatsById(id: string): { subscribers: number; views: number } | null {
  const filePath = path.join(process.cwd(), 'data', 'cache', 'last_successful_stats.json');

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(fileContent);

    for (const entry of Object.values(json) as StatsEntry[]) {
      if (entry.id == id) {
        return {
          subscribers: Number(entry.subscribers),
          views: Number(entry.views),
        };
      }
    }

    return null;
  } catch (error) {
    console.error(`[getStatsById] Error reading or parsing file:`, error);
    return null;
  }
}
