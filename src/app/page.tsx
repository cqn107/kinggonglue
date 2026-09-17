import Link from "next/link";
import { siteConfig } from "@/site.config";
import { getGames, getGuideMetas } from "@/lib/content";

export default function HomePage() {
  const games = getGames();
  const order = siteConfig.featuredGames;
  const sorted = [
    ...order.map((s) => games.find((g) => g.slug === s)).filter(Boolean),
    ...games.filter((g) => !order.includes(g.slug)),
  ] as typeof games;

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
        <h1 className="text-3xl font-bold tracking-tight">{siteConfig.name}</h1>
        <p className="mt-2 max-w-2xl text-stone-600">{siteConfig.description}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-stone-500">
          <span className="rounded-full bg-stone-100 px-3 py-1">标注适用版本</span>
          <span className="rounded-full bg-stone-100 px-3 py-1">
            标注最后验证时间
          </span>
          <span className="rounded-full bg-stone-100 px-3 py-1">
            全流程 · Boss 打法 · Build 配装
          </span>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">收录游戏</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((g) => {
            const count = getGuideMetas(g.slug).length;
            return (
              <Link
                key={g.slug}
                href={`/games/${g.slug}`}
                className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200 transition hover:shadow-md"
              >
                <div
                  className="mb-3 h-1.5 w-12 rounded-full"
                  style={{ backgroundColor: g.accent }}
                />
                <h3 className="text-lg font-bold group-hover:underline">
                  {g.name}
                </h3>
                {g.nameEn ? (
                  <p className="text-sm text-stone-500">{g.nameEn}</p>
                ) : null}
                <p className="mt-2 line-clamp-3 text-sm text-stone-600">
                  {g.description}
                </p>
                <p className="mt-3 text-xs text-stone-500">
                  {g.genre} · 攻略 {count} 篇
                  {g.releaseDate ? ` · ${g.releaseDate} 发售` : ""}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
