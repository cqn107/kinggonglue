import type { Metadata } from "next";
import ChecklistTracker, { type ChecklistSection } from "@/components/ChecklistTracker";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "黎明行者之血30天规划追踪器",
  description:
    "黎明行者之血 30 天开荒追踪工具：按序章开图/发育期/推博雅尔/结局前置/决战日五个阶段勾选关键目标，进度本地保存，防踩倒计时陷阱。",
  alternates: { canonical: "/tools/dawnwalker-30day-planner" },
};

const sections: ChecklistSection[] = [
  {
    id: "p1",
    title: "第 1–3 天：序章 + 开图",
    reset: "manual",
    items: [
      {
        id: "aisme",
        label: "序章救活艾斯梅",
        hint: "药剂必须正确，否则锁大量结局",
      },
      { id: "blueclock", label: "蓝色时钟支线优先做完（入夜永久消失）" },
      { id: "map", label: "白天：清强盗营地、解锁神龛传送点、标记资源点" },
      { id: "durandal", label: "夜晚：断桥偷杜兰德尔（暗影步潜入，拿完就走）" },
      { id: "hourglass", label: "认识橙色沙漏图标：消耗时间前先手动存档" },
    ],
  },
  {
    id: "p2",
    title: "第 4–12 天：发育期",
    reset: "manual",
    items: [
      { id: "town", label: "白天：斯瓦特劳城采购、接城镇支线" },
      { id: "night", label: "夜晚：清精英营地，收集剑术/巫术手册" },
      {
        id: "allies",
        label: "开启两大盟友支线：拉克拉（吸血鬼线）+ 克雷克（解放者线）",
        hint: "想要对应结局必须完整做完任务链，缺一不可",
      },
      { id: "sword", label: "「僧侣与圣徒」集 3 块碎片铸圣米哈伊大剑" },
      { id: "notoriety", label: "恶名管理：动手只在野外夜晚，城镇内不动手" },
    ],
  },
  {
    id: "p3",
    title: "第 13–22 天：推三大博雅尔",
    reset: "manual",
    items: [
      { id: "ambrose", label: "击败安布鲁斯（推荐顺序第一）" },
      { id: "basil", label: "击败巴基尔" },
      { id: "xanthe", label: "击败克桑特" },
      { id: "leave", label: "击杀后立刻离开，不逗留城内（恶名管理）" },
      { id: "build", label: "期间继续补手册、导师解锁与装备强化" },
    ],
  },
  {
    id: "p4",
    title: "第 23–29 天：结局前置 + 存档备份",
    reset: "manual",
    items: [
      { id: "final", label: "三博雅尔击败后回城触发最终主线" },
      {
        id: "savegame",
        label: "关键：进入最终任务前手动单独存档",
        hint: "读档即可一周目解锁全部 7 结局，无需二周目",
      },
      {
        id: "alliesdone",
        label: "确认拉克拉/克雷克支线已完整做完",
        hint: "联手结局的硬性前置",
      },
    ],
  },
  {
    id: "p5",
    title: "第 30 天：决战日",
    reset: "manual",
    items: [
      {
        id: "castle",
        label: "进攻格赖夫贝格城堡，按对话选择走向目标结局",
        hint: "见《全结局攻略》与结局路线规划器",
      },
    ],
  },
];

export default function Dawnwalker30DayPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "黎明行者之血30天规划追踪器",
    applicationCategory: "GameApplication",
    inLanguage: "zh-CN",
    author: { "@type": "Organization", name: siteConfig.name },
    url: `${siteConfig.url}/tools/dawnwalker-30day-planner`,
  };

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header>
        <p className="text-sm text-stone-400">互动工具 · 黎明行者之血</p>
        <h1 className="text-2xl font-bold">30 天开荒规划追踪器</h1>
        <p className="mt-2 text-sm text-stone-500">
          按阶段勾选关键目标，进度保存在你的浏览器本地（开新周目时点「重置进度」）。规划详情见
          <a
            href="/games/dawnwalker/guides/30-day-roadmap"
            className="ml-1 underline hover:text-stone-700"
          >
            30 天开荒规划攻略
          </a>
          ，结局选择配合
          <a
            href="/tools/dawnwalker-endings"
            className="ml-1 underline hover:text-stone-700"
          >
            结局路线规划器
          </a>
          使用。
        </p>
      </header>
      <ChecklistTracker
        storageKey="kinggonglue:dawnwalker-30day"
        sections={sections}
        resetLabel="重置进度（开新周目）"
      />
    </div>
  );
}
