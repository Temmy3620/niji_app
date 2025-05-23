// src/lib/generateGroupMetadata.ts
import { Metadata } from 'next';
import { GROUPS_CONFIG } from '@/constants/groupsConfig';
import { getGroupNameByKey } from '@/utils/groupsConfigUtil';

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
      images: [
        {
          url: 'https://vtubertracker.info/ogp.png',
          width: 1200,
          height: 630,
          alt: 'VtubeTrackerのOGP画像',
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [
        {
          url: 'https://vtubertracker.info/ogp.png',
          width: 1200,
          height: 630,
          alt: 'VtubeTrackerのOGP画像',
        },
      ],
    },
  };
}

export async function generateChannelMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ channelName: string }>;
  searchParams?: Promise<{ id?: string; group?: string }>;
}): Promise<Metadata> {
  const { channelName } = await params;
  const { group: groupKey } = (await searchParams) ?? {};

  const decodedName = decodeURIComponent(channelName);
  const groupName = getGroupNameByKey(groupKey ?? '');
  const vtuberNameJa = decodedName;
  const vtuberNameEn = ''; // 必要なら取得処理を追加
  const startMonth = '2024年5月'; // 動的に取得してもOK
  const endMonth = '2025年4月';
  const ogImageUrl = `https://vtubertracker.info/ogp.png`;

  const title = `${vtuberNameJa}（${groupName}）登録者数・再生数グラフ | VtubeTracker`;
  const description = `${vtuberNameJa} / ${vtuberNameEn} のYouTube登録者数・再生数の月別推移（${startMonth}〜${endMonth}）を掲載。${groupName}内での比較やグループ全体統計も確認できます。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'VtubeTrackerのOGP画像',
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
