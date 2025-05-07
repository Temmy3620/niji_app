'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type MonthlyDiff = {
  month: string;
  subscriberDiff?: number;
  viewDiff?: number;
};

export function ChannelGrowthCharts({
  monthlyDiffs,
  type,
}: {
  monthlyDiffs: MonthlyDiff[];
  type: 'subscribers' | 'views';
}) {
  const isSubscribers = type === 'subscribers';

  const chartData = [...monthlyDiffs].reverse().map(diff => ({
    month: diff.month,
    value: isSubscribers ? diff.subscriberDiff ?? 0 : diff.viewDiff ?? 0,
  }));

  const gradientId = isSubscribers ? 'neonGradientSubscribers' : 'neonGradientViews';
  const tickColor = isSubscribers ? '#5eead4' : '#4ade80';
  const tooltipColor = isSubscribers ? '#38fdfd' : '#4ade80';
  const tooltipBorder = isSubscribers ? '#38fdfd' : '#4ade80';
  const tooltipLabel = isSubscribers ? '登録者増加数' : '再生数増加数';
  const unit = isSubscribers ? '人' : '回';

  return (
    <div className="w-full h-64 mt-5">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={tooltipColor} />
              <stop offset="100%" stopColor={tooltipColor} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            stroke={tickColor}
            tick={{ fill: tickColor, fontSize: 12, fontFamily: 'monospace' }}
            tickFormatter={(month) => month.slice(5)}
            interval={0}
          />
          <YAxis
            stroke={tickColor}
            tick={{ fill: tickColor, fontSize: 12, fontFamily: 'monospace' }}
          />
          <Tooltip
            formatter={(value) => [
              `${typeof value === 'number' && value > 0 ? '+' : ''}${typeof value === 'number' ? value.toLocaleString() : value} ${unit}`,
              tooltipLabel,
            ]}
            contentStyle={{
              backgroundColor: '#0a0f1c',
              color: tooltipColor,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '10px',
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={`url(#${gradientId})`}
            strokeWidth={3}
            dot={{ r: 4, stroke: '#38fdfd', strokeWidth: 2, fill: '#0f172a' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
