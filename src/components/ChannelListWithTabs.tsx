'use client';

import { Tabs, TabsContent } from '@/components/ui/tabs';
import GroupTabs from '@/components/GroupTabs';
import ChannelCard from '@/components/ChannelCard';
import TotalStatsPanel from '@/components/TotalStatsPanel';
import SubscriberGrowthPanel from '@/components/SubscriberGrowthPanel';
import ViewGrowthPanel from '@/components/ViewGrowthPanel';
import { ChannelData } from '@/types/ChannelData';
import { GroupConfig, GroupStats } from '@/types/MonthlyTrend';
import { getGroupNameByKey } from '@/utils/groupsConfigUtil';
import { ShareButtons } from "@/components/ShareButtons";

interface ChannelListWithTabsProps {
  groupsConfig: GroupConfig[];
  selectedGroupKey: string;
  setSelectedGroupKey: (key: string) => void;
  getSortedData: (groupKey: string) => ChannelData[];
  sortKey: 'subscribers' | 'views' | 'current';
  headerRight?: React.ReactNode;
  monthlyStatsMap: Record<string, GroupStats[]>;
  selectedDate: string; // ← add this line
}

export default function ChannelListWithTabs({
  groupsConfig,
  selectedGroupKey,
  setSelectedGroupKey,
  getSortedData,
  sortKey,
  headerRight,
  monthlyStatsMap,
  selectedDate,
}: ChannelListWithTabsProps) {
  const selectedDateJa = selectedDate.replace(/(\d{4})-(\d{2})/, (_, year, month) => {
    return `${year}年${parseInt(month, 10)}月`;
  });

  return (
    <main className="p-4 md:p-6">
      <Tabs value={selectedGroupKey} onValueChange={setSelectedGroupKey} className="w-full">
        <div className="flex items-center mb-4 gap-4 flex-wrap">
          <GroupTabs groupsConfig={groupsConfig} selectedGroupKey={selectedGroupKey} />
        </div>
        <div className='mt-4'>
          {sortKey === 'current' && (
            <TotalStatsPanel groupKey={selectedGroupKey} allGroupData={Object.fromEntries(
              groupsConfig.map(group => [group.key, { groupName: group.name, channels: getSortedData(group.key) }]),
            )} />
          )}

          {sortKey === 'subscribers' && (
            <SubscriberGrowthPanel groupKey={selectedGroupKey} monthlyStats={monthlyStatsMap[selectedGroupKey]} selectedDate={selectedDate} />
          )}

          {sortKey === 'views' && (
            <ViewGrowthPanel groupKey={selectedGroupKey} monthlyStats={monthlyStatsMap[selectedGroupKey]} selectedDate={selectedDate} />
          )}
        </div>

        {groupsConfig.map((group) => {
          const sortedChannels = getSortedData(group.key);
          const rankingTitle =
            sortKey === 'current'
              ? `【${getGroupNameByKey(group.key)}】登録者数・再生数ランキング`
              : sortKey === 'subscribers'
                ? `【${getGroupNameByKey(group.key)}】 登録者増加数ランキング（${selectedDateJa}）`
                : sortKey === 'views'
                  ? `【${getGroupNameByKey(group.key)}】 再生増加数ランキング（${selectedDateJa}）`
                  : '';

          return (
            <TabsContent key={group.key} value={group.key} className="mt-4 focus-visible:ring-0 focus-visible:ring-offset-0">
              <div className="flex items-center justify-between gap-4 mt-10 mb-6 flex-wrap">
                <h1 className="text-base sm:text-2xl font-extrabold flex items-center gap-2 m-0 text-cyan-100 tracking-wide font-mono" id="rankings">
                  {rankingTitle}
                </h1>
                {headerRight}
              </div>

              <ShareButtons postTitle={rankingTitle} hash='#rankings' />

              <p className="text-gray-700 mb-6 text-xs sm:text-base">
                {sortKey === 'current' && (
                  <>
                    {getGroupNameByKey(group.key)}に所属するVtuber（バーチャルYouTuber）の最新YouTubeチャンネル情報を掲載しています。<br />
                    現時点での登録者数や総再生回数のデータをランキング形式で掲載しています。<br />
                    Vtuberの成長状況や人気の傾向を確認したい方におすすめのランキングページです。
                  </>
                )}
                {sortKey === 'subscribers' && (
                  <>
                    {getGroupNameByKey(group.key)}に所属するVtuber（バーチャルYouTuber）の登録者数の月間増加ランキング（{selectedDateJa}）です。<br />
                    月ごとの登録者数の推移を集計し、急成長している人気Vtuberをランキング形式で紹介しています。<br />
                    Vtuber業界の各グループごとのトレンドや注目株を知りたい方に最適なデータです。
                  </>
                )}
                {sortKey === 'views' && (
                  <>
                    {getGroupNameByKey(group.key)}に所属するVtuber（バーチャルYouTuber）の再生数の月間増加ランキング（{selectedDateJa}）です。<br />
                    動画コンテンツの再生回数に注目し、どのVtuberが視聴者から多くの支持を集めているかをランキング形式で紹介。<br />
                    YouTube動画の人気動向を知りたい方や注目のVtuberを探している方におすすめの内容です。
                  </>
                )}
              </p>
              {sortedChannels.length > 0 ? (
                <div className="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))]">
                  {sortedChannels.map((channel, index) => (
                    <ChannelCard
                      key={channel.id}
                      channel={channel}
                      currentTab={sortKey}
                      rank={index}
                      groupKey={group.key}
                    />
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
