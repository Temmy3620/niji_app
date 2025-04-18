'use client';

// Removed usePathname import as currentTab is now passed via props
import { Card } from "@/components/ui/card";

export type ChannelData = {
  id: string;
  title: string;
  thumbnail: string;
  subscribers: string;
  views: string;
  subscriberDiff?: number;
  viewDiff?: number;
};

export default function ChannelCard({ channel, currentTab }: { channel: ChannelData; currentTab: 'current' | 'subscribers' | 'views' }) {
  const isCurrent = currentTab === 'current';
  const isMonthlySubscribers = currentTab === 'subscribers';
  const isMonthlyViews = currentTab === 'views';

  const subscriberText = channel.subscribers === '非公開'
    ? '非公開'
    : (Number(channel.subscribers) || 0).toLocaleString() + ' 人';

  return (
    <Card key={channel.id} className="p-4 border border-gray-700 bg-gray-900 rounded shadow-2xl transition-transform hover:scale-[1.02] hover:border-indigo-500 overflow-hidden">
      <div className="flex items-center gap-4">
        <img
          src={channel.thumbnail}
          alt={`${channel.title} Thumbnail`}
          className="w-20 h-20 rounded-full ring-2 ring-offset-2 ring-indigo-500 object-cover flex-shrink-0"
          loading="lazy"
          width="80"
          height="80"
        />
        <div className="flex-grow min-w-0">
          <h2 className="text-lg font-semibold truncate text-white" title={channel.title}>{channel.title}</h2>

          {(isCurrent || isMonthlySubscribers) && (
            <p className="flex items-center gap-1 text-sm text-gray-300">
              <span role="img" aria-label="Subscribers">👥</span>
              {subscriberText}
            </p>
          )}

          {isMonthlySubscribers && typeof channel.subscriberDiff === 'number' && (
            <p
              className={`flex items-center gap-1 text-sm ${channel.subscriberDiff >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
            >
              <span role="img" aria-label="Diff">📈</span>
              {channel.subscriberDiff >= 0 ? '+' : ''}
              {channel.subscriberDiff.toLocaleString()} 人
            </p>
          )}

          {(isCurrent || isMonthlyViews) && (
            <p className="flex items-center gap-1 text-sm text-gray-300">
              <span role="img" aria-label="Views">▶️</span>
              {(Number(channel.views) || 0).toLocaleString()} 回
            </p>
          )}

          {isMonthlyViews && typeof channel.viewDiff === 'number' && (
            <p
              className={`flex items-center gap-1 text-sm ${channel.viewDiff >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
            >
              <span role="img" aria-label="Diff">📈</span>
              {channel.viewDiff >= 0 ? '+' : ''}
              {channel.viewDiff.toLocaleString()} 回
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
