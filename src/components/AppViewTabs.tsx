'use client';

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  currentTab: string;
  onChange: (tab: string) => void;
};

export const AppViewTabs = ({ currentTab, onChange }: Props) => {
  return (
    <Tabs value={currentTab} onValueChange={(value) => onChange(value as 'current' | 'subscribers' | 'views')} className="w-full justify-center mb-6 mt-2">
      <TabsList className="flex gap-4">
        <TabsTrigger value="current">登録者数・総再生数</TabsTrigger>
        <TabsTrigger value="subscribers">月間登録者数推移</TabsTrigger>
        <TabsTrigger value="views">月間総再生数推移</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
