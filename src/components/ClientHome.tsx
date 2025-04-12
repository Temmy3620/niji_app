'use client';

import { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"; // Tabs関連をインポート

// --- 型定義 (page.tsxから渡されるデータ構造) ---
type ChannelData = {
  id: string;
  title: string;
  thumbnail: string;
  subscribers: string; // '非公開' を含む
  views: string;
};
interface GroupData {
  groupName: string;
  channels: ChannelData[];
}
interface GroupDataMap {
  [groupKey: string]: GroupData;
}
interface GroupConfig {
  key: string; // channelIds.tsのキー ('nijisanji', 'hololive'...)
  name: string; // タブ表示名 ('にじさんじ', 'ホロライブ'...)
}
// ---------------------------------------------

// --- Propsの型 ---
interface ClientHomeProps {
  allGroupData: GroupDataMap;
  groupsConfig: GroupConfig[];
  defaultGroupKey: string;
}
// ---------------

type SortByType = 'subscribers' | 'views';
// タブごとのソート状態を管理する型
interface SortState {
  [groupKey: string]: SortByType;
}

// --- チャンネルカード表示コンポーネント ---
const ChannelCard = ({ channel }: { channel: ChannelData }) => {
  const subscriberText = channel.subscribers === '非公開'
    ? '非公開'
    : (Number(channel.subscribers) || 0).toLocaleString() + ' 人';

  // eslint-disable-next-line @next/next/no-img-element
  const imgElement = <img
    src={channel.thumbnail}
    alt={`${channel.title} Thumbnail`}
    className="w-20 h-20 rounded-full ring-2 ring-offset-2 ring-indigo-500 object-cover flex-shrink-0"
    loading="lazy" // 遅延読み込み
    width="80"
    height="80"
  />;

  return (
    <Card key={channel.id} className="p-4 border border-gray-700 bg-gray-900 rounded shadow-2xl transition-transform hover:scale-[1.02] hover:border-indigo-500 overflow-hidden">
      <div className="flex items-center gap-4">
        {imgElement}
        <div className="flex-grow min-w-0"> {/* テキスト折り返しのため */}
          <h2 className="text-lg font-semibold truncate text-white" title={channel.title}>{channel.title}</h2>
          <p className="flex items-center gap-1 text-sm text-gray-300">
            <span role="img" aria-label="Subscribers">👥</span>
            {subscriberText}
          </p>
          <p className="flex items-center gap-1 text-sm text-gray-300">
            <span role="img" aria-label="Views">▶️</span>
            {(Number(channel.views) || 0).toLocaleString()} 回
          </p>
        </div>
      </div>
    </Card>
  );
};
// ------------------------------------

export default function ClientHome({ allGroupData, groupsConfig, defaultGroupKey }: ClientHomeProps) {
  console.log('[Client] ClientHome Rendering. Groups:', groupsConfig.map(g => g.name));

  // タブごとの初期ソート状態を設定
  const initialSortState: SortState = groupsConfig.reduce((acc, group) => {
    acc[group.key] = 'subscribers'; // デフォルトは登録者順
    return acc;
  }, {} as SortState);
  const [sortState, setSortState] = useState<SortState>(initialSortState);

  // ソート関数 (useMemoでメモ化するタブコンテンツ内で使用)
  const getSortedData = (groupKey: string): ChannelData[] => {
    const channels = allGroupData[groupKey]?.channels || [];
    const sortBy = sortState[groupKey] || 'subscribers';
    console.log(`[Client] Sorting group "${groupKey}" by "${sortBy}"`);
    return [...channels].sort((a, b) => {
      // '非公開' は数値比較できないため、-1 (または 0) として扱う (降順ソートで最下位になるように)
      const valA = sortBy === 'subscribers' && a.subscribers === '非公開' ? -1 : (Number(a[sortBy]) || 0);
      const valB = sortBy === 'subscribers' && b.subscribers === '非公開' ? -1 : (Number(b[sortBy]) || 0);
      return valB - valA; // 降順
    });
  };

  // ソート順変更ハンドラ
  const handleSortChange = (groupKey: string, value: string) => {
    console.log(`[Client] Sort changed for "${groupKey}" to "${value}"`);
    setSortState(prev => ({ ...prev, [groupKey]: value as SortByType }));
  };

  // 表示するグループがない場合
  if (!groupsConfig || groupsConfig.length === 0) {
    return <main className="p-6"><p className="text-white text-center">表示可能なグループがありません。</p></main>;
  }

  return (
    <main className="p-4 md:p-6">
      <Tabs defaultValue={defaultGroupKey} className="w-full">
        {/* --- タブトリガー (ボタン) --- */}
        {/* グループ数に応じて列数を調整 or overflow-x-auto を使う */}
        <TabsList className={`grid w-full grid-cols-${Math.min(groupsConfig.length, 4)} sm:grid-cols-${Math.min(groupsConfig.length, 5)} gap-2 mb-4`}>
          {groupsConfig.map((group) => (
            <TabsTrigger
              key={group.key}
              value={group.key}
              className="data-[state=active]:shadow-md data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-3 py-1.5 text-sm sm:text-base" // サイズ調整
            >
              {group.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* --- タブコンテンツ --- */}
        {groupsConfig.map((group) => {
          // useMemo を使ってソート済みデータをメモ化
          const sortedChannels = useMemo(
            () => getSortedData(group.key),
            // 依存配列: 対象グループのチャンネルリスト と そのグループのソート状態
            [allGroupData[group.key]?.channels, sortState[group.key]]
          );
          console.log(`[Client] Rendering content for "${group.key}". Channels: ${sortedChannels.length}`);

          return (
            <TabsContent key={group.key} value={group.key} className="mt-4 focus-visible:ring-0 focus-visible:ring-offset-0">
              {/* ソート用Select */}
              <div className="mb-4 flex justify-end">
                <Select
                  onValueChange={(value) => handleSortChange(group.key, value)}
                  value={sortState[group.key] || 'subscribers'}
                >
                  <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white text-sm">
                    <SelectValue placeholder="並び替え" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 text-white border-gray-700">
                    <SelectGroup>
                      <SelectItem value="subscribers" className="cursor-pointer hover:bg-indigo-700 text-sm">登録者数順</SelectItem>
                      <SelectItem value="views" className="cursor-pointer hover:bg-indigo-700 text-sm">総再生数順</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* チャンネルリスト表示 */}
              {sortedChannels.length > 0 ? (
                // レスポンシブなグリッドレイアウト
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedChannels.map((channel) => (
                    <ChannelCard key={channel.id} channel={channel} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 mt-8">
                  {/* API取得失敗とデータ0件を区別するのは難しい */}
                  チャンネルデータが見つかりません。
                </p>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </main>
  );
}
