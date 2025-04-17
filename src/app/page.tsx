import { fetchAllStats, ChannelData } from '@/lib/youtubeApi';
import CurrentChannelStats from '@/components/CurrentChannelStats';
import { GROUPS_CONFIG } from '@/constants/groupsConfig';

export interface GroupData {
  groupName: string;
  channels: ChannelData[];
}
export interface GroupDataMap {
  [groupKey: string]: GroupData;
}

export default async function Home() {
  console.log('[Server] Home Component: データ取得開始');

  const groupDataPromises = GROUPS_CONFIG.map(async (group) => {
    console.log(`[Server] ${group.name} のデータを取得中...`);
    try {
      const channels = await fetchAllStats(group.key);
      console.log(`[Server] ${group.name} のデータ取得完了 (${channels.length} 件)`);
      return {
        key: group.key,
        data: {
          groupName: group.name,
          channels: channels,
        }
      };
    } catch (error) {
      console.error(`[Server] ${group.name} のデータ取得に失敗しました:`, error);
      // エラーが発生した場合でも、ページのレンダリングは継続できるよう空のデータを返す
      return {
        key: group.key,
        data: {
          groupName: group.name,
          channels: [],
        }
      };
    }
  });

  const results = await Promise.all(groupDataPromises);

  const allGroupData: GroupDataMap = results.reduce((acc, result) => {
    acc[result.key] = result.data;
    return acc;
  }, {} as GroupDataMap);

  const defaultGroupKey = GROUPS_CONFIG.length > 0 ? GROUPS_CONFIG[0].key : '';
  console.log(`[Server] ClientHome にデータを渡します。デフォルトタブ: ${defaultGroupKey}`);

  return (
    <CurrentChannelStats
      allGroupData={allGroupData}
      groupsConfig={GROUPS_CONFIG}
      defaultGroupKey={defaultGroupKey}
    />
  );
}
