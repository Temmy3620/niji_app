// lib/youtubeApi.ts
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;
const API_BASE = 'https://www.googleapis.com/youtube/v3/channels';

type ChannelInfo = {
  id: string;
  title: string;
  thumbnail: string;
  subscribers: string;
  views: string;
};

export async function fetchChannelStats(channelId: string): Promise<ChannelInfo | null> {
  const params = new URLSearchParams({
    part: 'snippet,statistics',
    id: channelId,
    key: YOUTUBE_API_KEY,
  });

  const res = await fetch(`${API_BASE}?${params}`);
  const json = await res.json();

  if (!json.items || json.items.length === 0) {
    console.warn(`⚠ チャンネルIDが無効、または取得失敗: ${channelId}`);
    return null;
  }

  const item = json.items[0];

  console.log(item.snippet.thumbnails.medium.url);
  return {
    id: item.id,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high.url,
    subscribers: item.statistics.subscriberCount,
    views: item.statistics.viewCount,
  };
}

import { channelIds } from '@/constants/channelIds';

export async function fetchAllStats() {
  const rawData = await Promise.all(channelIds.map(id => fetchChannelStats(id)));
  return rawData.filter((d): d is NonNullable<typeof d> => d !== null);
}
