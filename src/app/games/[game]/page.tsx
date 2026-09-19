import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGame, getGames, getGuideMetas, groupGuides } from "@/lib/content";

interface Props {
  params: Promise<{ game: string }>;
}

export function generateStaticParams() {
  return getGames().map((g) => ({ game: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game: slug } = await params;
  const game = getGame(slug);
  if (!game) return {};
  return {
    title: `${game.name}攻略`,
    description: game.description,
  };
}

const TYPE_LABEL: Record<string, string> = {
  新手指南: "🌱 新手指南",
  流程攻略: "🗺️ 流程攻略",
  Boss打法: "⚔️ Boss 打法",
  "Build配装": "🛠️ Build 配装",
  收集指南: "📦 收集指南",
  版本解读: "📰 版本解读",
  机制解析: "⚙️ 机制解析",
  进阶指南: "🚀 进阶指南",
  速查表: "📋 速查表",
};

export default async function GamePage({ params }: Props) {
  const { game: slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();

  const metas = getGuideMetas(game.slug);
  const groups = groupGuides(metas);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
        <div
          className="mb-3 h-2 w-16 rounded-full"
          style={{ backgroundColor: game.accent }}
        />
        <h1 className="text-2xl font-bold">
          {game.name}
          {game.nameEn ? (
            <span className="ml-2 text-base font-normal text-stone-500">
              {game.nameEn}
            </span>
          ) : null}
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          {game.genre} · {game.platforms.join(" / ")}
          {game.releaseDate ? ` · ${game.releaseDate} 发售` : ""}
          {game.developer ? ` · ${game.developer}` : ""}
        </p>
        <p className="mt-3 max-w-2xl text-stone-600">{game.description}</p>
        {game.status ? (
          <p className="mt-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800">
            {game.status}
          </p>
        ) : null}
      </section>

      {groups.length === 0 ? (
        <p className="text-stone-500">攻略内容筹备中，敬请期待。</p>
      ) : (
        groups.map(([type, guides]) => (
          <section key={type}>
            <h2 className="mb-3 text-lg font-bold">
              {TYPE_LABEL[type] ?? type}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {guides.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/games/${game.slug}/guides/${g.slug}`}
                    className="block rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-200 transition hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium">{g.title}</span>
                      {g.status === "verified" ? (
                        <span className="mt-0.5 shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] text-emerald-700">
                          已验证
                        </span>
                      ) : (
                        <span className="mt-0.5 shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] text-amber-700">
                          待验证
                        </span>
                      )}
                    </div>
                    {g.description ? (
                      <p className="mt-1 line-clamp-2 text-sm text-stone-600">
                        {g.description}
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs text-stone-500">
                      {g.version ? `适用 v${g.version}` : ""}
                      {g.last_verified ? ` · 验证于 ${g.last_verified}` : ""}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
