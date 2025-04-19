'use client';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="relative overflow-hidden flex items-center justify-between px-2 md:px-6 py-2 border-b border-gray-700 bg-gradient-to-r from-purple-900 to-indigo-900 shadow">
      <div className="flex items-center z-10">
        <Image src="/icon.png" alt="App Icon" width={200} height={200} className="drop-shadow-md" />
        <div className="absolute bottom-2 right-5 text-xs text-white opacity-80">
          Your journey into the Vtuber realm starts here.
        </div>
      </div>
    </header>
  );
}
