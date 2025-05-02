'use client';

import MonthlyTrendBase from '@/components/MonthlyTrendBase';
import { MonthlyTrendPropsBase } from '@/types/MonthlyTrend';

interface MonthlySubscriberTrendProps extends MonthlyTrendPropsBase { }

export default function MonthlySubscriberTrend(props: MonthlySubscriberTrendProps) {
  return <MonthlyTrendBase {...props} sortKey="subscribers" />;
}
