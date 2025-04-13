'use client';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gradient-to-r from-purple-900 to-indigo-900 shadow">
      <h1 className="text-3xl font-extrabold text-white tracking-wide">
        🌈 Vtuber_App
      </h1>
      <p className="text-sm text-gray-300 hidden md:block">
        Let's explore the world of Vtuber !!
      </p>
    </header>
  );
}
