'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavTabs = () => {
  const pathname = usePathname();
  const tabs = [
    { href: '/', label: '登録者数・総再生数' },
    { href: '/MonthlySubscribers', label: '月間登録者数推移ランキング' },
    { href: '/MonthlyViews', label: '月間総再生数推移ランキング' },
  ];

  return (
    <nav className="flex justify-center gap-6 mb-6 mt-2 text-sm">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-1 rounded-full border transition-colors duration-200 ${isActive
              ? 'bg-white text-black font-semibold border-white'
              : 'text-gray-300 border-gray-700 hover:bg-gray-700 hover:text-white hover:border-white'}`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavTabs;
