'use client';

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  currentTab: string;
  onChange: (tab: string) => void;
};

export const AppViewTabs = ({ currentTab, onChange }: Props) => {
  return (
    <Tabs
      value={currentTab}
      onValueChange={(value) => onChange(value as 'current' | 'subscribers' | 'views')}
      className="w-full justify-center mb-2 mt-2 px-4 md:px-6"
    >
      <TabsList className="flex justify-center gap-2 mt-4 mb-16 md:mb-2 flex-wrap">
        {['current', 'subscribers', 'views'].map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className={`
              px-4 py-2 rounded-full text-sm font-semibold
              transition-colors duration-200
              ${currentTab === tab
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-md'
                : 'bg-gray-700 text-cyan-200 hover:bg-gray-600'}
            `}
          >
            {tab === 'current' && '🎖 現登録・総再生数'}
            {tab === 'subscribers' && '📈 登録者数の増加数（月別）'}
            {tab === 'views' && '▶️ 再生数の増加数（月別）'}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
