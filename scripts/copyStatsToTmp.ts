// scripts/copyStatsToTmp.ts
import fs from 'fs';
import path from 'path';

const srcPath = path.join(process.cwd(), 'data', 'cache', 'last_successful_stats.json');
const destPath = path.join('/tmp', 'last_successful_stats.json');

try {
  const content = fs.readFileSync(srcPath, 'utf-8');
  fs.writeFileSync(destPath, content);
  console.log(`✅ Copied stats file to: ${destPath}`);
} catch (error) {
  console.error('❌ Failed to copy stats file:', error);
}
