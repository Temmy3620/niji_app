// src/lib/getAvailableDates.ts
import fs from 'fs';
import path from 'path';

import { ChannelData } from '@/types/ChannelData';
import { copyStatsToTmp } from './copyStatsToTmp';

const TMP_FILE_PATH = path.join('/tmp', 'last_successful_stats.json');
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
  try {
    fs.writeFileSync(TMP_FILE_PATH, JSON.stringify(channelData, null, 2));
    console.log(`[Save] チャンネルデータを一時保存しました: ${TMP_FILE_PATH}`);

    copyStatsToTmp();
  } catch (error) {
    console.error(`[saveStatsToFile] 書き込みエラー:`, error);
  }
}

export function getStatsById(id: string): { subscribers: number; views: number } | null {
  try {
    const fileContent = fs.readFileSync(TMP_FILE_PATH, 'utf-8');
    const json = JSON.parse(fileContent);
    console.log(TMP_FILE_PATH);
    for (const entry of Object.values(json) as StatsEntry[]) {
      if (entry.id === id) {
        console.log(`[getStatsById] データを取得しました: ${entry}`);
        return {
          subscribers: Number(entry.subscribers),
          views: Number(entry.views),
        };
      }
    }

    return null;
  } catch (error) {
    console.error(`[getStatsById] 読み込み/解析エラー:`, error);
    return null;
  }
}
