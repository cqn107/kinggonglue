import Link from "next/link";
import { siteConfig } from "@/site.config";
import { getAllGuideMetas, getGames, getGuideMetas } from "@/lib/content";

export default function HomePage() {
  const games = getGames();
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "zh-CN",
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
  const order = siteConfig.featuredGames;
  const sorted = [
    ...order.map((s) => games.find((g) => g.slug === s)).filter(Boolean),
    ...games.filter((g) => !order.includes(g.slug)),
  ] as typeof games;

  const gameName = new Map(games.map((g) => [g.slug, g.name]));
  const latest = getAllGuideMetas()
    .sort((a, b) => (b.last_verified ?? "").localeCompare(a.last_verified ?? ""))
    .slice(0, 6);

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
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
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-bold">互动工具</h2>
          <Link href="/tools" className="text-sm text-stone-500 hover:text-stone-900">
            全部工具 →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/tools/dawnwalker-endings"
            className="rounded-xl bg-stone-900 p-5 text-stone-100 transition hover:bg-stone-800"
          >
            <p className="text-xs text-stone-400">黎明行者之血</p>
            <p className="mt-1 font-bold">🧭 结局路线规划器</p>
            <p className="mt-2 text-sm text-stone-400">勾选进度，实时看 7 结局各差哪步</p>
          </Link>
          <Link
            href="/tools/dawnwalker-30day-planner"
            className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-stone-200 transition hover:shadow-md"
          >
            <p className="text-xs text-stone-400">黎明行者之血</p>
            <p className="mt-1 font-bold">📅 30 天规划追踪器</p>
            <p className="mt-2 text-sm text-stone-500">五阶段关键目标打卡，开新周目重置</p>
          </Link>
          <Link
            href="/tools/endfield-daily-checklist"
            className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-stone-200 transition hover:shadow-md"
          >
            <p className="text-xs text-stone-400">明日方舟：终末地</p>
            <p className="mt-1 font-bold">✅ 每日清单追踪器</p>
            <p className="mt-2 text-sm text-stone-500">日常按天重置、周常按周重置，15 分钟不漏项</p>
          </Link>
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-bold">最新攻略</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((m) => (
            <li key={`${m.game}/${m.slug}`}>
              <Link
                href={`/games/${m.game}/guides/${m.slug}`}
                className="block h-full rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-200 transition hover:shadow-md"
              >
                <span className="text-xs" style={{ color: "#78716c" }}>
                  {gameName.get(m.game)} · {m.type}
                </span>
                <p className="mt-1 font-medium leading-snug">{m.title}</p>
                <p className="mt-2 text-xs text-stone-500">
                  {m.last_verified ? `更新于 ${m.last_verified}` : ""}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
