'use client';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gradient-to-r from-purple-900 to-indigo-900 shadow">
      <div className="flex items-center">
        <Image src="/icon.png" alt="App Icon" width={200} height={200} className="ml-4 drop-shadow-md" />
      </div>
    </header>
  );
}
