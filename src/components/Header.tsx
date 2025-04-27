'use client';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="relative overflow-hidden flex items-center justify-between px-2 md:px-6 bg-[url('/header.png')] bg-no-repeat bg-left bg-cover">
      <div className="flex items-center z-10">
        <Image src="/titleLogo.png" alt="App Icon" width={210} height={210} className="" />
        <div className="absolute bottom-1 right-2 text-[8px] text-white opacity-80 sm:text-xs">
          Your journey into the Vtuber realm starts here.
        </div>
      </div>
    </header>
  );
}
