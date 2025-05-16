// niji_app/src/app/card/[channelName]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { AnimatedCardWrapper } from '@/components/AnimatedCardWrapper';
import { getChannelDiffByMonth } from '@/lib/diffData';
import { notFound } from 'next/navigation';
import { getGroupNameByKey } from '@/utils/groupsConfigUtil';
import { fetchChannelStats } from '@/app/channelStats/actions';
import type { ChannelData } from '@/types/ChannelData';
import { ChannelGrowthCharts } from '@/components/ChannelGrowthCharts';
import { getAvailableDates } from '@/lib/fileStatsUtils';
import { loadStatsByPrefixAndChannelId } from '@/lib/monthlyStatsLoader';
import { getCurrentMonth } from '@/lib/monthUtils';
import { ShareButtons } from "@/components/ShareButtons";


export default async function ChannelDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ channelName: string }>;
  searchParams?: Promise<{ id?: string; group?: string }>;
}) {
  // const { params, searchParams } = props;
  const { channelName } = await params;
  const { id: channelId, group: groupKey } = (await searchParams) ?? {};

  if (!channelId || !groupKey) {
    notFound();
  }

  const allStats = await fetchChannelStats();
  const groupStats = allStats.find(stat => stat.key === groupKey);
  const channelInfo = groupStats?.data.channels.find(
    (channel): channel is ChannelData => channel.id === channelId
  );

  // --- 追加: 月ごとの差分取得 ---
  const months = getAvailableDates().all;
  const monthlyDiffs = (
    await Promise.all(
      months.map(async (month) => {
        const result = await getChannelDiffByMonth(channelId, month, groupKey);
        return { month, ...result };
      })
    )
  ).reverse();

  const currentMonth = getCurrentMonth();
  const currentStats = await loadStatsByPrefixAndChannelId(currentMonth, channelId);

  const groupName = getGroupNameByKey(groupKey);

  return (
    <>
      <div className="flex justify-start mx-4 sm:mx-8 lg:mx-10 my-4">
        <Link
          href={`/current/${groupKey}`}
          className="text-[#38fdfd] hover:text-cyan-200 transition font-mono text-xs sm:text-sm border border-[#38fdfd33] px-3 py-1 rounded-full bg-[#0f172a]/50 shadow-sm"
        >
          ◁「現登録・総再生数」に戻る
        </Link>
      </div>
      {/* カード右上にシェアボタン */}
      <div className="flex justify-end mx-4 sm:mx-8 lg:mx-10 mb-2">
        <ShareButtons postTitle={`${decodeURIComponent(channelName)}（${groupName}）登録者数・再生数グラフ`} hash={`?id=${channelId}&group=${groupKey}`} />
      </div>
      <AnimatedCardWrapper>
        <div className="mb-6 flex flex-col items-center text-center gap-4">
          {channelInfo && (
            <>
              <img
                src={channelInfo.thumbnail}
                alt={`${channelInfo.title}のサムネイル`}
                className="w-28 h-28 rounded-full border-4 border-cyan-500 shadow-md"
              />
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-widest text-[#38fdfd]">{decodeURIComponent(channelName)}</h1>
              <p className="text-xs sm:text-sm text-gray-400">{groupName}</p>
            </>
          )}
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-[#38fdfd] mb-2 mt-6">チャンネル概要</h2>
        {channelInfo && (
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_0.7fr] gap-y-6 sm:gap-4 text-center bg-[#0d1b2a] border border-cyan-800/50 rounded-xl p-6 shadow-inner shadow-cyan-800/10 mb-8">
            <div>
              <p className="text-xs sm:text-sm text-gray-400">現在の登録者数</p>
              <p className="text-2xl lg:text-3xl font-extrabold tracking-widest text-[#38fdfd] font-mono flex justify-center items-baseline gap-1">
                <span>{Number(channelInfo.subscribers).toLocaleString()}</span>
                <span className="text-sm sm:text-base">人</span>
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400">総再生数</p>
              <p className="text-2xl lg:text-3xl font-extrabold tracking-widest text-[#38fdfd] font-mono flex justify-center items-baseline gap-1">
                <span>{Number(channelInfo.views).toLocaleString()}</span>
                <span className="text-sm sm:text-base">回</span>
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400">動画数</p>
              <p className="text-2xl lg:text-3xl font-extrabold tracking-widest text-[#38fdfd] font-mono flex justify-center items-baseline gap-1">
                <span>{channelInfo.videoCount.toLocaleString()}</span>
                <span className="text-sm sm:text-base">本</span>
              </p>
            </div>
          </div>
        )}

        {/* 今月の増加数パネル */}
        <h2 className="text-lg sm:text-xl font-bold text-[#38fdfd] mb-2 mt-6">今月の登録・再生・投稿</h2>
        {channelInfo && currentStats && (
          <div className="mb-4 rounded-lg bg-[#0a1323] p-4 shadow-md text-white grid grid-cols-3 sm:grid-cols-3 gap-4 text-center border border-cyan-700/40">
            <div>
              <p className="text-xs sm:text-sm text-gray-400">登録者数</p>
              {(() => {
                const diff = Number(channelInfo.subscribers) - Number(currentStats.subscribers);
                return (
                  <p className={`text-sm sm:text-2xl font-semibold ${diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {diff >= 0 ? '+' : '-'}{Math.abs(diff).toLocaleString()}
                  </p>
                );
              })()}
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400">再生数</p>
              {(() => {
                const diff = Number(channelInfo.views) - Number(currentStats.views);
                return (
                  <p className={`text-sm sm:text-2xl font-semibold ${diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {diff >= 0 ? '+' : '-'}{Math.abs(diff).toLocaleString()}
                  </p>
                );
              })()}
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400">動画数</p>
              {(() => {
                const diff = Number(channelInfo.videoCount) - Number(currentStats.videoCount);
                return (
                  <p className={`text-sm sm:text-2xl font-semibold ${diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {diff >= 0 ? '+' : '-'}{Math.abs(diff).toLocaleString()}
                  </p>
                );
              })()}
            </div>
          </div>
        )}

        <hr className="border-cyan-800 my-6" />

        <h2 className="text-lg sm:text-xl font-bold text-[#38fdfd] mb-2 mt-6">月別の登録者・再生増加数</h2>
        <div className="w-full overflow-x-auto text-[10px] sm:text-sm">
          <table className="min-w-full text-left text-xs sm:text-sm text-white border border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-[#38fdfd] font-mono">
              <tr>
                <th className="px-4 py-2 border-b">月</th>
                <th className="px-4 py-2 border-b">登録者増加数</th>
                <th className="px-4 py-2 border-b">再生数増加数</th>
              </tr>
            </thead>
            <tbody>
              {monthlyDiffs.map((diff) => (
                <tr key={diff.month} className="hover:bg-gray-700 transition">
                  <td className="px-4 py-2 border-b">{diff.month}</td>
                  <td className="px-4 py-2 border-b">
                    {diff.subscriberDiff !== undefined ? (
                      <span
                        className={
                          diff.subscriberDiff > 0
                            ? 'text-green-400'
                            : diff.subscriberDiff < 0
                              ? 'text-red-400'
                              : 'text-gray-400'
                        }
                      >
                        {diff.subscriberDiff > 0 ? '+' : ''}
                        {diff.subscriberDiff.toLocaleString()} 人
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {diff.viewDiff !== undefined ? (
                      <span
                        className={
                          diff.viewDiff > 0
                            ? 'text-green-400'
                            : diff.viewDiff < 0
                              ? 'text-red-400'
                              : 'text-gray-400'
                        }
                      >
                        {diff.viewDiff > 0 ? '+' : ''}
                        {diff.viewDiff.toLocaleString()} 回
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <hr className="border-cyan-800 my-6" />

        <h2 className="text-xl sm:text-2xl font-bold mt-6 mb-2 text-[#38fdfd]">登録者増加数推移（月別）</h2>
        <ChannelGrowthCharts monthlyDiffs={monthlyDiffs} type="subscribers" />

        <h2 className="text-xl sm:text-2xl font-bold mt-6 mb-2 text-[#4ade80]">再生数増加数推移（月別）</h2>
        <ChannelGrowthCharts monthlyDiffs={monthlyDiffs} type="views" />

      </AnimatedCardWrapper>
    </>
  );
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ channelName: string }>;
  searchParams?: Promise<{ id?: string; group?: string }>;
}): Promise<Metadata> {
  const { channelName } = await params;
  const { id: channelId, group: groupKey } = (await searchParams) ?? {};

  const decodedName = decodeURIComponent(channelName);
  const groupName = getGroupNameByKey(groupKey ?? '');
  const vtuberNameJa = decodedName;
  const vtuberNameEn = ''; // 必要なら取得処理を追加
  const startMonth = '2024年5月'; // 動的に取得してもOK
  const endMonth = '2025年4月';
  const ogImageUrl = `https://vtubertracker.info/ogp.png`;
  const pageUrl = `https://vtubertracker.info/card/${encodeURIComponent(channelName)}?id=${channelId}&group=${groupKey}`;

  const title = `${vtuberNameJa}（${groupName}）登録者数・再生数グラフ | VtubeTracker`;
  const description = `${vtuberNameJa} / ${vtuberNameEn} のYouTube登録者数・再生数の月別推移（${startMonth}〜${endMonth}）を掲載。${groupName}内での比較やグループ全体統計も確認できます。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: pageUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${vtuberNameJa}の登録者・再生数グラフ`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
