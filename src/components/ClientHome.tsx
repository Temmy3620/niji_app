'use client';

import { useState, useMemo } from 'react';
import ChannelCard from '@/components/ChannelCard';
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

type ChannelData = {
  id: string;
  title: string;
  thumbnail: string;
  subscribers: string;
  views: string;
};
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
}

interface ClientHomeProps {
  allGroupData: GroupDataMap;
  groupsConfig: GroupConfig[];
  defaultGroupKey: string;
}

type SortByType = 'subscribers' | 'views';
interface SortState {
  [groupKey: string]: SortByType;
}

export default function ClientHome({ allGroupData, groupsConfig, defaultGroupKey }: ClientHomeProps) {
  console.log('[Client] ClientHome Rendering. Groups:', groupsConfig.map(g => g.name));

  const initialSortState: SortState = groupsConfig.reduce((acc, group) => {
    acc[group.key] = 'subscribers';
    return acc;
  }, {} as SortState);
  const [sortState, setSortState] = useState<SortState>(initialSortState);

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
      <Tabs defaultValue={defaultGroupKey} className="w-full">
        <TabsList className={`grid w-full grid-cols-${Math.min(groupsConfig.length, 4)} sm:grid-cols-${Math.min(groupsConfig.length, 5)} gap-2 mb-4`}>
          {groupsConfig.map((group) => (
            <TabsTrigger
              key={group.key}
              value={group.key}
              className="data-[state=active]:shadow-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-3 py-1.5 text-sm sm:text-base" // サイズ調整
            >
              {group.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {groupsConfig.map((group) => {
          const sortedChannels = useMemo(
            () => getSortedData(group.key),
            [allGroupData[group.key]?.channels, sortState[group.key]]
          );
          console.log(`[Client] Rendering content for "${group.key}". Channels: ${sortedChannels.length}`);

          return (
            <TabsContent key={group.key} value={group.key} className="mt-4 focus-visible:ring-0 focus-visible:ring-offset-0">
              <div className="mb-4 flex justify-end">
                <Select
                  onValueChange={(value) => handleSortChange(group.key, value)}
                  value={sortState[group.key] || 'subscribers'}
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
