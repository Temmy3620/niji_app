import { GROUPS_CONFIG } from '@/constants/groupsConfig';

/**
 * groupKey からグループ名を取得する
 * @param key - 'nijisanji' などの groupKey
 * @returns グループ名（見つからなければ undefined）
 */
export function getGroupNameByKey(key: string): string | undefined {
  return GROUPS_CONFIG.find(group => group.key === key)?.name;
}
