import {
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface GroupTabsProps {
  groupsConfig: {
    key: string;
    name: string;
    iconUrl: string;
  }[];
  selectedGroupKey: string;
}

export default function GroupTabs({ groupsConfig, selectedGroupKey }: GroupTabsProps) {
  return (
    <TabsList className="flex gap-4">
      {groupsConfig.map((group) => (
        <TabsTrigger
          key={group.key}
          value={group.key}
          className={`relative bg-gray-200 w-12 h-12 rounded-full overflow-hidden ${group.key === selectedGroupKey
            ? 'border-indigo-500'
            : 'border-transparent opacity-50 hover:opacity-100'
            } transition-all`}
        >
          <div className="bg-white rounded-full">
            <img
              src={group.iconUrl}
              alt={group.name}
              className="object-cover w-full h-full scale-[1.5] rounded-full"
            />
          </div>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
