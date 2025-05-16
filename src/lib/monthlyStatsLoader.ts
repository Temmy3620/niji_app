import fs from 'fs';
import path from 'path';

export async function loadStatsJsonByPrefix(datePrefix: string): Promise<Record<string, { subscribers: number; views: number; videoCount: number }>> {
  const statsDir = path.join(process.cwd(), 'data', 'youtube_stats');

  try {
    const files = await fs.promises.readdir(statsDir);
    const matchedFile = files.find(file => file.startsWith(`${datePrefix}`) && file.endsWith('.json'));

    if (!matchedFile) {
      console.warn(`[loadStatsJsonByPrefix] ${datePrefix}_*.json が見つかりません`);
      return {};
    }

    const filePath = path.join(statsDir, matchedFile);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(fileContent);

    const result: Record<string, { subscribers: number; views: number; videoCount: number }> = {};
    Object.values(json)
      .filter(Array.isArray)
      .forEach((entries) => {
        entries.forEach(({ id, subscribers, views, videoCount }) => {
          result[id] = { subscribers, views, videoCount };
        });
      });

    return result;
  } catch (error) {
    console.error(`[loadStatsJsonByPrefix] ${datePrefix}_*.json の読み込みに失敗`, error);
    return {};
  }
}

// 新規追加: 指定したdatePrefixとchannelIdでChannelStatsを取得
export async function loadStatsByPrefixAndChannelId(
  datePrefix: string,
  channelId: string,
): Promise<{ subscribers: number; views: number; videoCount: number } | null> {
  const statsMap = await loadStatsJsonByPrefix(datePrefix);
  const stats = statsMap[channelId] || null;
  return stats;
}
