'use client';

import { useState, useEffect, useMemo } from 'react';
import ChannelCard from '@/components/ChannelCard';
import { loadDiffMap } from '@/lib/monthlyDiffLoader';
import { ChannelData } from '@/types/ChannelData';
import GroupTabs from "@/components/GroupTabs";
import {
  Tabs,
  TabsContent
} from "@/components/ui/tabs";
import { getCurrentMonth } from '@/lib/getCurrentMonth';

interface GroupData {
  groupName: string;
  channels: ChannelData[];
}
interface GroupDataMap {
  [groupKey: string]: GroupData;
}
interface GroupConfig {
  key: string;
  name: string;
  iconUrl: string; // Added iconUrl to GroupConfig
}

interface MonthlySubscriberTrendProps {
  allGroupData: GroupDataMap;
  groupsConfig: GroupConfig[];
  defaultGroupKey: string;
  availableDates: string[];
  defaultStats: Record<string, { subscribers: number; views: number }>;
}

export default function MonthlySubscriberTrend({ allGroupData, groupsConfig, defaultGroupKey, availableDates, defaultStats }: MonthlySubscriberTrendProps) {
  console.log('[Client] MonthlySubscriberTrend Rendering. Groups:', groupsConfig.map(g => g.name));

  const [selectedGroupKey, setSelectedGroupKey] = useState(defaultGroupKey);
  const [selectedDate, setSelectedDate] = useState(getCurrentMonth());
  const [diffMap, setDiffMap] = useState<Record<string, { subscriberDiff: number; viewDiff: number }>>({});

  useEffect(() => {
    const currentMonth = getCurrentMonth();
    if (selectedDate !== currentMonth) {
      loadDiffMap(selectedDate).then(setDiffMap);
    } else {
      setDiffMap({});
    }
  }, [selectedDate]);

  const getSortedData = (groupKey: string): ChannelData[] => {
    const channels = allGroupData[groupKey]?.channels || [];
    const currentMonth = getCurrentMonth();

    return [...channels]
      .map(channel => {
        let subscriberDiff = 0;
        let viewDiff = 0;

        if (selectedDate === currentMonth) {
          const base = defaultStats[channel.id];
          subscriberDiff = base ? Number(channel.subscribers) - Number(base.subscribers) : 0;
          viewDiff = base ? Number(channel.views) - Number(base.views) : 0;
        } else {
          const diff = diffMap[channel.id];
          subscriberDiff = diff?.subscriberDiff ?? 0;
          viewDiff = diff?.viewDiff ?? 0;
        }

        return {
          ...channel,
          subscriberDiff,
          viewDiff,
        };
      })
      .sort((a, b) => b.subscriberDiff - a.subscriberDiff);
  };

  const memoizedSortedChannels = useMemo(() => {
    const result: Record<string, ChannelData[]> = {};
    groupsConfig.forEach(group => {
      result[group.key] = getSortedData(group.key);
    });
    return result;
  }, [allGroupData, diffMap, groupsConfig]);

  if (!groupsConfig || groupsConfig.length === 0) {
    return <main className="p-6"><p className="text-white text-center">表示可能なグループがありません。</p></main>;
  }

  return (
    <main className="p-4 md:p-6">
      <Tabs value={selectedGroupKey} onValueChange={setSelectedGroupKey} className="w-full">
        <div className="flex justify-start items-center mb-4 gap-4 flex-wrap">
          <GroupTabs groupsConfig={groupsConfig} selectedGroupKey={selectedGroupKey} />
          <div className="ml-auto">
            <div className="flex items-center justify-center gap-2 text-white text-lg font-semibold">
              <button
                onClick={() => {
                  const idx = availableDates.indexOf(selectedDate);
                  if (idx > 0) setSelectedDate(availableDates[idx - 1]);
                }}
                disabled={availableDates.indexOf(selectedDate) === 0}
                className={`w-10 h-10 flex items-center justify-center rounded-lg shadow-md transition-all duration-150
                  ${availableDates.indexOf(selectedDate) === 0 ? 'bg-gray-800 border border-gray-500 text-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-purple-700'}
                `}
              >
                ←
              </button>

              <span className="px-4 py-1 bg-muted text-muted-foreground border border-border rounded-md shadow-sm">
                {selectedDate}
              </span>

              <button
                onClick={() => {
                  const idx = availableDates.indexOf(selectedDate);
                  if (idx < availableDates.length - 1) setSelectedDate(availableDates[idx + 1]);
                }}
                disabled={availableDates.indexOf(selectedDate) === availableDates.length - 1}
                className={`w-10 h-10 flex items-center justify-center rounded-lg shadow-md transition-all duration-150
                  ${availableDates.indexOf(selectedDate) === availableDates.length - 1 ? 'bg-gray-800 border border-gray-500 text-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-purple-700'}
                `}
              >
                →
              </button>
            </div>
          </div>
        </div>

        {groupsConfig.map((group) => {
          const sortedChannels = memoizedSortedChannels[group.key];
          console.log(`[Client] Rendering content for "${group.key}". Channels: ${sortedChannels.length}`);

          return (
            <TabsContent key={group.key} value={group.key} className="mt-4 focus-visible:ring-0 focus-visible:ring-offset-0">
              {sortedChannels.length > 0 ? (
                <div className="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))]">
                  {sortedChannels.map((channel, index) => (
                    <ChannelCard key={channel.id} channel={channel} currentTab="subscribers" rank={index} />
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
