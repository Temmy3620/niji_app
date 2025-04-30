/**
 * 📊 saveMonthlyStats.ts
 *
 * 用途:
 * - 現在の登録者数・再生数を YouTube API から取得し、
 *   `data/youtube_stats/YYYY-MM-DD_HHmm.json` に保存する
 *
 * 実行方法:
 *   npx tsx scripts/saveMonthlyStats.ts
 *
 * 他スクリプトからの利用も可能（export あり）
 */
import 'dotenv/config';
import { fetchAllStats } from '@/lib/youtubeApi';
import { GROUPS_CONFIG } from '@/constants/groupsConfig';
import fs from 'fs/promises';
import path from 'path';

export async function saveMonthlyStats(): Promise<{ outputPath: string }> {
  console.log('YOUTUBE_API_KEY =', process.env.YOUTUBE_API_KEY);
  const today = new Date();
  const timestamp = today.toISOString();
  const ym = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}_${String(today.getHours()).padStart(2, '0')}${String(today.getMinutes()).padStart(2, '0')}`;
  const outputPath = path.join('./data/youtube_stats', `${ym}.json`);

  const result: Record<string, any> = {
    __generatedAt: timestamp,
  };

  for (const group of GROUPS_CONFIG) {
    const stats = await fetchAllStats(group.key);
    result[group.key] = stats.map((c) => ({
      id: c.id,
      subscribers: parseInt(c.subscribers.replace(/[^0-9]/g, '')) || 0,
      views: parseInt(c.views.replace(/[^0-9]/g, '')) || 0,
      videoCount: parseInt(c.videoCount.replace(/[^0-9]/g, '')) || 0,
    }));
  }

  await fs.mkdir('./data/youtube_stats', { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(result, null, 2));
  console.log(`[保存完了] ${outputPath}`);

  return { outputPath };
}

saveMonthlyStats();
