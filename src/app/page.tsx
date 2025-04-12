import { fetchAllStats, ChannelData } from '@/lib/youtubeApi'; // youtubeApi.ts のパスを確認
import ClientHome from '@/components/ClientHome';
import { channelIds, GroupKey } from '@/constants/channelIds'; // channelIds.ts のパスを確認

// --- 表示したいグループの設定 ---
// key は channelIds.ts のキーと一致させる
const GROUPS_CONFIG: { key: GroupKey; name: string }[] = [
  { key: 'nijisanji', name: 'にじさんじ' },
  { key: 'hololive', name: 'ホロライブ' },
  // channelIds.ts にグループを追加したら、ここにも追加
  // { key: 'vspo', name: 'ぶいすぽっ！' },
];
// ------------------------------

// --- ClientHome に渡すデータ構造の型 ---
// (ClientHome側で定義してもOK)
export interface GroupData {
  groupName: string;
  channels: ChannelData[];
}
export interface GroupDataMap {
  [groupKey: string]: GroupData;
}
// -----------------------------------

export default async function Home() {
  console.log('[Server] Home Component: データ取得開始');

  // 全グループのデータを並行して取得
  const groupDataPromises = GROUPS_CONFIG.map(async (group) => {
    console.log(`[Server] ${group.name} のデータを取得中...`);
    try {
      // 型安全のため group.key を渡す
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

  // 結果を { groupKey: { groupName, channels } } の形式に変換
  const allGroupData: GroupDataMap = results.reduce((acc, result) => {
    acc[result.key] = result.data;
    return acc;
  }, {} as GroupDataMap);

  const defaultGroupKey = GROUPS_CONFIG.length > 0 ? GROUPS_CONFIG[0].key : '';
  console.log(`[Server] ClientHome にデータを渡します。デフォルトタブ: ${defaultGroupKey}`);

  return (
    // ClientHome に必要なデータを全て渡す
    <ClientHome
      allGroupData={allGroupData}
      groupsConfig={GROUPS_CONFIG}
      defaultGroupKey={defaultGroupKey}
    />
  );
}
