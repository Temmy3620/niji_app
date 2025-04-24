import HomeClientView from '@/components/HomeClientView';
import { GROUPS_CONFIG } from '@/constants/groupsConfig';
import { ChannelData } from '@/types/ChannelData';
import { getAvailableDates } from '@/lib/fileStatsUtils';
import { getCurrentMonth, getTwoMonthsAgo, getLatestMonth } from '@/lib/monthUtils';
import { checkStatsFileExists } from '@/lib/getJsonfilwExist';
import { loadStatsJsonByPrefix } from '@/lib/monthlyStatsLoader';

export interface GroupData {
  groupName: string;
  channels: ChannelData[];
}
export interface GroupDataMap {
  [groupKey: string]: GroupData;
}

export default async function Home() {
  console.log('[Server] Home Component: データ取得開始');

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/channelStats`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error(`[Server] Failed to fetch channel stats: ${res.status} ${res.statusText}`);
    throw new Error('Failed to fetch channel stats');
  }
  const results: { key: string; data: GroupData }[] = await res.json();

  const allGroupData: GroupDataMap = results.reduce((acc, result) => {
    acc[result.key] = result.data;
    return acc;
  }, {} as GroupDataMap);

  const availableDatesObj = getAvailableDates();
  const defaultGroupKey = GROUPS_CONFIG.length > 0 ? GROUPS_CONFIG[0].key : '';
  const availableDates = availableDatesObj.all;
  const currentMonth = getCurrentMonth();
  // Only add currentMonth if JSON exists
  if (await checkStatsFileExists(currentMonth)) {
    availableDates.push(currentMonth);
    availableDates.sort((a, b) => b.localeCompare(a)); // Sort dates in descending order (e.g., 2025-04, 2025-03, ...)
  }
  const statsExists = await checkStatsFileExists(currentMonth);
  const selectedDate = statsExists ? currentMonth : getLatestMonth(availableDates) ?? getTwoMonthsAgo(currentMonth);
  const defaultStats = await loadStatsJsonByPrefix(selectedDate);
  console.log(`[Server] ClientHome にデータを渡します。デフォルトタブ: ${defaultGroupKey}`);

  return (
    <HomeClientView
      allGroupData={allGroupData}
      groupsConfig={GROUPS_CONFIG}
      defaultGroupKey={defaultGroupKey}
      availableDates={availableDates}
      defaultStats={defaultStats}
      defaultSelectedDate={selectedDate}
    />
  );
}
