import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://vtuber-ch.com';

export async function getTalentLinks(): Promise<string[]> {
  const pageBase = `${BASE_URL}/ranking/?gname=ホロライブALL&pageno=`;
  const maxPage = 9;
  const links: string[] = [];

  for (let page = 1; page <= maxPage; page++) {
    const url = `${pageBase}${page}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    $('.ranking-parent a').each((_, el) => {
      const href = $(el).attr('href');
      if (href) links.push(BASE_URL + href);
    });
  }

  return [...new Set(links)];
}

export async function getYoutubeChannelId(pageUrl: string): Promise<string | null> {
  try {
    const { data } = await axios.get(pageUrl);
    const $ = cheerio.load(data);

    const youtubeHref = $('.profile_item02 a[href*="youtube.com/channel/"]').attr('href');
    if (youtubeHref) {
      const match = youtubeHref.match(/channel\/([a-zA-Z0-9_-]+)/);
      return match ? match[1] : null;
    }

    return null;
  } catch (error) {
    console.error(`❌ ${pageUrl} でチャンネルIDの取得失敗:`, error);
    return null;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    const profileLinks = await getTalentLinks();

    const result: { profileUrl: string; channelId: string | null }[] = [];

    for (const url of profileLinks) {
      console.log(`🔍 ${url}`);
      const channelId = await getYoutubeChannelId(url);
      result.push({ profileUrl: url, channelId });
    }

    console.log('\n✅ 結果一覧:');
    result.forEach(({ profileUrl, channelId }) => {
      console.log(`${profileUrl} => ${channelId ?? '取得失敗'}`);
    });
  })();
}
