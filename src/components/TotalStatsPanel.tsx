import { ChannelData } from '@/types/ChannelData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';

interface Props {
  groupKey: string;
  allGroupData: Record<string, { groupName: string; channels: ChannelData[] }>;
}

export default function TotalStatsPanel({ groupKey, allGroupData }: Props) {
  const channels = allGroupData[groupKey]?.channels || [];
  const totalTalents = channels.length;

  const totalSubscribers = channels.reduce((sum, c) => {
    const value = typeof c.subscribers === 'number' ? c.subscribers : Number(c.subscribers);
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  const totalViews = channels.reduce((sum, c) => {
    const value = typeof c.views === 'number' ? c.views : Number(c.views);
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  return (
    <motion.div
      key={groupKey}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="relative p-2 border border-gray-700 bg-gray-900 rounded shadow-2xl transition-transform hover:scale-[1.001] overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base sm:text-xl font-bold tracking-wide text-white">
            {allGroupData[groupKey]?.groupName} の合計データ（チャンネル数・登録者数・総再生数）
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row flex-wrap justify-around items-center text-white pb-2 gap-2 text-sm sm:text-base">
          <motion.div
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="text-yellow-200 text-3xl font-extrabold leading-tight">{totalTalents.toLocaleString()}</div>
            <div className="text-sm text-gray-400">チャンネル数</div>
          </motion.div>
          <motion.div
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="text-yellow-200 text-3xl font-extrabold leading-tight">{totalSubscribers.toLocaleString()}</div>
            <div className="text-sm text-gray-400">登録者数合計</div>
          </motion.div>
          <motion.div
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="text-yellow-200 text-3xl font-extrabold leading-tight">{totalViews.toLocaleString()}</div>
            <div className="text-sm text-gray-400">総再生数合計</div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
