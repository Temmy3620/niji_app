import fs from 'fs';
import path from 'path';

import { saveStatsJsonToR2, loadStatsJsonFromR2 } from '@/lib/cloudflareR2Stats';
import { ChannelData } from '@/types/ChannelData';

const TMP_FILE_PATH = path.join('/tmp', 'last_successful_stats.json');
const R2_STATS_FILENAME = 'last_successful_stats.json';
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
    .sort(); // 新しい順に並べる

  return {
    all: sortedDates,
    new_month: sortedDates[0],
  };
}

export function saveStatsToFile(channelData: ChannelData[]) {
  try {
    fs.writeFileSync(TMP_FILE_PATH, JSON.stringify(channelData, null, 2));
    console.log(`[Save] チャンネルデータを一時保存しました: ${TMP_FILE_PATH}`);

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

export async function saveStatsToR2(channelData: ChannelData[]) {
  try {
    await saveStatsJsonToR2(R2_STATS_FILENAME, channelData);
    console.log(`[R2] チャンネルデータを保存しました: ${R2_STATS_FILENAME}`);
  } catch (error) {
    console.error(`[uploadStatsToR2] 保存エラー:`, error);
  }
}

export async function getStatsByIdFromR2(id: string): Promise<{ subscribers: number; views: number } | null> {
  try {
    const json = await loadStatsJsonFromR2(R2_STATS_FILENAME);
    if (!json) {
      console.warn(`[getChannelStatsById] データが存在しません`);
      return null;
    }

    for (const entry of Object.values(json) as StatsEntry[]) {
      if (entry.id === id) {
        console.log(`[getChannelStatsById] データ取得: ${entry.id}`);
        return {
          subscribers: Number(entry.subscribers),
          views: Number(entry.views),
        };
      }
    }

    return null;
  } catch (error) {
    console.error(`[getChannelStatsById] 読み込みエラー:`, error);
    return null;
  }
}
