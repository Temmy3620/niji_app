import { fetchAllStats } from '@/lib/youtubeApi';
import { GroupKey } from '@/constants/channelIds';
import MonthlyViewTrend from '@/components/MonthlyViewTrend';
import { ChannelData } from '@/types/ChannelData';

const GROUPS_CONFIG: { key: GroupKey; name: string; iconUrl: string }[] = [
  {
    key: 'nijisanji',
    name: 'にじさんじ',
    iconUrl: 'https://yt3.ggpht.com/ytc/AIdro_mSA0LOwiWKqjaCpsUIs2KT-yvAC4-Xv9RNZ8Zc6n0NPrc=s88-c-k-c0x00ffffff-no-rj',
  },
  {
    key: 'hololive',
    name: 'ホロライブ',
    iconUrl: 'https://yt3.ggpht.com/aDD5WjpOtpuZO8QLEVnDI5pX-fjUNcKo5XM0gTpMvWlCxwG5dowWHAUhaooKl7nCstEM_-87=s88-c-k-c0x00ffffff-no-rj',
  },
  {
    key: 'vspo',
    name: 'ぶいすぽっ！',
    iconUrl: 'https://yt3.ggpht.com/YxkHbTBTSYsQjMHOp269eQUReXvJsTfM9gTEeByvNDGl97N6fqatLGRMZnHx-RIA_oPikX-e=s240-c-k-c0x00ffffff-no-rj',
  },
  {
    key: 'aogiri',
    name: 'あおぎり高校',
    iconUrl: 'https://yt3.ggpht.com/dDxwoOXbmmqwlnt8MMon3wPQdy5pX-vt-x8Eyqf38Yk8Zi2CIbJDXpzkA2YxZ1yUeOUhkweqYg=s88-c-k-c0x00ffffff-no-rj',
  }
];

export interface GroupData {
  groupName: string;
  channels: ChannelData[];
}
export interface GroupDataMap {
  [groupKey: string]: GroupData;
}

export default async function MonthlyViews() {
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
    <MonthlyViewTrend
      allGroupData={allGroupData}
      groupsConfig={GROUPS_CONFIG}
      defaultGroupKey={defaultGroupKey}
    />
  );
}
