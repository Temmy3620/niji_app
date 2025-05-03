
// 実行コマンド:
// npx tsx scripts/generateAndSummarize.ts
//
// このスクリプトは以下を実行します:
// 1. npx tsx scripts/generateMonthlyStatsDiff.ts
// 2. npx tsx scripts/saveSummary.ts [前月のYYYY-MM形式]


import { execSync } from 'child_process';

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth(); // 0-based, so this is last month
const targetMonth = month === 0
  ? `${year - 1}-12`
  : `${year}-${String(month).padStart(2, '0')}`;

try {
  console.log(`📊 Generating monthly stats diff for ${targetMonth}...`);
  execSync('npx tsx scripts/generateMonthlyStatsDiff.ts', { stdio: 'inherit' });

  console.log(`💾 Saving summary for ${targetMonth}...`);
  execSync(`npx tsx scripts/saveSummary.ts ${targetMonth}`, { stdio: 'inherit' });

  console.log(`✅ Done generating and saving summary for ${targetMonth}`);
} catch (error) {
  console.error('❌ Failed to run one of the scripts:', error);
  process.exit(1);
}
