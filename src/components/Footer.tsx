export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10 px-4 py-10 md:px-8 text-sm">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div className="flex flex-col items-start space-y-2">
          <span className="text-xs sm:text-sm opacity-70">Your journey into the Vtuber realm starts here.</span>
          <span className="text-xs opacity-50">© 2025 Vtube Tracker. All rights reserved.</span>
        </div>
        <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition">
          <a
            href="https://x.com/abgZQodUF267938"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2"
          >
            <img src="/x_icon.png" alt="X" className="w-6 h-6" />
            <span className="text-sm font-semibold">@VtubeTracker</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
