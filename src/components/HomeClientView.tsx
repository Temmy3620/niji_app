'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChannelData } from '@/types/ChannelData';
import { AppViewTabs } from './AppViewTabs';
import CurrentChannelStats from './CurrentChannelStats';
import MonthlySubscriberTrend from './MonthlySubscriberTrend';
import MonthlyViewTrend from './MonthlyViewTrend';
import { GroupStats } from '@/types/MonthlyTrend';

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
  iconUrl: string;
}
interface Props {
  allGroupData: GroupDataMap;
  groupsConfig: GroupConfig[];
  defaultGroupKey: string;
  availableDates: string[];
  defaultStats: Record<string, { subscribers: number; views: number }>;
  defaultSelectedDate: string;
  monthlyStatsMap: Record<string, GroupStats[]>;
}

const HomeClientView = ({ allGroupData, groupsConfig, defaultGroupKey, availableDates, defaultStats, defaultSelectedDate, monthlyStatsMap }: Props) => {
  const pathname = usePathname();

  const [selectedGroupKey, setSelectedGroupKey] = useState<string>(() => {
    const parts = pathname.split('/');
    if (parts.length >= 3 && parts[2]) {
      return parts[2];
    }
    return defaultGroupKey;
  });

  const [currentTab, setCurrentTab] = useState<'current' | 'subscribers' | 'views'>(() => {
    const parts = pathname.split('/');
    const tab = parts[1] as 'current' | 'subscribers' | 'views';
    if (tab === 'current' || tab === 'subscribers' || tab === 'views') {
      return tab;
    }
    return 'current';
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      let newUrl = `/${currentTab}/${selectedGroupKey}`;
      if (currentTab !== 'current') {
        const currentParams = new URLSearchParams(window.location.search);
        const queryString = currentParams.toString();
        if (queryString) {
          newUrl += `?${queryString}`;
        }
      }
      window.history.pushState(null, '', newUrl);
    }, 0);
    return () => clearTimeout(timeout);
  }, [currentTab, selectedGroupKey]);

  return (
    <>
      <AppViewTabs currentTab={currentTab} onChange={(tab) => setCurrentTab(tab as 'current' | 'subscribers' | 'views')} />
      {currentTab === 'current' && (
        <CurrentChannelStats
          allGroupData={allGroupData}
          groupsConfig={groupsConfig}
          selectedGroupKey={selectedGroupKey}
          setSelectedGroupKey={setSelectedGroupKey}
        />
      )}
      {currentTab === 'subscribers' && (
        <MonthlySubscriberTrend
          allGroupData={allGroupData}
          groupsConfig={groupsConfig}
          availableDates={availableDates}
          defaultStats={defaultStats}
          defaultSelectedDate={defaultSelectedDate}
          selectedGroupKey={selectedGroupKey}
          setSelectedGroupKey={setSelectedGroupKey}
          monthlyStatsMap={monthlyStatsMap}
        />
      )}
      {currentTab === 'views' && (
        <MonthlyViewTrend
          allGroupData={allGroupData}
          groupsConfig={groupsConfig}
          availableDates={availableDates}
          defaultStats={defaultStats}
          defaultSelectedDate={defaultSelectedDate}
          selectedGroupKey={selectedGroupKey}
          setSelectedGroupKey={setSelectedGroupKey}
          monthlyStatsMap={monthlyStatsMap}
        />
      )}
    </>
  );
};

export default HomeClientView;
