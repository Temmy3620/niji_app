import { fetchAllStats } from '@/lib/youtubeApi';
import ClientHome from '@/components/ClientHome';

export default async function Home() {
  const data = await fetchAllStats();

  return (
    <ClientHome data={data} />
  );
}
