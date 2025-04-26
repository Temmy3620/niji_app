// src/lib/youtubeApi.ts
import { channelIds, GroupKey } from '@/constants/channelIds';
import { ChannelData } from '@/types/ChannelData';
import { getStatsByIdFromR2 } from '@/lib/fileStatsUtils';

// --- YouTube APIの items 配列要素の型定義 (必要なものだけ) ---
// APIレスポンスに合わせて適宜調整してください
interface YouTubeApiChannelItem {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl?: string; // 存在しない場合がある
    publishedAt: string;
    thumbnails: {
      default?: { url: string; width?: number; height?: number; };
      medium?: { url: string; width?: number; height?: number; };
      high?: { url: string; width?: number; height?: number; };
    };
    localized?: { // 存在しない場合がある
      title: string;
      description: string;
    };
    country?: string; // 存在しない場合がある
  };
  statistics: {
    viewCount: string;
    subscriberCount?: string; // 非公開の場合など、存在しないことがある
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
}
// -------------------------------------------------------

const API_KEY = process.env.YOUTUBE_API_KEY;
const API_URL = 'https://www.googleapis.com/youtube/v3/channels';

export async function fetchAllStats(groupId: GroupKey): Promise<ChannelData[]> {
  if (!API_KEY) {
    console.error("環境変数 YOUTUBE_API_KEY が設定されていません。");
    throw new Error("YouTube API key is missing.");
  }

  const idsObject = channelIds[groupId];
  if (!idsObject) {
    console.warn(`グループキー "${groupId}" に対応するチャンネルIDが見つかりません。`);
    return [];
  }
  const targetChannelIds: string[] = Object.values(idsObject);

  if (targetChannelIds.length === 0) {
    console.warn(`グループ "${groupId}" のチャンネルIDリストが空です。`);
    return [];
  }

  console.log(`[API] グループ "${groupId}" の ${targetChannelIds.length} 件のチャンネルデータを取得開始`);

  const allChannelData: ChannelData[] = [];
  const chunkSize = 50;

  for (let i = 0; i < targetChannelIds.length; i += chunkSize) {
    const chunkIds = targetChannelIds.slice(i, i + chunkSize);
    const idsParam = chunkIds.join(',');
    const currentChunk = Math.floor(i / chunkSize) + 1;
    const totalChunks = Math.ceil(targetChannelIds.length / chunkSize);

    const params = new URLSearchParams({
      part: 'snippet,statistics',
      id: idsParam,
      key: API_KEY,
      maxResults: String(chunkSize),
    });

    try {
      console.log(`[API] Chunk ${currentChunk}/${totalChunks} を取得中 (${chunkIds.length} IDs)`);
      const response = await fetch(`${API_URL}?${params.toString()}`);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`[APIエラー] Chunk ${currentChunk}/${totalChunks}: Status ${response.status}`, errorBody);
        continue;
      }

      // APIレスポンス全体の型も定義するとより安全ですが、ここでは items に絞ります
      const data: { items?: YouTubeApiChannelItem[] } = await response.json();

      if (data.items && Array.isArray(data.items)) {
        const formattedData = (
          await Promise.all(
            data.items.map(async (item: YouTubeApiChannelItem): Promise<ChannelData | null> => {
              if (!item.id || !item.snippet || !item.statistics) {
                console.warn(`[データ警告] 不完全なデータのためスキップ (ID: ${item?.id})`);
                return null;
              }

              const thumbnail = item.snippet.thumbnails?.medium?.url
                || item.snippet.thumbnails?.default?.url
                || '/placeholder.png';

              const subscribers: string | number = item.statistics.hiddenSubscriberCount
                ? '非公開'
                : (item.statistics.subscriberCount || '0');
              let views: string | number = item.statistics.viewCount || '0';

              if (
                subscribers !== '非公開' &&
                ((typeof views === 'string' && views === '0') || (typeof views === 'number' && views === 0))
              ) {
                const cached = await getStatsByIdFromR2(item.id);
                if (cached) {
                  //今のところ登録者がかける現象は見られないので、一旦コメントアウト
                  //const validSubscribers =
                  //  typeof subscribers === 'string' ? subscribers === '0' :
                  //    typeof subscribers === 'number' ? subscribers === 0 :
                  //      false;
                  //
                  //if (validSubscribers) {
                  //  subscribers = String(cached.subscribers ?? '0');
                  //}

                  views = String(cached.views ?? '0');
                }
              }

              return {
                id: item.id,
                title: item.snippet.title || 'タイトル不明',
                thumbnail,
                subscribers,
                views,
              };
            })
          )
        ).filter((item): item is ChannelData => item !== null);

        allChannelData.push(...formattedData);
      }
    } catch (error) {
      console.error(`[ネットワークエラー] Chunk ${currentChunk}/${totalChunks}:`, error);
      continue;
    }
  }

  console.log(`[API] グループ "${groupId}" のデータ取得完了 (${allChannelData.length}/${targetChannelIds.length} 件成功)`);
  return allChannelData;
}
