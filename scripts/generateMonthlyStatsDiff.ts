/**
 * 🔄 generateMonthlyStatsDiff.ts
 *
 * 用途:
 * - 直近の保存済みファイルを2つ使って、チャンネルごとの登録者数・再生数の差分を計算
 * - 結果は `data/youtube_diffs/YYYY-MM-DD_diff.json` に保存される
 *
 * 実行方法:
 *   npx tsx scripts/generateMonthlyStatsDiff.ts
 *
 * 注意:
 * - saveMonthlyStats を内部で呼び出して今月分を保存した後に差分を計算
 */
import { saveMonthlyStats } from './saveMonthlyStats';
import fs from 'fs';
import path from 'path';

async function generateMonthlyStatsDiff() {
  const outputDir = path.resolve(__dirname, '../data/youtube_stats');
  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.json')).sort();

  const previousFile = files.at(-1); // 最後のファイルを「前月」とみなす
  const { outputPath: latestFile } = await saveMonthlyStats(); // 今月分を保存し、ファイルパスを取得

  if (!previousFile) {
    console.log('⚠️ 前月ファイルが見つかりません。差分は生成されません。');
    return;
  }

  const prevPath = path.join(outputDir, previousFile);
  const diffDir = path.resolve(__dirname, '../data/youtube_diffs');
  const prevYm = previousFile.split('_')[0]; // e.g. '2025-03-01'
  const diffOutPath = path.join(diffDir, `${prevYm}_diff.json`);

  const marchData = JSON.parse(fs.readFileSync(prevPath, 'utf-8'));
  const aprilData = JSON.parse(fs.readFileSync(latestFile, 'utf-8'));

  const diffData: Record<string, any[]> = {};
  for (const group of Object.keys(aprilData)) {
    if (group === '__generatedAt') continue;

    const aprilList = aprilData[group];
    const marchList = marchData[group];
    if (!Array.isArray(aprilList) || !Array.isArray(marchList)) continue;

    diffData[group] = aprilList.map((aprilChannel) => {
      const match = marchList.find((m) => m.id === aprilChannel.id);
      if (!match) return null;

      const subDiff = aprilChannel.subscribers - match.subscribers;
      const viewDiff = aprilChannel.views - match.views;

      return {
        id: aprilChannel.id,
        subscriberDiff: subDiff,
        viewDiff: viewDiff,
      };
    }).filter(Boolean);
  }

  fs.mkdirSync(diffDir, { recursive: true });
  fs.writeFileSync(diffOutPath, JSON.stringify(diffData, null, 2));
  console.log('📊 差分ファイルを出力しました:', diffOutPath);
}

generateMonthlyStatsDiff();
