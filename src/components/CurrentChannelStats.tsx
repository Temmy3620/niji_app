'use client';

import { useState, useMemo } from 'react';
import ChannelCard from '@/components/ChannelCard';
import { ChannelData } from '@/types/ChannelData';
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

  if (!groupsConfig || groupsConfig.length === 0) {
    return <main className="p-6"><p className="text-white text-center">表示可能なグループがありません。</p></main>;
  }

  return (
    <main className="p-4 md:p-6">
      <Tabs value={selectedGroupKey} onValueChange={setSelectedGroupKey} className="w-full">
        <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
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
                <div className="p-0.5 bg-white rounded-full w-full h-full">
                  <img
                    src={group.iconUrl}
                    alt={group.name}
                    className="object-cover w-full h-full scale-[1.3] rounded-full"
                  />
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

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
          const sortedChannels = useMemo(
            () => getSortedData(group.key),
            [allGroupData[group.key]?.channels, sortState[group.key]]
          );
          console.log(`[Client] Rendering content for "${group.key}". Channels: ${sortedChannels.length}`);

          return (
            <TabsContent key={group.key} value={group.key} className="mt-4 focus-visible:ring-0 focus-visible:ring-offset-0">
              {sortedChannels.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedChannels.map((channel) => (
                    <ChannelCard key={channel.id} channel={channel} />
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
