export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10 px-4 py-10 md:px-8 text-sm">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div className="flex flex-col items-start space-y-2">
          <span className="text-xs sm:text-sm opacity-70">Your journey into the Vtuber realm starts here.</span>
          <span className="text-xs opacity-50">© 2025 Vtube Tracker. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
