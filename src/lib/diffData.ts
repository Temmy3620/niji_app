interface ChannelDiffRaw {
  id: string;
  subscriberDiff?: number;
  viewDiff?: number;
}
import path from 'path';
import fs from 'fs/promises';

export interface ChannelDiff {
  channelId: string;
  subscriberDiff: number;
  viewDiff: number;
}

export async function getChannelDiffByMonth(channelId: string, month: string, groupKey: string): Promise<ChannelDiff | null> {
  try {
    const filePath = path.join(process.cwd(), 'data/youtube_diffs', `${month}_diff.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    console.log(`Reading file: ${fileContent}`);
    const jsonData = JSON.parse(fileContent);
    const nijisanjiData = jsonData[groupKey];
    const found = (nijisanjiData as ChannelDiffRaw[]).find((item) => item.id === channelId);
    if (!found) return null;
    return {
      channelId,
      subscriberDiff: found.subscriberDiff ?? 0,
      viewDiff: found.viewDiff ?? 0,
    };
  } catch (error) {
    console.error(`Failed to load data for ${month}:`, error);
    return null;
  }
}
