// src/lib/generateGroupMetadata.ts
import { Metadata } from 'next';
import { GROUPS_CONFIG } from '@/constants/groupsConfig';

export async function generateGroupMetadata({ group }: { group: string }): Promise<Metadata> {
  const groupInfo = GROUPS_CONFIG.find((g) => g.key === group);
  const groupName = groupInfo?.name || '';

  const title = 'VtubeTracker｜Vtuber登録者数・総再生数ランキング';

  const description = groupName
    ? `${groupName}に所属する人気Vtuberの登録者数・総再生数ランキングを毎月更新中。にじさんじ、ホロライブなどの最新統計データをわかりやすくまとめています。`
    : 'Vtuberの登録者数・再生数ランキングを毎月更新中。にじさんじ、ホロライブなど人気Vtuberの最新統計データサイト。';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  };
}
