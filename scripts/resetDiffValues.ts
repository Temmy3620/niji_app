import fs from 'fs';
import path from 'path';

const FILE_PATH = path.join(__dirname, '../data/youtube_diffs/2024-11_diff.json');

type DiffEntry = {
  id: string;
  subscriberDiff?: number | null;
  viewDiff?: number | null;
};

type DiffJson = Record<string, DiffEntry[]>;

try {
  const raw = fs.readFileSync(FILE_PATH, 'utf-8');
  const json: DiffJson = JSON.parse(raw);

  // すべてのグループごとの配列を対象に null へ
  for (const group of Object.keys(json)) {
    json[group] = json[group].map(entry => ({
      ...entry,
      subscriberDiff: null,
      viewDiff: null,
    }));
  }

  fs.writeFileSync(FILE_PATH, JSON.stringify(json, null, 2), 'utf-8');
  console.log('✅ Diff values have been reset to null.');
} catch (err) {
  console.error('❌ Failed to update file:', err);
}
