// scripts/updateMarchDiff.ts
import fs from 'fs';
import path from 'path';

type Channel = {
  id: string;
  subscribers: number;
  views: number;
};

type DiffJson = {
  [group: string]: Channel[];
};

function loadTxtToMapSeb(filePath: string): Map<string, number> {
  const data = fs.readFileSync(filePath, 'utf-8');
  const lines = data.split('\n').map(line => line.trim()).filter(line => line.length > 10 &&
    line.includes('channelId') &&
    line.includes('登録者数') &&
    !/^\[\d+ … \d+\]$/.test(line));

  const map = new Map<string, number>();
  for (const line of lines) {
    // 1. キーと値を JSON 形式に変換する
    const jsonString = line
      .replace(/([{,]\s*)([a-zA-Z\u4e00-\u9faf]+)\s*:/g, '$1"$2":') // キーを囲う
      .replace(/'/g, '"'); // 値のシングルクォートをダブルに

    try {
      const obj = JSON.parse(jsonString);
      const id = obj.channelId;
      const value = parseInt(obj['登録者数'].replace(/[+,]/g, ''));

      if (id && !isNaN(value)) {
        map.set(id, value);
      }
    } catch (e) {
      console.error(`JSON parse error on line: ${line}`);
      console.error(e);
    }
  }

  return map;
}

function loadTxtToMapView(filePath: string): Map<string, number> {
  const data = fs.readFileSync(filePath, 'utf-8');
  const lines = data.split('\n').map(line => line.trim()).filter(line => line.length > 10 &&
    line.includes('channelId') &&
    line.includes('再生数') &&
    !/^\[\d+ … \d+\]$/.test(line));

  const map = new Map<string, number>();
  for (const line of lines) {
    // 1. キーと値を JSON 形式に変換する
    const jsonString = line
      .replace(/([{,]\s*)([a-zA-Z\u4e00-\u9faf]+)\s*:/g, '$1"$2":') // キーを囲う
      .replace(/'/g, '"'); // 値のシングルクォートをダブルに

    try {
      const obj = JSON.parse(jsonString);
      const id = obj.channelId;
      const value = parseInt(obj['再生数'].replace(/[+,]/g, ''));

      if (id && !isNaN(value)) {
        map.set(id, value);
      }
    } catch (e) {
      console.error(`JSON parse error on line: ${line}`);
      console.error(e);
    }
  }

  return map;
}

const sebFile = path.join(__dirname, '../data/memo/04_01.txt');
const viewFile = path.join(__dirname, '../data/memo/04_01_view.txt');
const jsonFile = path.join(__dirname, '../data/youtube_stats/2025-04-01_0002.json');

const subscriberMap = loadTxtToMapSeb(sebFile);
const viewMap = loadTxtToMapView(viewFile);

const jsonData: DiffJson = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));

// 書き換え処理
for (const group in jsonData) {
  if (group === '__generatedAt') continue;
  jsonData[group] = jsonData[group].map(entry => {
    const newSub = subscriberMap.get(entry.id);
    const newView = viewMap.get(entry.id);
    return {
      ...entry,
      subscribers: newSub ?? entry.subscribers,
      views: newView ?? entry.views,
    };
  });
}

// 上書き保存
fs.writeFileSync(jsonFile, JSON.stringify(jsonData, null, 2), 'utf-8');

console.log('✅ JSON更新完了：2025-04-01_0002.json');

function dd(...args: any[]) {
  console.log(...args);
  process.exit(1); // Node.js用（処理終了）
}
