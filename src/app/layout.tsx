import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { getGames } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} · ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const games = getGames();
  return (
    <html lang="zh-CN">
      <body className="flex min-h-screen flex-col">
        <header className="border-b border-stone-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
            <Link href="/" className="text-lg font-bold tracking-tight">
              {siteConfig.name}
            </Link>
            <nav className="flex flex-wrap items-center gap-4 text-sm text-stone-600">
              <Link href="/" className="hover:text-stone-900">
                首页
              </Link>
              {games.map((g) => (
                <Link
                  key={g.slug}
                  href={`/games/${g.slug}`}
                  className="hover:text-stone-900"
                >
                  {g.name}
                </Link>
              ))}
              <Link
                href="/search"
                className="ml-auto rounded-full bg-stone-100 px-3 py-1 hover:bg-stone-200"
              >
                🔍 搜索
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
          {children}
        </main>

        <footer className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-stone-500">
            {siteConfig.name} · {siteConfig.tagline} · 所有攻略标注适用版本与验证时间
            <span className="mx-2">·</span>
            <a href="/rss.xml" className="hover:text-stone-900">
              RSS 订阅
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
