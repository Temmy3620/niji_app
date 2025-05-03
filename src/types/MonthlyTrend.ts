import { ChannelData } from '@/types/ChannelData';

export interface GroupData {
  groupName: string;
  channels: ChannelData[];
}

export interface GroupDataMap {
  [groupKey: string]: GroupData;
}

export interface GroupConfig {
  key: string;
  name: string;
  iconUrl: string;
}

export interface MonthlyTrendPropsBase {
  allGroupData: GroupDataMap;
  groupsConfig: GroupConfig[];
  availableDates: string[];
  defaultStats: Record<string, { subscribers: number; views: number }>;
  defaultSelectedDate: string;
  selectedGroupKey: string;
  setSelectedGroupKey: (key: string) => void;
  monthlyStatsMap: Record<string, GroupStats[]>;
}

export interface GroupStats {
  totalSubscribers: number;
  totalViews: number;
  negativeSubscribers: number;
  negativeViews: number;
  month: string;
}
