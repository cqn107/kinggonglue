import type { Metadata } from "next";
import { getAllGuideMetas, getGame } from "@/lib/content";
import SearchClient, { type SearchItem } from "./SearchClient";

export const metadata: Metadata = {
  title: "搜索攻略",
  description: "按标题、类型、标签搜索全站游戏攻略。",
};

export default function SearchPage() {
  const items: SearchItem[] = getAllGuideMetas().map((m) => ({
    game: m.game,
    gameName: getGame(m.game)?.name ?? m.game,
    slug: m.slug,
    title: m.title,
    type: m.type,
    status: m.status,
    description: m.description,
    tags: m.tags,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">搜索攻略</h1>
      <SearchClient items={items} />
    </div>
  );
}
