'use client';

import MonthlyTrendBase from '@/components/MonthlyTrendBase';
import { MonthlyTrendPropsBase } from '@/types/MonthlyTrend';

interface MonthlyViewTrendProps extends MonthlyTrendPropsBase { }

export default function MonthlyViewTrend(props: MonthlyViewTrendProps) {
  return <MonthlyTrendBase {...props} sortKey="views" />;
}
