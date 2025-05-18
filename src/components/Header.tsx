'use client';

export default function Header() {
  return (
    <header className="relative overflow-hidden flex items-center justify-between px-2 md:px-6 bg-black sm:bg-[url('/header.png')] sm:bg-no-repeat sm:bg-left sm:bg-cover">
      <div className="flex items-center z-10">
        <img src="/titleLogo.png" alt="App Icon" width={210} height={210} />
      </div>
      <div className="z-10 mt-6 sm:mt-12 mb-2 self-end">
        <a
          href="https://x.com/abgZQodUF267938"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white px-2 sm:px-3 py-1.5 rounded-full border border-white/30 bg-gradient-to-r from-white/10 via-white/5 to-transparent backdrop-blur-md shadow-sm hover:scale-105 transition-transform duration-200"
        >
          <img src="/x_icon.png" alt="X" className="w-3 h-3 sm:w-5 sm:h-5" />
          <span className="text-[10px] sm:text-sm">@VtubeTracker</span>
        </a>
      </div>
    </header>
  );
}
