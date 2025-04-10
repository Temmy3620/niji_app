// app/page.tsx
import { fetchChannelStats } from '@/lib/youtubeApi';
import { channelIds } from '@/constants/channelIds';

export default async function Home() {
  const rawData = await Promise.all(channelIds.map(id => fetchChannelStats(id)));
  const data = rawData.filter((d): d is NonNullable<typeof d> => d !== null);

  return (
    <main className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((channel) => (
          <div key={channel.id} className="flex items-center gap-4 p-4 border rounded shadow">
            <img src={channel.thumbnail} className="w-20 h-20 rounded-full" />
            <div>
              <p>登録者数: {Number(channel.subscribers).toLocaleString()} 人</p>
              <p>総再生数: {Number(channel.views).toLocaleString()} 回</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
