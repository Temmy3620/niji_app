// src/app/api/channelStats/route.ts
import { fetchAllStats } from '@/lib/youtubeApi';
import { GROUPS_CONFIG } from '@/constants/groupsConfig';
import { NextResponse } from 'next/server';
import { saveStatsToR2 } from '@/lib/fileStatsUtils';

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

  // すべてのチャンネルデータを集約して保存
  const allChannelData = results.flatMap(result => result.data.channels);
  saveStatsToR2(allChannelData);
  return NextResponse.json(results);
}
