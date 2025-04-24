//import dotenv from 'dotenv';
//dotenv.config({ path: '.env' }); // .env.local を使っている場合は '.env.local' に変更

import { getStatsByIdFromR2 } from '@/lib/fileStatsUtils';

console.log('R2_BUCKET:', process.env.R2_BUCKET);
console.log('R2_ACCESS_KEY_ID:', process.env.R2_ACCESS_KEY_ID);
console.log('R2_SECRET_ACCESS_KEY:', process.env.R2_SECRET_ACCESS_KEY);

const idToTest = 'UCz6vnIbgiqFT9xUcD6Bp65Q'; // テストしたいIDに置き換えてください

async function main() {
  const result = await getStatsByIdFromR2(idToTest);
  if (result) {
    console.log(`✅ Found stats for ID ${idToTest}:`, result);
  } else {
    console.warn(`❌ No stats found for ID ${idToTest}`);
  }
}
main();
