import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllGuideMetas,
  getGame,
  getGames,
  getGuide,
  getRelatedGuides,
} from "@/lib/content";
import { siteConfig } from "@/site.config";

interface Props {
  params: Promise<{ game: string; guide: string }>;
}

export function generateStaticParams() {
  return getGames().flatMap((g) =>
    getAllGuideMetas()
      .filter((m) => m.game === g.slug)
      .map((m) => ({ game: g.slug, guide: m.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game, guide } = await params;
  const g = await getGuide(game, guide);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    openGraph: {
      title: g.title,
      description: g.description,
      type: "article",
    },
  };
}

const SPOILER_LABEL = {
  low: "剧透风险：低",
  medium: "剧透风险：中（含部分流程细节）",
  high: "剧透风险：高（含关键剧情）",
} as const;

export default async function GuidePage({ params }: Props) {
  const { game: gameSlug, guide: guideSlug } = await params;
  const game = getGame(gameSlug);
  const guide = await getGuide(gameSlug, guideSlug);
  if (!game || !guide) notFound();

  const related = getRelatedGuides(gameSlug, guideSlug);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    inLanguage: "zh-CN",
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    dateModified: guide.last_verified,
    about: { "@type": "VideoGame", name: game.name },
    keywords: guide.tags?.join(", "),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: game.name,
        item: `${siteConfig.url}/games/${game.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title,
        item: `${siteConfig.url}/games/${game.slug}/guides/${guide.slug}`,
      },
    ],
  };

  return (
    <article className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleLd, breadcrumbLd]),
        }}
      />

      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-stone-900">
          首页
        </Link>
        <span className="mx-1.5">/</span>
        <Link href={`/games/${game.slug}`} className="hover:text-stone-900">
          {game.name}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-stone-700">{guide.title}</span>
      </nav>

      <header className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
        <h1 className="text-2xl font-bold leading-snug">{guide.title}</h1>
        {guide.description ? (
          <p className="mt-2 text-stone-600">{guide.description}</p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          {guide.version ? (
            <span className="rounded-full bg-stone-100 px-3 py-1 text-stone-700">
              适用版本 v{guide.version}
            </span>
          ) : null}
          {guide.last_verified ? (
            <span className="rounded-full bg-stone-100 px-3 py-1 text-stone-700">
              最后验证：{guide.last_verified}
            </span>
          ) : null}
          {guide.platforms?.length ? (
            <span className="rounded-full bg-stone-100 px-3 py-1 text-stone-700">
              {guide.platforms.join(" / ")}
            </span>
          ) : null}
          {guide.spoiler && guide.spoiler !== "low" ? (
            <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-700">
              {SPOILER_LABEL[guide.spoiler]}
            </span>
          ) : null}
          {guide.status === "unverified" ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
              ⚠️ 待验证：部分内容基于公开资料整理，数值请以实际游戏为准
            </span>
          ) : (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
              已人工实测验证
            </span>
          )}
        </div>
      </header>

      <div
        className="prose prose-stone max-w-none prose-headings:font-bold prose-a:text-blue-700"
        dangerouslySetInnerHTML={{ __html: guide.contentHtml }}
      />

      {related.length > 0 ? (
        <aside className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 className="text-lg font-bold">相关攻略</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/games/${game.slug}/guides/${r.slug}`}
                  className="block rounded-xl p-3 ring-1 ring-stone-200 transition hover:bg-stone-50"
                >
                  <span className="text-xs text-stone-500">{r.type}</span>
                  <p className="font-medium leading-snug">{r.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </article>
  );
}
