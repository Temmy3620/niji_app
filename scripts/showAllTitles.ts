import 'dotenv/config';

import { fetchAllStats } from '@/lib/youtubeApi';
import { channelIds } from '@/constants/channelIds';

async function showAllChannelTitles() {
  const allGroupKeys = Object.keys(channelIds) as (keyof typeof channelIds)[];
  //const allGroupKeys: (keyof typeof channelIds)[] = ['nijisanji'];

  for (const groupKey of allGroupKeys) {
    //console.log(`\n--- ${groupKey.toUpperCase()} ---`);

    try {
      const stats = await fetchAllStats(groupKey);
      for (const channel of stats) {
        const urlPath = encodeURIComponent(channel.title);
        const fs = await import('fs/promises');
        const path = await import('path');

        const outputDir = path.resolve('data/memo');
        const outputPath = path.join(outputDir, 'titles.txt');

        await fs.mkdir(outputDir, { recursive: true });
        const url = `https://vtubertracker.info/card/${urlPath}`;
        await fs.appendFile(outputPath, `<url><loc>${url}</loc></url>\n`, 'utf8');
      }
    } catch (err) {
      console.error(`エラー: ${groupKey}`, err);
    }
  }
}

showAllChannelTitles();
