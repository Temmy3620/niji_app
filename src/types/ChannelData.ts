export type ChannelData = {
  id: string;
  title: string;
  thumbnail: string;
  subscribers: string;
  views: string;
  subscriberDiff?: number | null;
  viewDiff?: number | null;
  videoCount: string;
};
