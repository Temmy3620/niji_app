import json
import random

# JSONファイルを読み込む
with open('data/youtube_stats/2025-03-01_0119.json', 'r') as f:
    data = json.load(f)

# 全てのVTuberの統計データを収集
all_stats = []
for group in ['nijisanji', 'hololive', 'vspo', 'aogiri']:
    for vtuber in data[group]:
        all_stats.append({
            'subscribers': vtuber['subscribers'],
            'views': vtuber['views']
        })

# データをランダムに並び替え
random.shuffle(all_stats)

# 結果を表示
print('シャッフルされた統計データ:')
for i, stat in enumerate(all_stats, 1):
    print(f'{i}. 登録者数: {stat["subscribers"]:,}人, 総視聴回数: {stat["views"]:,}回')
