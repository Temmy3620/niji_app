'use client';
import { ChannelData } from '@/types/ChannelData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';

interface Props {
  groupKey: string;
}

export default function ViewGrowthPanel({ groupKey }: Props) {

  return (
    <motion.div
      key={groupKey}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="relative p-2 border border-indigo-400 bg-gray-900 rounded shadow-2xl transition-transform hover:scale-[1.001] overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-wide text-white">
            {groupKey} の再生数増加比率
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-around items-center text-white pb-2">
          再生数増加データを表示
        </CardContent>
      </Card>
    </motion.div>
  );
}
