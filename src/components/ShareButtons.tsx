"use client";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

interface ShareButtonsProps {
  postTitle: string;
  hash?: string; // 省略可に変更
}

export const ShareButtons = ({ postTitle, hash }: ShareButtonsProps) => {
  const [showCopiedAlert, setShowCopiedAlert] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const xPostText = `${postTitle} | #VtuberTracker`;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(
        hash
          ? `${window.location.origin}${window.location.pathname}${hash}`
          : `${window.location.origin}${window.location.pathname}`
      );
    }
  }, [hash]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
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

      {/* Xでシェア */}
      {shareUrl && (
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(xPostText)}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2 h-7 rounded-full bg-cyan-900/60 hover:bg-cyan-800 hover:opacity-90 text-cyan-100 font-normal transition text-[8px] sm:text-[12px]"
          style={{ minWidth: "unset" }}
        >
          <svg width="15" height="18" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M853.818 320H1042L709.091 692.308L1099 1100H825.273L601.364 861.538L348.818 1100H160L513.455 693.077L134 320H417.818L620.545 541.538L853.818 320ZM805.364 1020H891.818L415.909 399.231H325.364L805.364 1020Z" fill="white" />
          </svg>
          でシェア
        </a>
      )}
    </div>
  );
};
