import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { GroupStats } from '@/types/MonthlyTrend'; // GroupStats の型定義をインポート (totalSubscribers を含む想定)
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { GROUPS_CONFIG } from '@/constants/groupsConfig';

// formattedDataの各要素の型を定義 (GroupStatsを拡張)
interface FormattedSubscriberDataPoint extends GroupStats {
  prevValue: number | null;
  diffValue: number | null;
  diffRatio: number | null;
}

// CustomizedDotコンポーネントのPropsの型を定義
interface CustomizedDotProps {
  cx?: number; // rechartsから渡されるx座標 (通常は存在するが念のためoptional)
  cy?: number; // rechartsから渡されるy座標 (通常は存在するが念のためoptional)
  index?: number; // rechartsから渡されるデータ配列のインデックス
  payload?: FormattedSubscriberDataPoint; // rechartsから渡される、この点に対応するデータオブジェクト
  // あなたが明示的に渡しているプロパティ
  data: FormattedSubscriberDataPoint[];
}


interface Props {
  groupKey: string;
  monthlyStats: GroupStats[]; // GroupStats[] は totalSubscribers を含むオブジェクトの配列と想定
  selectedDate: string;
}

export default function SubscriberGrowthPanel({ groupKey, monthlyStats, selectedDate }: Props) {
  console.log('selectedDate :', selectedDate);
  const [yAxisWidth, setYAxisWidth] = useState(60); // 初期値は適切に設定してください

  useEffect(() => {
    const handleResize = () => {
      // Y軸の幅を調整 (値は元のコードから)
      setYAxisWidth(window.innerWidth < 640 ? 30 : 40);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const groupName = GROUPS_CONFIG.find(group => group.key === groupKey)?.name ?? groupKey;

  // formattedDataの型を明示的に指定
  const formattedData: FormattedSubscriberDataPoint[] = monthlyStats.map((item, index, array) => {
    const prev = array[index - 1]?.totalSubscribers ?? null; // totalSubscribers を使用
    const diff = prev !== null ? item.totalSubscribers - prev : null; // totalSubscribers を使用
    const ratio = prev && prev !== 0 && diff !== null ? ((diff / prev) * 100) : null;
    return {
      ...item,
      prevValue: prev,
      diffValue: diff,
      diffRatio: ratio,
    };
  });

  // CustomizedDot コンポーネントで定義したPropsの型を使用
  const CustomizedDot = (props: CustomizedDotProps) => {
    // propsから必要な値を取り出す (存在しない可能性も考慮)
    const { cx, cy, index, data } = props;

    // cx, cy, index が undefined の場合のデフォルト値やエラーハンドリング
    if (cx === undefined || cy === undefined || index === undefined) {
      return null; // または適切なフォールバック表示
    }

    const isLast = index === data.length - 1;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        stroke="#38fdfd"
        strokeWidth={2}
        fill={isLast ? 'none' : '#0f172a'}
        strokeDasharray={isLast ? '4 2' : '0'}
        filter="url(#glow)"
        style={{ opacity: 0.8 }}
      />
    );
  };

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
            {groupName}（全チャンネル合計）：月別登録者数の推移
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[220px] sm:h-[180px] w-full text-white">
          <ResponsiveContainer width="100%" height="100%">
            {/* LineChartのdataプロパティには型付けされたformattedDataを渡す */}
            <LineChart
              data={formattedData}
              margin={{ top: 10, right: 20, bottom: 10, left: 10 }} // left margin調整
            >
              {/* ... (defs, CartesianGrid, XAxis, YAxis) */}
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="neonGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38fdfd" />
                  <stop offset="100%" stopColor="#00f0ff" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                stroke="#5eead4"
                tick={{ fill: '#5eead4', fontSize: 12, fontFamily: 'monospace' }}
                tickLine={{ stroke: '#5eead4', strokeWidth: 0.3 }}
                axisLine={{ stroke: '#5eead4', strokeWidth: 0.3 }}
                tickFormatter={(month) => month.slice(5)}
                interval={0}
              />
              <YAxis
                stroke="#5eead4"
                tick={{ fill: '#5eead4', fontSize: 12, fontFamily: 'monospace' }}
                tickLine={{ stroke: '#5eead4', strokeWidth: 0.3 }}
                axisLine={{ stroke: '#5eead4', strokeWidth: 0.3 }}
                width={yAxisWidth} // stateからY軸幅を設定
              />
              <Tooltip
                formatter={(value, name, props) => {
                  // Tooltipのpropsにも型を付けられるとなお良い (Payload<ValueType, NameType>など)
                  // ここではprops.payloadがFormattedSubscriberDataPointであることを期待
                  const data = props.payload as FormattedSubscriberDataPoint | undefined;
                  const ratio = data?.diffRatio;
                  const diff = data?.diffValue;
                  const formattedRatio = ratio !== null && ratio !== undefined
                    ? `${ratio > 0 ? '+' : ''}${ratio.toFixed(1)}%`
                    : '';
                  const formattedDiff = diff !== null && diff !== undefined
                    ? `${diff > 0 ? '+' : ''}${diff.toLocaleString()}`
                    : '';

                  // valueがnumberであることを確認
                  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;

                  return [
                    <div key="tooltip-content" style={{ fontFamily: 'monospace', lineHeight: 1.6 }}>
                      <div style={{ fontSize: '15px', fontWeight: 600 }}>
                        {/* Tooltipでは 'totalSubscribers' が value として渡される */}
                        登録者数：{formattedValue}
                      </div>
                      {formattedRatio && formattedDiff && (
                        <div style={{ fontSize: '14px', color: '#7dd3fc' }}>
                          前月比：{formattedRatio}（{formattedDiff}）
                        </div>
                      )}
                    </div>,
                    null // nameは表示しないのでnull
                  ];
                }}
                contentStyle={{
                  backgroundColor: '#0a0f1c',
                  color: '#38fdfd',
                  border: '1px solid #38fdfd',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '14px',
                  boxShadow: '0 0 8px rgba(56, 253, 253, 0.3)',
                  backdropFilter: 'blur(4px)',
                }}
                // itemStyle={{ color: '#38fdfd' }} // formatterでカスタマイズしたので不要かも
                labelStyle={{ color: '#7dd3fc' }}
              />
              <Line
                type="monotone"
                dataKey="totalSubscribers" // ここを totalSubscribers に変更
                stroke="url(#neonGradient)"
                strokeWidth={4}
                // dotに関数を渡す場合、rechartsがpropsを注入する
                // コンポーネントを渡す場合、明示的にpropsを渡す必要がある
                dot={<CustomizedDot data={formattedData} />} // dataを明示的に渡す
                activeDot={{ r: 8 }}
                isAnimationActive={true}
                animationBegin={300}
                animationDuration={1200}
                animationEasing="ease"
                animateNewValues={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
