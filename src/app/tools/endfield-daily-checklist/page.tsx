import type { Metadata } from "next";
import ChecklistTracker, { type ChecklistSection } from "@/components/ChecklistTracker";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "终末地每日清单追踪器",
  description:
    "明日方舟：终末地日常/周必做清单追踪工具：每日 5 项自动按天重置、周常 4 项按周重置、睡前挂机检查，勾选进度本地保存。",
  alternates: { canonical: "/tools/endfield-daily-checklist" },
};

const sections: ChecklistSection[] = [
  {
    id: "daily",
    title: "每日必做（15–20 分钟）",
    reset: "daily",
    items: [
      { id: "idle", label: "领挂机收益：哨站订单结算、基地产出一次性收空" },
      { id: "quests", label: "清日常任务：给抽卡资源的任务链优先" },
      { id: "stamina", label: "消耗体力：优先卡进度的突破/技能材料副本" },
      {
        id: "factory",
        label: "产线体检（1 分钟）",
        hint: "封装机有没有在「饿肚子」？电力余量够不够？库存有没有爆仓？",
      },
      { id: "dispatch", label: "派遣队收发：干员派遣收一次、发一次" },
    ],
  },
  {
    id: "weekly",
    title: "每周必做",
    reset: "weekly",
    items: [
      { id: "weeklies", label: "周常任务全部清空", hint: "奖励通常含抽卡券" },
      { id: "limited", label: "高价值限定副本：周刷次数限制的素材本，次数用满" },
      { id: "event", label: "版本活动：先换限时商品再换常驻" },
      {
        id: "tier",
        label: "Tier List 复查：新干员/新装备是否改变了配队？",
        hint: "见本站《Tier List 方法论》篇",
      },
    ],
  },
  {
    id: "bedtime",
    title: "睡前 30 秒挂机检查",
    reset: "daily",
    items: [
      { id: "running", label: "产线在转（设备无停机闪烁）" },
      { id: "supply", label: "哨站订单物资充足（不会半夜断供）" },
      { id: "storage", label: "仓库未满（爆仓 = 挂机白挂）" },
    ],
  },
];

export default function EndfieldChecklistPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "终末地每日清单追踪器",
    applicationCategory: "GameApplication",
    inLanguage: "zh-CN",
    author: { "@type": "Organization", name: siteConfig.name },
    url: `${siteConfig.url}/tools/endfield-daily-checklist`,
  };

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header>
        <p className="text-sm text-stone-400">互动工具 · 明日方舟：终末地</p>
        <h1 className="text-2xl font-bold">每日清单追踪器</h1>
        <p className="mt-2 text-sm text-stone-500">
          每日项睡一觉自动清零、周常每周一重置，进度保存在你的浏览器本地。清单内容出自
          <a
            href="/games/endfield/guides/daily-checklist"
            className="ml-1 underline hover:text-stone-700"
          >
            日常与周常清单攻略
          </a>
          。
        </p>
      </header>
      <ChecklistTracker
        storageKey="kinggonglue:endfield-daily"
        sections={sections}
        resetLabel="全部重置"
      />
    </div>
  );
}
