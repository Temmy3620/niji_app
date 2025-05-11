import fs from 'fs';
import path from 'path';

const jsonPath = path.join(process.cwd(), 'data/youtube_diffs/2024-11_diff.json');

try {
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const json = JSON.parse(raw) as Record<
    string,
    { id: string; subscriberDiff: number | null; viewDiff: number | null }[]
  >;

  for (const group in json) {
    json[group] = json[group].filter(
      (entry) => !(entry.subscriberDiff === null && entry.viewDiff === null)
    );
  }

  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2));
  console.log('✅ null の diff を削除しました');
} catch (error) {
  console.error('❌ エラーが発生しました:', error);
}
