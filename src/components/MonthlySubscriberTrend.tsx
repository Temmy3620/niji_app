'use client';

import { useState, useEffect } from 'react';
import ChannelCard from '@/components/ChannelCard';
import { loadDiffMap } from '@/lib/monthlyDiffLoader';
import { ChannelData } from '@/types/ChannelData';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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
}

type SortByType = 'subscriberDiff';
interface SortState {
  [groupKey: string]: SortByType;
}

export default function MonthlySubscriberTrend({ allGroupData, groupsConfig, defaultGroupKey }: MonthlySubscriberTrendProps) {
  console.log('[Client] MonthlySubscriberTrend Rendering. Groups:', groupsConfig.map(g => g.name));

  const initialSortState: SortState = groupsConfig.reduce((acc, group) => {
    acc[group.key] = 'subscriberDiff';
    return acc;
  }, {} as SortState);
  const [sortState, setSortState] = useState<SortState>(initialSortState);
  const [selectedGroupKey, setSelectedGroupKey] = useState(defaultGroupKey);
  const [selectedDate, setSelectedDate] = useState('2025-04');
  const availableDates = ['2025-04', '2025-03'];
  const [diffMap, setDiffMap] = useState<Record<string, { subscriberDiff: number; viewDiff: number }>>({});

  useEffect(() => {
    loadDiffMap(selectedDate).then(setDiffMap);
  }, [selectedDate]);

  const getSortedData = (groupKey: string): ChannelData[] => {
    const channels = allGroupData[groupKey]?.channels || [];
    const sortBy = sortState[groupKey] || 'subscribers';

    return [...channels]
      .map(channel => {
        const diff = diffMap[channel.id];
        return {
          ...channel,
          subscriberDiff: diff?.subscriberDiff ?? 0,
          viewDiff: diff?.viewDiff ?? 0,
        };
      })
      .sort((a, b) => {
        const sortByValue = (ch: ChannelData) => ch.subscriberDiff ?? 0;
        return sortByValue(b) - sortByValue(a);
      });
  };

  if (!groupsConfig || groupsConfig.length === 0) {
    return <main className="p-6"><p className="text-white text-center">表示可能なグループがありません。</p></main>;
  }

  return (
    <main className="p-4 md:p-6">
      <Tabs value={selectedGroupKey} onValueChange={setSelectedGroupKey} className="w-full">
        <div className="flex justify-start items-center mb-4 gap-4 flex-wrap">
          <TabsList className="flex gap-4">
            {groupsConfig.map((group) => (
              <TabsTrigger
                key={group.key}
                value={group.key}
                className={`relative bg-white w-12 h-12 border-2 rounded-full overflow-hidden ${group.key === selectedGroupKey
                  ? 'border-indigo-500'
                  : 'border-transparent opacity-50 hover:opacity-100'
                  } transition-all`}
              >
                <div className="bg-white rounded-full">
                  <img
                    src={group.iconUrl}
                    alt={group.name}
                    className="object-cover w-full h-full scale-[1.5] rounded-full"
                  />
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="ml-auto text-white">
            <button
              onClick={() => {
                const idx = availableDates.indexOf(selectedDate);
                if (idx > 0) setSelectedDate(availableDates[idx - 1]);
              }}
              disabled={availableDates.indexOf(selectedDate) === 0}
              className="px-2 py-1 bg-gray-700 rounded disabled:opacity-50"
            >
              ←
            </button>
            <span className="text-lg">{selectedDate}</span>
            <button
              onClick={() => {
                const idx = availableDates.indexOf(selectedDate);
                if (idx < availableDates.length - 1) setSelectedDate(availableDates[idx + 1]);
              }}
              disabled={availableDates.indexOf(selectedDate) === availableDates.length - 1}
              className="px-2 py-1 bg-gray-700 rounded disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>

        {groupsConfig.map((group) => {
          const sortedChannels = getSortedData(group.key);
          console.log(`[Client] Rendering content for "${group.key}". Channels: ${sortedChannels.length}`);

          return (
            <TabsContent key={group.key} value={group.key} className="mt-4 focus-visible:ring-0 focus-visible:ring-offset-0">
              {sortedChannels.length > 0 ? (
                <div className="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))]">
                  {sortedChannels.map((channel) => (
                    <ChannelCard key={channel.id} channel={channel} currentTab="subscribers" />
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
