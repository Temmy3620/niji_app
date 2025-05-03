'use client';

import MonthlyTrendBase from '@/components/MonthlyTrendBase';
import { MonthlyTrendPropsBase } from '@/types/MonthlyTrend';

type MonthlyViewTrendProps = MonthlyTrendPropsBase;

export default function MonthlyViewTrend(props: MonthlyViewTrendProps) {
  return <MonthlyTrendBase {...props} sortKey="views" />;
}
