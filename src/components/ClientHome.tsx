'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ChannelData = {
  id: string;
  title: string;
  thumbnail: string;
  subscribers: string;
  views: string;
};

export default function ClientHome({ data }: { data: ChannelData[] }) {
  const [sortBy, setSortBy] = useState<'subscribers' | 'views'>('subscribers');

  const sortedData = [...data].sort((a, b) => {
    return Number(b[sortBy]) - Number(a[sortBy]);
  });

  return (
    <main className="p-6">
      <div className="mb-4 flex justify-end">
        <Select onValueChange={(value) => setSortBy(value as 'subscribers' | 'views')} defaultValue={sortBy}>
          <SelectTrigger className="w-[200px] bg-gray-800 border border-indigo-500 text-white font-semibold shadow-md rounded-md hover:border-indigo-400 transition">
            <SelectValue placeholder="並び替え" />
          </SelectTrigger>
          <SelectContent className="z-50 bg-gray-900 text-white border border-gray-700 shadow-lg rounded-md">
            <SelectGroup>
              <SelectItem value="subscribers" className="hover:bg-indigo-600 focus:bg-indigo-600 cursor-pointer">登録者数順</SelectItem>
              <SelectItem value="views" className="hover:bg-indigo-600 focus:bg-indigo-600 cursor-pointer">総再生数順</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sortedData.map((channel) => (
          <Card key={channel.id} className="p-4 border border-gray-700 bg-gray-900 rounded shadow-2xl transition-transform hover:scale-[1.02] hover:border-indigo-500">
            <div className="flex items-center gap-4">
              <img
                src={channel.thumbnail}
                className="w-20 h-20 rounded-full ring-2 ring-offset-2 ring-indigo-500 transition-transform hover:scale-105"
              />
              <div>
                <h2 className="text-lg font-semibold truncate max-w-[200px]">{channel.title}</h2>
                <p className="flex items-center gap-1 text-sm text-gray-300">
                  👥 {Number(channel.subscribers).toLocaleString()} 人
                </p>
                <p className="flex items-center gap-1 text-sm text-gray-300">
                  ▶️ {Number(channel.views).toLocaleString()} 回
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
