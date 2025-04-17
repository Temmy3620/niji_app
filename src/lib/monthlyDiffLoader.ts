import diffData from '@/data/youtube_diffs/2025-03-01_diff.json';

type DiffEntry = {
  id: string;
  subscriberDiff: number;
  viewDiff: number;
};

type DiffMap = {
  [channelId: string]: {
    subscriberDiff: number;
    viewDiff: number;
  };
};

export function loadDiffMap(): DiffMap {
  const groups = Object.values(diffData); // nijisanji, hololive, etc.
  const merged: DiffMap = {};

  groups.forEach((entries: DiffEntry[]) => {
    entries.forEach(({ id, subscriberDiff, viewDiff }) => {
      merged[id] = { subscriberDiff, viewDiff };
    });
  });

  return merged;
}
