export type DiffEntry = {
  id: string;
  subscriberDiff: number;
  viewDiff: number;
};

export type DiffMap = {
  [channelId: string]: {
    subscriberDiff: number;
    viewDiff: number;
  };
};
