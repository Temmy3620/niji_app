'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, notFound } from 'next/navigation';
import { getCurrentMonth } from '@/lib/monthUtils';
import { loadDiffMap } from '@/lib/monthlyDiffLoader';
import { ChannelData } from '@/types/ChannelData';
import { MonthlyTrendPropsBase, GroupStats } from '@/types/MonthlyTrend';
import ChannelListWithTabs from '@/components/ChannelListWithTabs';

interface MonthlyTrendBaseProps extends MonthlyTrendPropsBase {
  sortKey: 'subscribers' | 'views';
}

export default function MonthlyTrendBase({
  allGroupData,
  groupsConfig,
  availableDates,
  defaultStats,
  defaultSelectedDate,
  selectedGroupKey,
  setSelectedGroupKey,
  sortKey,
  monthlyStatsMap
}: MonthlyTrendBaseProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlDate = searchParams.get('date');
  const [selectedDate, setSelectedDate] = useState(urlDate ?? defaultSelectedDate);

  const isInAvailableDates = availableDates.includes(selectedDate);

  // Always inject current month's diff summary into monthlyStatsMap
  const currentMonth = getCurrentMonth();
  const groupChannels = allGroupData[selectedGroupKey]?.channels || [];
  let totalSubscribers = 0;
  let totalViews = 0;
  let negativeSubscribers = 0;
  let negativeViews = 0;

  for (const channel of groupChannels) {
    const base = defaultStats[channel.id];
    const subDiff = base ? Number(channel.subscribers) - Number(base.subscribers) : 0;
    const viewDiff = base ? Number(channel.views) - Number(base.views) : 0;

    totalSubscribers += subDiff;
    totalViews += viewDiff;
  }

  const currentStats: GroupStats = {
    month: currentMonth,
    totalSubscribers,
    totalViews,
    negativeSubscribers,
    negativeViews
  };

  if (!monthlyStatsMap[selectedGroupKey]) {
    monthlyStatsMap[selectedGroupKey] = [];
  }

  if (!monthlyStatsMap[selectedGroupKey].some(stats => stats.month === currentMonth)) {
    monthlyStatsMap[selectedGroupKey].push(currentStats);
  }

  if (!isInAvailableDates) {
    notFound();
  }


  const [diffMap, setDiffMap] = useState<Record<string, { subscriberDiff: number; viewDiff: number }>>({});

  const updateSelectedDate = (newDate: string) => {
    setSelectedDate(newDate);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('date', newDate);
    router.push(`?${current.toString()}`, { scroll: false });
  };

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
        let subscriberDiff: number | null = null;
        let viewDiff: number | null = null;

        if (selectedDate === currentMonth) {
          const base = defaultStats[channel.id];
          if (base) {
            subscriberDiff = Number(channel.subscribers) - Number(base.subscribers);
            viewDiff = Number(channel.views) - Number(base.views);
          }
        } else {
          const diff = diffMap[channel.id];
          if (diff) {
            subscriberDiff = diff.subscriberDiff;
            viewDiff = diff.viewDiff;
          }
        }

        return {
          ...channel,
          subscriberDiff,
          viewDiff,
        };
      })
      .sort((a, b) =>
        sortKey === 'subscribers'
          ? (b.subscriberDiff ?? -Infinity) - (a.subscriberDiff ?? -Infinity)
          : (b.viewDiff ?? -Infinity) - (a.viewDiff ?? -Infinity)
      );
  };

  const headerRight = (
    <div className="flex items-center justify-center gap-2 text-white text-lg font-semibold">
      <button
        type="button"
        onClick={() => {
          const idx = availableDates.indexOf(selectedDate);
          if (idx > 0) updateSelectedDate(availableDates[idx - 1]);
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
        type="button"
        onClick={() => {
          const idx = availableDates.indexOf(selectedDate);
          if (idx < availableDates.length - 1) updateSelectedDate(availableDates[idx + 1]);
        }}
        disabled={availableDates.indexOf(selectedDate) === availableDates.length - 1}
        className={`w-10 h-10 flex items-center justify-center rounded-lg shadow-md transition-all duration-150
          ${availableDates.indexOf(selectedDate) === availableDates.length - 1 ? 'bg-gray-800 border border-gray-500 text-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-purple-700'}
        `}
      >
        →
      </button>
    </div>
  );

  return (
    <ChannelListWithTabs
      groupsConfig={groupsConfig}
      selectedGroupKey={selectedGroupKey}
      setSelectedGroupKey={setSelectedGroupKey}
      getSortedData={getSortedData}
      sortKey={sortKey}
      headerRight={headerRight}
      monthlyStatsMap={monthlyStatsMap}
      selectedDate={selectedDate}
    />
  );
}
