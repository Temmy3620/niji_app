'use server';

import { fetchAllStats } from '@/lib/youtubeApi';
import { GROUPS_CONFIG } from '@/constants/groupsConfig';

export async function fetchChannelStats() {
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
            channels: [], // fallback
          }
        };
      }
    })
  );
  return results;
}
