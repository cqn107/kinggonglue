import type { Metadata } from "next";
import EndingsPlanner from "@/components/EndingsPlanner";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "黎明行者之血结局路线规划器",
  description:
    "勾选你的游戏进度，实时查看 7 个结局（万民英雄/弑亲者/拥立大公者/叛徒/应得的归宿/永世相伴）各还差哪几步，附一周目刷全结局路线。",
  alternates: { canonical: "/tools/dawnwalker-endings" },
};

export default function DawnwalkerEndingsToolPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "黎明行者之血结局路线规划器",
    applicationCategory: "GameApplication",
    inLanguage: "zh-CN",
    author: { "@type": "Organization", name: siteConfig.name },
    url: `${siteConfig.url}/tools/dawnwalker-endings`,
  };

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header>
        <p className="text-sm text-stone-400">互动工具 · 黎明行者之血</p>
        <h1 className="text-2xl font-bold">结局路线规划器</h1>
        <p className="mt-2 text-sm text-stone-500">
          勾选进度 → 实时查看 7 个结局各差哪几步。数据基于公开发售资料整理，最终以游戏内实际选项为准。
        </p>
      </header>
      <EndingsPlanner />
    </div>
  );
}
