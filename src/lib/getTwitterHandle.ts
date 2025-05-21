

import xIdData from "@/data/x_channel/x_id.json";

export function getTwitterHandle(channelId: string): string | undefined {
  const channel = xIdData.find((entry) => entry.channelId === channelId);
  return channel?.twitterHandle;
}
