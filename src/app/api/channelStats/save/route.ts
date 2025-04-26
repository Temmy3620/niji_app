// src/app/api/channelStats/save/route.ts
import { fetchAllStats } from '@/lib/youtubeApi';
import { saveStatsToR2 } from '@/lib/fileStatsUtils';
import { GROUPS_CONFIG } from '@/constants/groupsConfig';
import { NextResponse } from 'next/server';

export async function GET() {
  const results = await Promise.all(
    GROUPS_CONFIG.map(async (group) => {
      try {
        const channels = await fetchAllStats(group.key);
        return {
          key: group.key,
          data: {
            groupName: group.name,
            channels,
          }
        };
      } catch (error) {
        console.error(`Failed to fetch stats for group ${group.key}:`, error);
        return {
          key: group.key,
          data: {
            groupName: group.name,
            channels: [], // Fallback to an empty array
          }
        };
      }
    })
  );

  const allChannelData = results.flatMap(result => result.data.channels);

  await saveStatsToR2(allChannelData);
  console.log('[Save] Cloudflare R2にチャンネルデータを保存しました');

  return NextResponse.json({ message: 'チャンネルデータを保存しました', totalChannels: allChannelData.length });
}
