// src/lib/copyStatsToTmp.ts
import fs from 'fs';
import path from 'path';

export function copyStatsToTmp() {
  const srcPath = path.join(process.cwd(), 'data', 'cache', 'last_successful_stats.json');
  const destPath = path.join('/tmp', 'last_successful_stats.json');

  const content = fs.readFileSync(srcPath, 'utf-8');
  fs.writeFileSync(destPath, content);

  console.log(`✅ Copied stats file to: ${destPath}`);
}
