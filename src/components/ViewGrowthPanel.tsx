import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { GroupStats } from '@/types/MonthlyTrend';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  groupKey: string;
  monthlyStats: GroupStats[];
  selectedDate: string;
}

export default function ViewGrowthPanel({ groupKey, monthlyStats, selectedDate }: Props) {
  return (
    <motion.div
      key={groupKey}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="relative p-2 border border-gray-700 bg-gray-900 rounded shadow-2xl transition-transform hover:scale-[1.001] overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold tracking-wide text-white">
            {groupKey} 全体の再生数増加比率
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyStats}
              margin={{ top: 10, right: 20, bottom: 10, left: 50 }}
            >
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip
                formatter={(value: number) => [`+${value.toLocaleString()}`, '増加数合計']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#e2e8f0',
                  border: '1px solid #64748b',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '13px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                }}
                itemStyle={{ color: '#a5b4fc' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Line
                type="monotone"
                dataKey="totalViews"
                stroke="#60a5fa"
                strokeWidth={2.5}
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
