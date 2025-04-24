import { loadStatsJsonByPrefix } from '@/lib/monthlyStatsLoader';

/**
 * 指定された月のJSONファイルが存在するかどうかを確認します
 * @param datePrefix - 例: '2025-04'
 * @returns ファイルが存在すれば true、存在しなければ false
 */
export async function checkStatsFileExists(datePrefix: string): Promise<boolean> {
  const data = await loadStatsJsonByPrefix(datePrefix);
  return Object.keys(data).length > 0;
}
