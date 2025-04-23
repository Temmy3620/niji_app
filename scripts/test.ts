// npx tsx scripts/test.ts
import { getCurrentMonth } from '@/lib/getMonth'; // 仮に関数をlibに分けている前提
const sorted = getCurrentMonth();
//
//console.log(sorted);

//import { GET } from '@/app/api/stats/[datePrefix]/route';
//
//async function run() {
//  const dummyRequest = new Request('http://localhost'); // ダミー
//  const dummyContext = { params: { datePrefix: '2025-04' } };
//
//  const res = await GET(dummyRequest, dummyContext);
//  const json = await res.json();
//
//  console.log(json);
//}
//
//run();

//import { loadStatsJsonByPrefix } from '@/lib/monthlyStatsLoader';
//
//async function run() {
//  const datePrefix = '2025-04'; // テストしたい月のプレフィックス
//  const result = await loadStatsJsonByPrefix(sorted);
//
//  console.log('--- 読み込んだデータ ---');
//  console.log(result);
//}
//
//run();
