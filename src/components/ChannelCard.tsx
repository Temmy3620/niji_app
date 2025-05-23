'use client';

// Removed usePathname import as currentTab is now passed via props
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChannelData } from "@/types/ChannelData";
import { useRouter } from 'next/navigation';
import { FaUserFriends, FaPlay, FaChartLine } from "react-icons/fa";

export default function ChannelCard({ channel, currentTab, rank, groupKey }: { channel: ChannelData; currentTab: 'current' | 'subscribers' | 'views'; rank?: number; groupKey: string; }) {
  const router = useRouter();
  const isCurrent = currentTab === 'current';
  const isMonthlySubscribers = currentTab === 'subscribers';
  const isMonthlyViews = currentTab === 'views';

  if (
    (currentTab === 'subscribers' && typeof channel.subscriberDiff !== 'number') ||
    (currentTab === 'views' && typeof channel.viewDiff !== 'number')
  ) {
    return null;
  }

  return (
    <motion.div
      layout
      key={channel.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card
        onClick={() => router.push(`/card/${encodeURIComponent(channel.title)}?id=${channel.id}&group=${groupKey}`)}
        className="relative p-4 border border-gray-700 bg-gray-900 rounded shadow-2xl transition-transform hover:scale-[1.02] hover:border-indigo-500 overflow-hidden cursor-pointer"
      >
        {typeof rank === 'number' && rank < 20 && (
          <div className="absolute top-1 left-2 text-gray-400 font-bold z-10">
            {rank + 1}
          </div>
        )}
        <div className="flex items-center gap-4">
          <Image
            src={channel.thumbnail}
            alt={`${channel.title} Thumbnail`}
            className="w-20 h-20 rounded-full ring-2 ring-offset-2 ring-indigo-500 object-cover flex-shrink-0"
            width={80}
            height={80}
            unoptimized
          />
          <div className="flex-grow min-w-0">
            <h2 className="text-lg font-semibold truncate text-white" title={channel.title}>{channel.title}</h2>

            {(isCurrent || isMonthlySubscribers) && (
              <p className="flex items-center gap-1 text-sm text-gray-300">
                <FaUserFriends className="text-gray-300 w-4 h-4" />
                {(Number(channel.subscribers)
                  ? `${Number(channel.subscribers).toLocaleString()} 人`
                  : <span className="text-red-400">現在の数値をしゅとくできません</span>)}
              </p>
            )}

            {isMonthlySubscribers && typeof channel.subscriberDiff === 'number' && (
              <p
                className={`flex items-center gap-1 text-sm ${channel.subscriberDiff >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
              >
                <FaChartLine className={`w-4 h-4 ${channel.subscriberDiff >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                {channel.subscriberDiff >= 0 ? '+' : ''}
                {channel.subscriberDiff.toLocaleString()} 人
              </p>
            )}

            {(isCurrent || isMonthlyViews) && (
              <p className="flex items-center gap-1 text-sm text-gray-300">
                <FaPlay className="text-gray-300 w-3 h-3" />
                {Number(channel.views)
                  ? `${Number(channel.views).toLocaleString()} 回`
                  : <span className="text-red-400">現在の数値を取得できません</span>}
              </p>
            )}

            {isMonthlyViews && typeof channel.viewDiff === 'number' && (
              <p
                className={`flex items-center gap-1 text-sm ${channel.viewDiff >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
              >
                <FaChartLine className={`w-4 h-4 ${channel.viewDiff >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                {channel.viewDiff >= 0 ? '+' : ''}
                {channel.viewDiff.toLocaleString()} 回
              </p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
