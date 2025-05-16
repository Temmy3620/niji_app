import 'dotenv/config';


import fs from 'fs';
import path from 'path';
import { fetchAllStats } from '@/lib/youtubeApi';
import { GROUPS_CONFIG } from '@/constants/groupsConfig';
import { ChannelData } from '@/types/ChannelData';

const BASE_DATE = '2025-05-01_0130';
const BASE_PATH = path.resolve(__dirname, `../data/youtube_stats/${BASE_DATE}.json`);

async function main() {
  const baseJson: Record<string, ChannelData[]> = JSON.parse(fs.readFileSync(BASE_PATH, 'utf-8'));

  for (const group of GROUPS_CONFIG) {

    const currentStats = await fetchAllStats(group.key);
    const baseStats = baseJson[group.key] || [];

    const diffs = currentStats.map(channel => {
      const base = baseStats.find(c => c.id === channel.id);
      const baseSubs = base ? Number(base.subscribers) : 0;
      const baseViews = base ? Number(base.views) : 0;
      const currentSubs = Number(channel.subscribers);
      const currentViews = Number(channel.views);

      return {
        id: channel.id,
        title: channel.title,
        subscriberDiff: currentSubs - baseSubs,
        viewDiff: currentViews - baseViews,
      };
    });

    const topSubs = [...diffs].sort((a, b) => b.subscriberDiff - a.subscriberDiff).slice(0, 10);
    const topViews = [...diffs].sort((a, b) => b.viewDiff - a.viewDiff).slice(0, 10);

    console.log(`\n【5月前半の伸び】${group.name}登録・再生増加数TOP5\n`);

    //console.log(`【5月前半集計】${group.name}登録者数増加 TOP5`);
    console.log(`登録者数増加 TOP5`);
    let currentRank = 1;
    let prevValue: number | null = null;
    topSubs.forEach((d, i) => {
      if (prevValue !== null && d.subscriberDiff !== prevValue) {
        currentRank = i + 1;
      }
      prevValue = d.subscriberDiff;
      console.log(`${currentRank}位：${d.title}: +${d.subscriberDiff.toLocaleString()}`);
    });

    //console.log(`\n【5月前半集計】${group.name}再生数増加 TOP5`);
    console.log(`\n再生数増加 TOP5`);
    currentRank = 1;
    prevValue = null;
    topViews.forEach((d, i) => {
      if (prevValue !== null && d.viewDiff !== prevValue) {
        currentRank = i + 1;
      }
      prevValue = d.viewDiff;
      console.log(`${currentRank}位：${d.title}: +${d.viewDiff.toLocaleString()}`);
    });

    console.log(`\nhttps://vtubertracker.info/subscribers/${group.key}#rankings\n`);
    console.log(`\nhttps://vtubertracker.info/views/${group.key}#rankings\n`);
  }
}

main().catch(console.error);
