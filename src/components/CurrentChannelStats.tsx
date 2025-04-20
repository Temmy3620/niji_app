'use client';

import { useState, useMemo } from 'react';
import ChannelCard from '@/components/ChannelCard';
import { ChannelData } from '@/types/ChannelData';
import GroupTabs from "@/components/GroupTabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent
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

interface CurrentChannelStatsProps {
  allGroupData: GroupDataMap;
  groupsConfig: GroupConfig[];
  defaultGroupKey: string;
}

type SortByType = 'subscribers' | 'views';
interface SortState {
  [groupKey: string]: SortByType;
}

export default function CurrentChannelStats({ allGroupData, groupsConfig, defaultGroupKey }: CurrentChannelStatsProps) {
  console.log('[Client] CurrentChannelStats Rendering. Groups:', groupsConfig.map(g => g.name));

  const initialSortState: SortState = groupsConfig.reduce((acc, group) => {
    acc[group.key] = 'subscribers';
    return acc;
  }, {} as SortState);
  const [sortState, setSortState] = useState<SortState>(initialSortState);
  const [selectedGroupKey, setSelectedGroupKey] = useState(defaultGroupKey);

  const getSortedData = (groupKey: string): ChannelData[] => {
    const channels = allGroupData[groupKey]?.channels || [];
    const sortBy = sortState[groupKey] || 'subscribers';
    console.log(`[Client] Sorting group "${groupKey}" by "${sortBy}"`);
    return [...channels].sort((a, b) => {
      const valA = sortBy === 'subscribers' && a.subscribers === '非公開' ? -1 : (Number(a[sortBy]) || 0);
      const valB = sortBy === 'subscribers' && b.subscribers === '非公開' ? -1 : (Number(b[sortBy]) || 0);
      return valB - valA;
    });
  };

  const handleSortChange = (groupKey: string, value: string) => {
    console.log(`[Client] Sort changed for "${groupKey}" to "${value}"`);
    setSortState(prev => ({ ...prev, [groupKey]: value as SortByType }));
  };

  const memoizedSortedChannels = useMemo(() => {
    const result: Record<string, ChannelData[]> = {};
    groupsConfig.forEach(group => {
      result[group.key] = getSortedData(group.key);
    });
    return result;
  }, [allGroupData, sortState, groupsConfig]);

  if (!groupsConfig || groupsConfig.length === 0) {
    return <main className="p-6"><p className="text-white text-center">表示可能なグループがありません。</p></main>;
  }

  return (
    <main className="p-4 md:p-6">
      <Tabs value={selectedGroupKey} onValueChange={setSelectedGroupKey} className="w-full">
        <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
          <GroupTabs groupsConfig={groupsConfig} selectedGroupKey={selectedGroupKey} />

          <Select
            onValueChange={(value) => handleSortChange(selectedGroupKey, value)}
            value={sortState[selectedGroupKey] || 'subscribers'}
          >
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white text-sm">
              <SelectValue placeholder="並び替え" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-gray-700">
              <SelectGroup>
                <SelectItem value="subscribers" className="cursor-pointer hover:bg-indigo-700 text-sm">登録者数順</SelectItem>
                <SelectItem value="views" className="cursor-pointer hover:bg-indigo-700 text-sm">総再生数順</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {groupsConfig.map((group) => {
          const sortedChannels = memoizedSortedChannels[group.key];
          console.log(`[Client] Rendering content for "${group.key}". Channels: ${sortedChannels.length}`);

          return (
            <TabsContent key={group.key} value={group.key} className="mt-4 focus-visible:ring-0 focus-visible:ring-offset-0">
              {sortedChannels.length > 0 ? (
                <div className="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))]">
                  {sortedChannels.map((channel, index) => (
                    <ChannelCard key={channel.id} channel={channel} currentTab="current" rank={index} />
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
