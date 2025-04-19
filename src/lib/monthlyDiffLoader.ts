import { DiffEntry, DiffMap } from '@/types/loadDiffMap'; // Assuming types are defined in a separate file

export async function loadDiffMap(dateStr?: string): Promise<DiffMap> {
  const safeDateStr = dateStr ?? '2025-04';

  try {
    const data = await import(`@/data/youtube_diffs/${safeDateStr}_diff.json`);
    const groups = Object.values(data.default as Record<string, DiffEntry[]>);
    const merged: DiffMap = {};

    groups.forEach((entries: DiffEntry[]) => {
      entries.forEach(({ id, subscriberDiff, viewDiff }) => {
        merged[id] = { subscriberDiff, viewDiff };
      });
    });

    return merged;
  } catch (error) {
    console.error(`[loadDiffMap] Failed to load ${safeDateStr}_diff.json`, error);
    return {};
  }
}
