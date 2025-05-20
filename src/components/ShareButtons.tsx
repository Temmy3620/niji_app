"use client";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

interface ShareButtonsProps {
  postTitle: string;
  hash?: string; // 省略可に変更
}

export const ShareButtons = ({ postTitle, hash }: ShareButtonsProps) => {
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);

  const xPostText = `${postTitle} | #VtuberTracker`;

  const getCurrentShareUrl = () => {
    if (typeof window === "undefined") return null;
    return hash
      ? `${window.location.origin}${window.location.pathname}${hash}`
      : `${window.location.origin}${window.location.pathname}`;
  };

  const handleShare = (baseUrl: string) => {
    const url = getCurrentShareUrl();
    if (!url) return;
    window.open(baseUrl + encodeURIComponent(url), "_blank");
  };

  const handleCopyLink = () => {
    const url = getCurrentShareUrl();
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setShowCopiedAlert(true);
      setTimeout(() => setShowCopiedAlert(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-2 my-1 text-[10px] sm:text-xs relative">
      {/* コピー完了アラート */}
      {showCopiedAlert && (
        <Alert
          variant="default"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] w-fit px-4 py-2 flex items-center gap-2 shadow-lg bg-green-100 text-green-800 border border-green-200 rounded-md"
        >
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <div>
            <AlertTitle className="text-xs font-bold text-green-700">コピー完了</AlertTitle>
            <AlertDescription className="text-xs text-green-700">
              リンクをコピーしました！
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* リンクコピー */}
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1 px-2 h-7 rounded-full bg-cyan-900/60 hover:bg-cyan-800 hover:opacity-90 text-cyan-100 font-normal transition cursor-pointer text-[8px] sm:text-[12px]"
        title="このセクションへのリンクをコピー"
        style={{ minWidth: "unset" }}
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className="inline-block">
          <path d="M8.5 11V7.5A3.5 3.5 0 0 1 12 4a3.5 3.5 0 0 1 3.5 3.5v3.5" stroke="#67e8f9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="5" y="11" width="14" height="8" rx="3" stroke="#67e8f9" strokeWidth="1.5" />
        </svg>
        リンクをコピー
      </button>

      <button
        onClick={() => handleShare(`https://twitter.com/intent/tweet?text=${encodeURIComponent(xPostText)}&url=`)}
        className="flex items-center gap-1 px-2 h-7 rounded-full bg-cyan-900/60 hover:bg-cyan-800 hover:opacity-90 text-cyan-100 font-normal transition text-[8px] sm:text-[12px]"
        style={{ minWidth: "unset" }}
      >
        <svg width="15" height="18" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M853.818 320H1042L709.091 692.308L1099 1100H825.273L601.364 861.538L348.818 1100H160L513.455 693.077L134 320H417.818L620.545 541.538L853.818 320ZM805.364 1020H891.818L415.909 399.231H325.364L805.364 1020Z" fill="white" />
        </svg>
        でシェア
      </button>

      <button
        onClick={() => handleShare(`https://www.reddit.com/submit?title=${encodeURIComponent(postTitle)}&url=`)}
        className="flex items-center gap-1 px-2 h-7 rounded-full bg-cyan-900/60 hover:bg-cyan-800 hover:opacity-90 text-cyan-100 font-normal transition text-[8px] sm:text-[12px]"
        style={{ minWidth: "unset" }}
      >
        <svg width="16" height="16" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#fff" d="M374.5 288.4c5.5 0 9.9-4.4 9.9-9.9s-4.4-9.9-9.9-9.9-9.9 4.4-9.9 9.9 4.4 9.9 9.9 9.9zm-237 0c5.5 0 9.9-4.4 9.9-9.9s-4.4-9.9-9.9-9.9-9.9 4.4-9.9 9.9 4.4 9.9 9.9 9.9zm118.3 47.2c-13.6 0-25.5-5.2-35-13.5-2.4-2.2-6-2.1-8.2.3-2.2 2.4-2.1 6 .3 8.2 12.3 11.2 28.4 17.7 46.3 17.7s34-6.5 46.3-17.7c2.4-2.2 2.5-5.8.3-8.2s-5.8-2.5-8.2-.3c-9.5 8.3-21.5 13.5-35 13.5z" />
          <path fill="#fff" d="M512 256c0 141.4-114.6 256-256 256S0 397.4 0 256 114.6 0 256 0s256 114.6 256 256zm-121.2 28.4c0-16.5-13.4-29.9-29.9-29.9-8 0-15.3 3.2-20.6 8.3-21.5-14.3-48.8-23.3-79.2-24.1l25.4-79.5 68.2 16.2c0 12.7 10.3 23 23 23 12.7 0 23-10.3 23-23s-10.3-23-23-23c-8.9 0-16.5 5.2-20.1 12.6l-74.7-17.7c-3.2-.8-6.5 1-7.5 4.2l-27.9 87.1c-31.1 1.3-59.5 10.4-81.6 24.9-5.3-5.2-12.6-8.4-20.6-8.4-16.5 0-29.9 13.4-29.9 29.9 0 11.9 7.1 22.2 17.2 27.1-.3 2-.4 4.1-.4 6.1 0 46.8 54.3 84.8 121.2 84.8s121.2-38 121.2-84.8c0-2.1-.2-4.1-.4-6.1 10-4.9 17.1-15.2 17.1-27.1z" />
        </svg>
        Redditでシェア
      </button>
    </div>
  );
};
