import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Script from "next/script";

export const metadata: Metadata = {
  title: "VtubeTracker",
  description: "Vtuberの登録者数・再生数推移を箱別・月別に確認できる無料Webアプリ。にじさんじ・ホロライブ・ぶいすぽ・ネオポルテなど対応。",
  icons: {
    icon: "/tabIcon.png", // パスは public ディレクトリ基準
  },
  openGraph: {
    title: "VtubeTracker - にじさんじ・ホロライブ登録者数推移",
    description: "Vtuberの登録者数・再生数推移を箱別・月別に確認できる無料Webアプリ。",
    url: "https://vtubertracker.info",
    type: "website",
    images: [
      {
        url: "/ogp.png",
        width: 1200,
        height: 630,
        alt: "VtubeTrackerのOGP画像",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VtubeTracker - Vtuber登録者数推移まとめ",
    description: "Vtuberの登録者数・再生数推移を箱別・月別に確認できる無料Webアプリ。",
    images: ["https://vtubertracker.info/ogp.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics タグ */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-71N7K19X8G"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-71N7K19X8G');
          `}
        </Script>
      </head>
      <body
        className='bg-gray-900 lg:mx-50'
      >
        <div className="bg-black text-white">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
