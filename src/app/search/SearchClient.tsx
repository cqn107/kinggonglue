"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export interface SearchItem {
  game: string;
  gameName: string;
  slug: string;
  title: string;
  type: string;
  status?: string;
  description?: string;
  tags?: string[];
}

export default function SearchClient({
  items,
  initialQ = "",
}: {
  items: SearchItem[];
  initialQ?: string;
}) {
  const [q, setQ] = useState(initialQ);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    const tokens = query.split(/\s+/);
    return items.filter((it) => {
      const haystack = [
        it.title,
        it.description ?? "",
        it.type,
        it.gameName,
        ...(it.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return tokens.every((t) => haystack.includes(t));
    });
  }, [q, items]);

  return (
    <div className="space-y-5">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="搜索攻略标题、类型、标签…（如：结局 弹反 基建）"
        className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base outline-none focus:border-stone-500"
        autoFocus
      />
      <p className="text-sm text-stone-500">
        {q ? `${results.length} 条结果` : `共收录 ${items.length} 篇攻略`}
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {results.map((it) => (
          <li key={`${it.game}/${it.slug}`}>
            <Link
              href={`/games/${it.game}/guides/${it.slug}`}
              className="block rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-200 transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium">{it.title}</span>
                {it.status === "verified" ? (
                  <span className="mt-0.5 shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] text-emerald-700">
                    已验证
                  </span>
                ) : (
                  <span className="mt-0.5 shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] text-amber-700">
                    待验证
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-stone-500">
                {it.gameName} · {it.type}
              </p>
              {it.description ? (
                <p className="mt-1 line-clamp-2 text-sm text-stone-600">
                  {it.description}
                </p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
      {q && results.length === 0 ? (
        <p className="text-stone-500">
          没有匹配的攻略。试试更短的关键词，或到对应游戏页浏览分类。
        </p>
      ) : null}
    </div>
  );
}
