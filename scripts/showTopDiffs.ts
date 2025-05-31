import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

type ChannelStat = {
  id: string;
  subscriberDiff: number;
  viewDiff: number;
};

type DiffData = {
  [group: string]: ChannelStat[];
};

const groupNames: Record<string, string> = {
  nijisanji: "にじさんじ",
  hololive: "ホロライブ",
  vspo: "ぶいすぽっ！",
  neoporte: "neo-porte",
  aogiri: "あおぎり高校",
  noripro: "のりプロ",
  dotlive: ".LIVE",
};

const yyyymm = process.argv[2];
const [year, month] = yyyymm.split("-");
const monthLabel = `${year}年${parseInt(month)}月`;
if (!yyyymm || !/^\d{4}-\d{2}$/.test(yyyymm)) {
  console.error("❌ Usage: npx tsx scripts/showTopDiffs.ts 2025-04");
  process.exit(1);
}

const filePath = path.join(__dirname, `../data/youtube_diffs/${yyyymm}_diff.json`);
if (!fs.existsSync(filePath)) {
  console.error(`❌ File not found: ${filePath}`);
  process.exit(1);
}

const raw = fs.readFileSync(filePath, "utf-8");
const data: DiffData = JSON.parse(raw);

// チャンネルID → タイトル変換キャッシュ
const titleCache: Record<string, string> = {};

async function fetchChannelTitle(id: string): Promise<string> {
  if (titleCache[id]) return titleCache[id];

  const apiKey = process.env.YOUTUBE_API_KEY;
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${id}&key=${apiKey}`
  );
  const json = await res.json();
  const title = json?.items?.[0]?.snippet?.title || id;
  titleCache[id] = title;
  return title;
}

async function main() {
  const groups = Object.keys(data);

  for (const group of groups) {
    const groupData = data[group];
    if (!groupData || groupData.length === 0) continue;

    console.log(`\n📊 ${groupNames[group] || group.toUpperCase()} - ${monthLabel} 登録者増加数 Top 10`);
    const topSubscribers = [...groupData]
      .sort((a, b) => b.subscriberDiff - a.subscriberDiff)
      .slice(0, 15);
    for (let i = 0; i < topSubscribers.length; i++) {
      const entry = topSubscribers[i];
      const title = await fetchChannelTitle(entry.id);
      console.log(`${i + 1}. ${title} (+${entry.subscriberDiff})`);
    }
    console.log(`\nhttps://vtubertracker.info/subscribers/${group}`);

    console.log(`\n📊 ${groupNames[group] || group.toUpperCase()} - ${monthLabel} 総再生数増加数 Top 10`);
    const topViews = [...groupData]
      .sort((a, b) => b.viewDiff - a.viewDiff)
      .slice(0, 15);
    for (let i = 0; i < topViews.length; i++) {
      const entry = topViews[i];
      const title = await fetchChannelTitle(entry.id);
      console.log(`${i + 1}. ${title} (+${entry.viewDiff.toLocaleString()})`);
    }
    console.log(`\nhttps://vtubertracker.info/views/${group}`);
  }
}

main();
