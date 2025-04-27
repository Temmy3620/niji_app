'use client';

export default function Header() {
  return (
    <header className="relative overflow-hidden flex items-center justify-between px-2 md:px-6 bg-black sm:bg-[url('/header.png')] sm:bg-no-repeat sm:bg-left sm:bg-cover">
      <div className="flex items-center z-10">
        <img src="/titleLogo.png" alt="App Icon" width={210} height={210} />
        <div className="absolute bottom-1 right-2 text-[8px] text-white opacity-80 sm:text-xs">
          Your journey into the Vtuber realm starts here.
        </div>
      </div>
    </header>
  );
}
