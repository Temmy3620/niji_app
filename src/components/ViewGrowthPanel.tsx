import { ChannelData } from '@/types/ChannelData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { GroupStats } from '@/types/MonthlyTrend';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  groupKey: string;
  monthlyStats: GroupStats[];
}

export default function ViewGrowthPanel({ groupKey, monthlyStats }: Props) {

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
        <CardContent className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyStats}
              margin={{ top: 10, right: 20, bottom: 10, left: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="totalViews" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
