import {
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
    <>
      <ScrollArea className="block md:hidden w-full max-w-full h-14 overflow-x-auto overflow-y-hidden">
        <TabsList className="flex gap-4 overflow-x-auto overflow-y-hidden whitespace-nowrap px-2">
          {groupsConfig.map((group) => (
            <TabsTrigger
              key={group.key}
              value={group.key}
              className={`relative w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 p-0 rounded-full overflow-hidden border-2 ${group.key === selectedGroupKey
                ? 'border-indigo-500'
                : 'border-transparent opacity-50 hover:opacity-100'
                } transition-all`}
            >
              <img
                src={group.iconUrl}
                alt={group.name}
                className="object-cover w-full h-full"
              />
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <TabsList className="hidden md:flex flex-wrap gap-4 justify-start">
        {groupsConfig.map((group) => (
          <TabsTrigger
            key={group.key}
            value={group.key}
            className={`relative w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 p-0 rounded-full overflow-hidden border-2 ${group.key === selectedGroupKey
              ? 'border-indigo-500'
              : 'border-transparent opacity-50 hover:opacity-100'
              } transition-all`}
          >
            <img
              src={group.iconUrl}
              alt={group.name}
              className="object-cover w-full h-full"
            />
          </TabsTrigger>
        ))}
      </TabsList>
    </>
  );
}
