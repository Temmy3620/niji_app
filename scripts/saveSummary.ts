import * as fs from 'fs';
import * as path from 'path';

interface ChannelDiff {
  id: string;
  subscriberDiff: number;
  viewDiff: number;
}

interface DiffJson {
  [group: string]: ChannelDiff[];
}

// コマンド引数から年月を取得
const targetMonth = process.argv[2];
if (!targetMonth) {
  console.error('❌ Usage: ts-node saveSummary.ts <YYYY-MM>');
  process.exit(1);
}

// ファイルパス（プロジェクトルートからの相対パス）
const filePath = path.join(__dirname, `../data/youtube_diffs/${targetMonth}_diff.json`);

// JSON読み込み
const rawData = fs.readFileSync(filePath, 'utf-8');
const diffData: DiffJson = JSON.parse(rawData);

// グループごとに合計を計算
const summary: Record<string, {
  totalSubscribers: number;
  totalViews: number;
  negativeSubscribers: number;
  negativeViews: number;
}> = {};

Object.entries(diffData).forEach(([groupName, channels]) => {
  const totalSubscribers = channels.reduce((sum, channel) => sum + channel.subscriberDiff, 0);
  const totalViews = channels.reduce((sum, channel) => sum + channel.viewDiff, 0);

  const negativeSubscribers = channels
    .filter(channel => channel.subscriberDiff < 0)
    .reduce((sum, channel) => sum + channel.subscriberDiff, 0);

  const negativeViews = channels
    .filter(channel => channel.viewDiff < 0)
    .reduce((sum, channel) => sum + channel.viewDiff, 0);

  summary[groupName] = {
    totalSubscribers,
    totalViews,
    negativeSubscribers,
    negativeViews,
  };

  console.log(`📦 ${groupName}`);
  console.log(`  登録者数の増加合計: ${totalSubscribers.toLocaleString()}人`);
  console.log(`  再生数の増加合計: ${totalViews.toLocaleString()}回`);
  console.log(`  登録者数の減少合計: ${negativeSubscribers.toLocaleString()}人`);
  console.log(`  再生数の減少合計: ${negativeViews.toLocaleString()}回\n`);
});

const outputPath = path.join(__dirname, `../data/monthly_summaries/${targetMonth}_summary.json`);
fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2), 'utf-8');
console.log(`✅ Summary written to ${outputPath}`);
