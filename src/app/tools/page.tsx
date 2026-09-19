import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "互动工具",
  description: "King攻略互动工具集：结局路线规划器、养成计算器等。",
  alternates: { canonical: "/tools" },
};

const TOOLS = [
  {
    href: "/tools/dawnwalker-endings",
    game: "黎明行者之血",
    name: "结局路线规划器",
    description:
      "勾选游戏进度，实时查看全 7 结局各差哪几步，附一周目刷全结局路线。",
  },
];

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">互动工具</h1>
        <p className="mt-2 text-sm text-stone-500">
          不止看攻略——用工具直接算出你的下一步。
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-xs text-stone-400">{t.game}</p>
            <h2 className="mt-1 text-lg font-bold group-hover:text-blue-700">
              {t.name}
            </h2>
            <p className="mt-2 text-sm text-stone-600">{t.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
