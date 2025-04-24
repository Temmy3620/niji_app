import { getStatsById } from '@/lib/fileStatsUtils';

const idToTest = 'UC9V3Y3_uzU5e-usObb6IE1w'; // テストしたいIDに置き換えてください

const result = getStatsById(idToTest);

if (result) {
  console.log(`✅ Found stats for ID ${idToTest}:`, result);
} else {
  console.warn(`❌ No stats found for ID ${idToTest}`);
}
