// niji_app/src/app/card/[channelName]/page.tsx
import Link from 'next/link';
import { getChannelDiffByMonth } from '@/lib/diffData';
import { notFound } from 'next/navigation';
import { getGroupNameByKey } from '@/utils/groupsConfigUtil';
import { fetchChannelStats } from '@/app/channelStats/actions';
import type { ChannelData } from '@/types/ChannelData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChannelGrowthCharts } from '@/components/ChannelGrowthCharts';

interface Props {
  params: {
    channelName: string;
  };
  searchParams: {
    id?: string;
    group?: string;
  };
}

export default async function ChannelDetailPage({ params, searchParams }: Props) {
  const { channelName } = params;
  const channelId = searchParams.id;
  const groupKey = searchParams.group;

  if (!channelId || !groupKey) {
    notFound();
  }

  const allStats = await fetchChannelStats();
  const groupStats = allStats.find(stat => stat.key === groupKey);
  const channelInfo = groupStats?.data.channels.find(
    (channel): channel is ChannelData => channel.id === channelId
  );

  // --- 追加: 月ごとの差分取得 ---
  const months = ['2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04'];
  const monthlyDiffs = (
    await Promise.all(
      months.map(async (month) => {
        const result = await getChannelDiffByMonth(channelId, month, groupKey);
        return { month, ...result };
      })
    )
  ).reverse();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      <Link
        href={`/current/${groupKey}`}
        className="inline-block mb-4 text-cyan-400 hover:text-cyan-200 transition font-mono text-sm"
      >
        ◀ 「ホーム」に戻る
      </Link>
      <div className="mb-6 flex flex-col items-center text-center gap-4">
        {channelInfo && (
          <>
            <img
              src={channelInfo.thumbnail}
              alt={`${channelInfo.title}のサムネイル`}
              className="w-28 h-28 rounded-full border-4 border-cyan-500 shadow-md"
            />
            <h1 className="text-2xl font-bold tracking-wide text-cyan-300">{decodeURIComponent(channelName)}</h1>
            <p className="text-sm text-gray-400">{getGroupNameByKey(groupKey)}</p>
          </>
        )}
      </div>

      {channelInfo && (
        <div className="grid grid-cols-3 gap-4 text-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg mb-8">
          <div>
            <p className="text-sm text-gray-400">現在の登録者数</p>
            <p className="text-2xl font-extrabold text-cyan-300">
              {typeof channelInfo.subscribers === 'string'
                ? channelInfo.subscribers
                : (channelInfo.subscribers as number).toLocaleString()} 人
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">総再生数</p>
            <p className="text-2xl font-extrabold text-cyan-300">
              {typeof channelInfo.views === 'string'
                ? channelInfo.views
                : (channelInfo.views as number).toLocaleString()} 回
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">動画数</p>
            <p className="text-2xl font-extrabold text-cyan-300">
              {channelInfo.videoCount} 本
            </p>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-white border border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-cyan-300">
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

      <h2 className="text-xl font-bold mt-6 mb-2 text-cyan-300">登録者増加数推移（月別）</h2>
      <ChannelGrowthCharts monthlyDiffs={monthlyDiffs} type="subscribers" />

      <h2 className="text-xl font-bold mt-6 mb-2 text-yellow-300">再生数増加数推移（月別）</h2>
      <ChannelGrowthCharts monthlyDiffs={monthlyDiffs} type="views" />

    </div>
  );
}
