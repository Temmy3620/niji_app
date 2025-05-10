import { ChannelData } from '@/types/ChannelData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";

interface Props {
  groupKey: string;
  allGroupData: Record<string, { groupName: string; channels: ChannelData[] }>;
}

export default function TotalStatsPanel({ groupKey, allGroupData }: Props) {
  const channels = allGroupData[groupKey]?.channels || [];
  const totalChannels = channels.length;

  const totalSubscribers = channels.reduce((sum, c) => {
    const value = typeof c.subscribers === 'number' ? c.subscribers : Number(c.subscribers);
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  const totalViews = channels.reduce((sum, c) => {
    const value = typeof c.views === 'number' ? c.views : Number(c.views);
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  const averageViewsPerChannel = totalChannels > 0 ? Math.floor(totalViews / totalChannels) : 0;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setOpen(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <motion.div
        key={groupKey}
        className="flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onClick={() => setOpen(true)}
      >
        <Card className="relative p-4 border border-slate-600 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded transition-transform hover:scale-[1.01] overflow-hidden w-full max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white text-lg sm:text-xl font-bold tracking-wider font-mono">
              {allGroupData[groupKey]?.groupName} の合計データ（チャンネル数・登録者数・総再生数）
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row flex-wrap justify-around items-center text-white py-4 gap-6 text-sm sm:text-base text-center">
            <motion.div
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex justify-center items-end gap-1">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-widest text-[#38fdfd] font-mono whitespace-nowrap">{totalChannels.toLocaleString()}</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-300 uppercase tracking-wide">チャンネル数</div>
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex justify-center items-end gap-1">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-widest text-[#38fdfd] font-mono whitespace-nowrap">{totalSubscribers.toLocaleString()}</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-300 uppercase tracking-wide">登録者数合計</div>
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="flex justify-center items-end gap-1">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-widest text-[#38fdfd] font-mono whitespace-nowrap">{totalViews.toLocaleString()}</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-300 uppercase tracking-wide">総再生数合計</div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
      <DialogContent className="max-w-2xl bg-gray-900 border border-slate-700 text-white shadow-xl rounded-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold">モーダル表示</DialogTitle>
          </DialogHeader>
          <div className="mb-4 px-4 py-3 rounded-md bg-slate-800 border border-slate-600">
            <div className="text-sm text-slate-300 mb-1">1チャンネルあたりの平均再生数</div>
            <div className="text-2xl text-cyan-400 font-extrabold font-mono tracking-wider">
              {averageViewsPerChannel.toLocaleString()} 回
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
