'use client';

import { useState } from 'react';
import { ChannelData } from '@/types/ChannelData';
import { AppViewTabs } from './AppViewTabs';
import CurrentChannelStats from './CurrentChannelStats';
import MonthlySubscriberTrend from './MonthlySubscriberTrend';
import MonthlyViewTrend from './MonthlyViewTrend';

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
}

const HomeClientView = ({ allGroupData, groupsConfig, defaultGroupKey, availableDates, defaultStats, defaultSelectedDate }: Props) => {
  const [currentTab, setCurrentTab] = useState<'current' | 'subscribers' | 'views'>('current');

  return (
    <>
      <AppViewTabs currentTab={currentTab} onChange={(tab) => setCurrentTab(tab as 'current' | 'subscribers' | 'views')} />
      {currentTab === 'current' && (
        <CurrentChannelStats
          allGroupData={allGroupData}
          groupsConfig={groupsConfig}
          defaultGroupKey={defaultGroupKey}
        />
      )}
      {currentTab === 'subscribers' && (
        <MonthlySubscriberTrend
          allGroupData={allGroupData}
          groupsConfig={groupsConfig}
          defaultGroupKey={defaultGroupKey}
          availableDates={availableDates}
          defaultStats={defaultStats}
          defaultSelectedDate={defaultSelectedDate}
        />
      )}
      {currentTab === 'views' && (
        <MonthlyViewTrend
          allGroupData={allGroupData}
          groupsConfig={groupsConfig}
          defaultGroupKey={defaultGroupKey}
          availableDates={availableDates}
          defaultStats={defaultStats}
          defaultSelectedDate={defaultSelectedDate}
        />
      )}
    </>
  );
};

export default HomeClientView;
