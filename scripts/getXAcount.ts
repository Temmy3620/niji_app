import { writeFileSync } from 'fs';
import 'dotenv/config';
import { channelIds } from '@/constants/channelIds';
import { join } from 'path';

const API_KEY = process.env.YOUTUBE_API_KEY!;
// const channelId = 'UCSFCh5NL4qXrAy9u-u2lX3g'; // 対象チャンネルID

async function getChannelInfo(channelId: string) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,brandingSettings&id=${channelId}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  const item = data.items?.[0];
  const title = item?.snippet?.title || 'Unknown';

  const brandingDesc = item?.brandingSettings?.channel?.description || '';
  const snippetDesc = item?.snippet?.description || '';
  const links = item?.brandingSettings?.channel?.links || [];

  // Match Twitter from branding/snippet descriptions or links
  const urlMatch =
    brandingDesc.match(/https:\/\/(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/i) ||
    snippetDesc.match(/https:\/\/(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/i);

  const atMentionMatch =
    brandingDesc.match(/@([a-zA-Z0-9_]{1,15})/) ||
    snippetDesc.match(/@([a-zA-Z0-9_]{1,15})/);

  const linksMatch = links.find((link: { title: string; url: string }) =>
    /(?:twitter\.com|x\.com)/.test(link.url)
  );

  const twitterUsername =
    urlMatch?.[1] ||
    atMentionMatch?.[1] ||
    linksMatch?.url.match(/(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/)?.[1];

  return {
    channelTitle: title,
    twitterHandle: twitterUsername ? `@${twitterUsername}` : 'Not found',
  };
}

const allChannelIds = Object.values(channelIds)
  .flatMap(group => Object.values(group));

async function fetchAll() {
  const result: { channelTitle: string; channelId: string; twitterHandle: string }[] = [];

  for (const id of allChannelIds) {
    const info = await getChannelInfo(id);
    result.push({
      channelTitle: info.channelTitle,
      channelId: id,
      twitterHandle: info.twitterHandle,
    });
    console.log(`Title: ${info.channelTitle}, Channel ID: ${id}, Twitter: ${info.twitterHandle}`);
  }

  writeFileSync(join(__dirname, '../data/x_channel/x_id.json'), JSON.stringify(result, null, 2), 'utf-8');
  console.log('✅ x_id.json saved.');
}

fetchAll();
