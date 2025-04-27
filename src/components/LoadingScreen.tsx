'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 2秒後にフェードアウト（好きな秒数にしてOK）
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      {/* ロゴ */}
      <div className="animate-pulse">
        <Image
          src="/tabIcon.png" // publicにあるロゴファイルを指定
          alt="Vtube Traker Logo"
          width={100}
          height={100}
        />
      </div>
      {/* テキスト */}
      <p className="mt-4 text-purple-400 text-sm">Loading...</p>
    </div>
  );
}
