import { getStatsById } from '@/lib/fileStatsUtils'; // 実際のパスに変更してください

const id = 'UC0g1AE0DOjBYnLhkgoRWN1w'; // テストしたいチャンネルIDなど

const result = getStatsById(id);

console.log(`結果:`, result);
