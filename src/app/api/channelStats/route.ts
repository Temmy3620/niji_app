// src/app/api/channelStats/route.ts
import { fetchAllStats } from '@/lib/youtubeApi';
import { GROUPS_CONFIG } from '@/constants/groupsConfig';
import { NextResponse } from 'next/server';

export async function GET() {
  const results = await Promise.all(
    GROUPS_CONFIG.map(async (group) => {
      const channels = await fetchAllStats(group.key);
      return {
        key: group.key,
        data: {
          groupName: group.name,
          channels,
        }
      };
    })
  );

  return NextResponse.json(results);
}
