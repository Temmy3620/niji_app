import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { GroupStats } from '@/types/MonthlyTrend';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GROUPS_CONFIG } from '@/constants/groupsConfig';

interface Props {
  groupKey: string;
  monthlyStats: GroupStats[];
  selectedDate: string;
}

export default function ViewGrowthPanel({ groupKey, monthlyStats, selectedDate }: Props) {
  const [yAxisWidth, setYAxisWidth] = useState(60);

  useEffect(() => {
    const handleResize = () => {
      setYAxisWidth(window.innerWidth < 640 ? 45 : 60);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const groupName = GROUPS_CONFIG.find(group => group.key === groupKey)?.name ?? groupKey;

  return (
    <motion.div
      key={groupKey}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="relative p-4 border border-slate-600 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded transition-transform hover:scale-[1.01] overflow-hidden">
        <CardHeader>
          <CardTitle className="text-white text-lg sm:text-xl font-bold tracking-wider font-mono">
            {groupName}（全チャンネル合計）：月別再生数の推移
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[220px] sm:h-[180px] w-full text-white">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyStats}
              margin={{ top: 10, right: 20, bottom: 10, left: 50 }}
            >
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                stroke="#cbd5e1"
                tickFormatter={(month) => month.slice(5)}
                interval={0}
              />
              <YAxis stroke="#cbd5e1" width={yAxisWidth} />
              <Tooltip
                formatter={(value: number) => [`+${value.toLocaleString()}`, '増加数合計']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#e2e8f0',
                  border: '1px solid #64748b',
                  borderRadius: '6px',
                  padding: '4px 6px',
                  fontSize: '12px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                }}
                itemStyle={{ color: '#a5b4fc' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Line
                type="monotone"
                dataKey="totalViews"
                stroke="#60a5fa"
                strokeWidth={3}
                dot={{ r: 3, stroke: '#93c5fd', strokeWidth: 2, fill: '#1e40af' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
