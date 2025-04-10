import { fetchChannelStats } from '@/lib/youtubeApi';
import { channelIds } from '@/constants/channelIds';
import ClientHome from '@/components/ClientHome';

export default async function Home() {
  const rawData = await Promise.all(channelIds.map(id => fetchChannelStats(id)));
  const data = rawData.filter((d): d is NonNullable<typeof d> => d !== null);

  return (
    <ClientHome data={data} />
  );
}
