'use client';

import { Tabs, TabsContent } from '@/components/ui/tabs';
import GroupTabs from '@/components/GroupTabs';
import ChannelCard from '@/components/ChannelCard';
import TotalStatsPanel from '@/components/TotalStatsPanel';
import SubscriberGrowthPanel from '@/components/SubscriberGrowthPanel';
import ViewGrowthPanel from '@/components/ViewGrowthPanel';
import { ChannelData } from '@/types/ChannelData';
import { GroupConfig, GroupStats } from '@/types/MonthlyTrend';

interface ChannelListWithTabsProps {
  groupsConfig: GroupConfig[];
  selectedGroupKey: string;
  setSelectedGroupKey: (key: string) => void;
  getSortedData: (groupKey: string) => ChannelData[];
  sortKey: 'subscribers' | 'views' | 'current';
  headerRight?: React.ReactNode;
  monthlyStatsMap: Record<string, GroupStats[]>;
  selectedDate: string; // ← add this line
}

export default function ChannelListWithTabs({
  groupsConfig,
  selectedGroupKey,
  setSelectedGroupKey,
  getSortedData,
  sortKey,
  headerRight,
  monthlyStatsMap,
  selectedDate, // ← add this line
}: ChannelListWithTabsProps) {
  return (
    <main className="p-4 md:p-6">
      <Tabs value={selectedGroupKey} onValueChange={setSelectedGroupKey} className="w-full">
        <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
          <GroupTabs groupsConfig={groupsConfig} selectedGroupKey={selectedGroupKey} />
          {headerRight && <div className="ml-auto">{headerRight}</div>}
        </div>
        <div className='mt-4'>
          {sortKey === 'current' && (
            <TotalStatsPanel groupKey={selectedGroupKey} allGroupData={Object.fromEntries(
              groupsConfig.map(group => [group.key, { groupName: group.name, channels: getSortedData(group.key) }]),
            )} />
          )}

          {sortKey === 'subscribers' && (
            <SubscriberGrowthPanel groupKey={selectedGroupKey} monthlyStats={monthlyStatsMap[selectedGroupKey]} selectedDate={selectedDate} />
          )}

          {sortKey === 'views' && (
            <ViewGrowthPanel groupKey={selectedGroupKey} monthlyStats={monthlyStatsMap[selectedGroupKey]} selectedDate={selectedDate} />
          )}
        </div>

        {groupsConfig.map((group) => {
          const sortedChannels = getSortedData(group.key);

          return (
            <TabsContent key={group.key} value={group.key} className="mt-4 focus-visible:ring-0 focus-visible:ring-offset-0">
              <h2 id="rankings" className="text-xl font-bold mb-4 flex items-center gap-2">
                <a href="#rankings" className="text-blue-300 hover:text-blue-400 opacity-50 hover:opacity-100 transition" title="このセクションへのリンク">
                  🔗
                </a>
                ランキング（チャンネルごと）
              </h2>
              {sortedChannels.length > 0 ? (
                <div className="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))]">
                  {sortedChannels.map((channel, index) => (
                    <ChannelCard
                      key={channel.id}
                      channel={channel}
                      currentTab={sortKey}
                      rank={index}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 mt-8">
                  チャンネルデータが見つかりません。
                </p>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </main>
  );
}
