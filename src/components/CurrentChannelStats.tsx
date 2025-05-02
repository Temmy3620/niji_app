'use client';

import { useState } from 'react';
import { ChannelData } from '@/types/ChannelData';
import ChannelListWithTabs from '@/components/ChannelListWithTabs';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MonthlyTrendPropsBase } from '@/types/MonthlyTrend';

interface CurrentChannelStatsProps extends Pick<MonthlyTrendPropsBase, 'allGroupData' | 'groupsConfig' | 'selectedGroupKey' | 'setSelectedGroupKey'> { }

type SortByType = 'subscribers' | 'views';
interface SortState {
  [groupKey: string]: SortByType;
}

export default function CurrentChannelStats({
  allGroupData,
  groupsConfig,
  selectedGroupKey,
  setSelectedGroupKey,
}: CurrentChannelStatsProps) {
  const initialSortState: SortState = groupsConfig.reduce((acc, group) => {
    acc[group.key] = 'subscribers';
    return acc;
  }, {} as SortState);

  const [sortState, setSortState] = useState<SortState>(initialSortState);

  const getSortedData = (groupKey: string): ChannelData[] => {
    const channels = allGroupData[groupKey]?.channels || [];
    const sortBy = sortState[groupKey] || 'subscribers';
    return [...channels].sort((a, b) => {
      const valA = sortBy === 'subscribers' && a.subscribers === '非公開' ? -1 : (Number(a[sortBy]) || 0);
      const valB = sortBy === 'subscribers' && b.subscribers === '非公開' ? -1 : (Number(b[sortBy]) || 0);
      return valB - valA;
    });
  };

  const handleSortChange = (groupKey: string, value: string) => {
    setSortState(prev => ({ ...prev, [groupKey]: value as SortByType }));
  };

  const headerRight = (
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
  );

  return (
    <ChannelListWithTabs
      groupsConfig={groupsConfig}
      selectedGroupKey={selectedGroupKey}
      setSelectedGroupKey={setSelectedGroupKey}
      getSortedData={getSortedData}
      sortKey="current"
      headerRight={headerRight}
    />
  );
}
