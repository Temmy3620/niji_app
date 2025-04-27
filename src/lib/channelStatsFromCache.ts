import { channelIds, GroupKey } from '@/constants/channelIds';
import { ChannelData } from '@/types/ChannelData';
import { getStatsByIdFromR2 } from '@/lib/fileStatsUtils';

export async function fetchAllStats(groupId: GroupKey): Promise<ChannelData[]> {
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

  console.log(`[R2] グループ "${groupId}" の ${targetChannelIds.length} 件のキャッシュデータ取得開始`);

  const allChannelData = await Promise.all(
    targetChannelIds.map(async (id) => {
      const cached = await getStatsByIdFromR2(id);
      if (cached) {
        return {
          id,
          title: 'タイトル不明',
          thumbnail: '/placeholder.png',
          subscribers: String(cached.subscribers ?? '0'),
          views: String(cached.views ?? '0'),
        } as ChannelData;
      } else {
        console.warn(`[R2] ID "${id}" のキャッシュが見つかりません`);
        return null;
      }
    })
  );

  const validChannelData = allChannelData.filter((data): data is ChannelData => data !== null);

  console.log(`[R2] グループ "${groupId}" のキャッシュ取得完了 (${validChannelData.length}/${targetChannelIds.length} 件成功)`);
  return validChannelData;
}
