'use client';

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  currentTab: string;
  onChange: (tab: string) => void;
};

export const AppViewTabs = ({ currentTab, onChange }: Props) => {
  return (
    <Tabs value={currentTab} onValueChange={(value) => onChange(value as 'current' | 'subscribers' | 'views')} className="w-full justify-center mb-2 mt-2 px-4 md:px-6">
      <TabsList className="flex justify-center gap-2 mt-4 mb-16 md:mb-2 flex-wrap">
        <TabsTrigger
          value="current"
          className={`
            px-4 py-2 rounded-full text-sm font-semibold
            transition-colors duration-200
            ${currentTab === 'current'
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
          `}
        >
          🎖 現在のランキング
        </TabsTrigger>
        <TabsTrigger
          value="subscribers"
          className={`
            px-4 py-2 rounded-full text-sm font-semibold
            transition-colors duration-200
            ${currentTab === 'subscribers'
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
          `}
        >
          📈 登録者数の増加ランキング（月別）
        </TabsTrigger>
        <TabsTrigger
          value="views"
          className={`
            px-4 py-2 rounded-full text-sm font-semibold
            transition-colors duration-200
            ${currentTab === 'views'
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
          `}
        >
          ▶️ 再生数の増加ランキング（月別）
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
