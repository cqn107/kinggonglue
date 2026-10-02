import type { Metadata } from "next";
import Link from "next/link";
import { getGames, getGuideMetas } from "@/lib/content";

export const metadata: Metadata = {
  title: "2026 年 9-10 月三款新游横向对比",
  description:
    "黎明行者之血、影之刃零、明日方舟：终末地横向对比：上手门槛、时间投入、平台、玩法取向与攻略储备，帮你决定先玩哪款。",
  alternates: { canonical: "/compare" },
  openGraph: {
    type: "article",
    title: "2026 年 9-10 月三款新游横向对比 | King攻略",
    description:
      "三款新游横向对比：上手门槛、时间投入、平台、玩法取向与攻略储备，帮你决定先玩哪款。",
  },
};

/**
 * 对比维度的定性评估。
 * 说明：这里的评级基于各游戏公开信息与玩法取向整理，是"决策辅助"而非精确排名；
 * 需要精确数值的场合一律回链到对应攻略页。
 */
const DIMENSIONS: {
  game: string;
  genre: string;
  hook: string; // 一句话卖点
  pace: string; // 节奏
  startingDifficulty: string; // 上手门槛
  timePerSession: string; // 单次时长友好度
  combat: string;
  storyWeight: string;
  grindLevel: string;
  bestFor: string;
}[] = [
  {
    game: "dawnwalker",
    genre: "开放世界黑暗奇幻 ARPG",
    hook: "《巫师3》班底新作，30 昼夜倒计时逼你做取舍",
    pace: "强时间压力：主线有昼夜倒计时，支线要主动取舍",
    startingDifficulty: "中等偏上：白天剑术 / 夜晚吸血鬼双形态，两套资源要分开管",
    timePerSession: "较友好：白天活动可按段推进，随时停下",
    combat: "动作 + 巫术，夜晚形态另有一套技能树",
    storyWeight: "极重：选择影响结局，多结局分歧是核心体验",
    grindLevel: "低：没有传统刷装备循环，更吃剧情推进",
    bestFor: "喜欢剧情抉择、愿意二周目看不同结局的玩家",
  },
  {
    game: "phantom-blade-zero",
    genre: "暗黑武侠动作 ARPG",
    hook: "虚幻 5 武侠动作，66 天倒计时 + 硬核 Boss 战",
    pace: "线性推进：关卡制，节奏由 Boss 难度决定",
    startingDifficulty: "高：动作硬核，弹反与处决窗口要求精度",
    timePerSession: "偏硬核：Boss 卡关时单次耗时会长",
    combat: "纯动作主导，武器流派 + 心法是构筑核心",
    storyWeight: "中等：主线明确，重心在战斗表现",
    grindLevel: "中：武器强化与心法收集需要重复投入",
    bestFor: "冲着动作手感来、享受反复磨练 Boss 的玩家",
  },
  {
    game: "endfield",
    genre: "3D 即时策略 RPG",
    hook: "明日方舟衍生，战斗 + 自动化基建双线运营",
    pace: "长线运营：版本驱动，日常有固定清单要清",
    startingDifficulty: "偏低：新手引导完整，但基建系统上手需时间",
    timePerSession: "日常友好：每日清单约 15 分钟可完成",
    combat: "策略编队 + 即时战斗，吃角色养成与配队",
    storyWeight: "中等：系列宇宙延伸，剧情随版本更新",
    grindLevel: "高：养成是长期投入，资源规划影响很大",
    bestFor: "想找一款能长期玩、有运营更新节奏的玩家",
  },
];

function pick<T extends { slug: string }>(arr: T[], slug: string): T | undefined {
  return arr.find((a) => a.slug === slug);
}

export default function ComparePage() {
  const games = getGames();
  const rows = DIMENSIONS.map((d) => ({
    ...d,
    meta: pick(games, d.game),
    guideCount: getGuideMetas(d.game).length,
  })).filter((r) => r.meta);

  const ROW_LABELS: [keyof (typeof rows)[number], string, string][] = [
    ["genre", "类型", "玩法大类，决定你适不适合"],
    ["hook", "一句话卖点", "它最想让你记住的是什么"],
    ["pace", "节奏", "游戏怎么推着你往前走"],
    ["startingDifficulty", "上手门槛", "前期会不会被劝退"],
    ["timePerSession", "单次时长友好度", "碎片时间能不能玩"],
    ["combat", "战斗取向", "动作 / 策略 / 混合"],
    ["storyWeight", "剧情权重", "故事是不是核心驱动"],
    ["grindLevel", "肝度", "长期重复投入的量级"],
  ];

  const FALLBACK = "—";

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">三款新游横向对比</h1>
        <p className="mt-2 text-sm text-stone-500">
          黎明行者之血 · 影之刃零 · 明日方舟：终末地 —— 帮你决定先开哪一款。
        </p>
      </header>

      <div className="rounded-2xl border-l-4 border-blue-600 bg-blue-50/60 p-5">
        <p className="text-sm leading-relaxed text-stone-700">
          <b>怎么用这张表</b>：先看「上手门槛」和「单次时长友好度」筛掉不适合你的，
          再看「肝度」和「剧情权重」确认是不是你想要的那种游戏。
          表内评级基于公开玩法信息整理，属于<b>决策辅助</b>；
          需要具体数值与流程时，请点进对应攻略。
        </p>
      </div>

      {/* 桌面端：对比表格 */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="w-40 border-b border-stone-200 pb-3 pr-4 align-bottom text-sm font-semibold text-stone-500">
                对比维度
              </th>
              {rows.map((r) => (
                <th
                  key={r.game}
                  className="border-b border-stone-200 px-4 pb-3 align-bottom"
                >
                  <Link
                    href={`/games/${r.game}`}
                    className="text-base font-bold hover:underline"
                    style={{ color: r.meta!.accent }}
                  >
                    {r.meta!.name}
                  </Link>
                  <p className="mt-0.5 text-xs font-normal text-stone-400">
                    {r.meta!.releaseDate} · {r.guideCount} 篇攻略
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROW_LABELS.map(([key, label, hint]) => (
              <tr key={key} className="align-top">
                <th className="border-b border-stone-100 py-4 pr-4 text-sm font-semibold text-stone-700">
                  {label}
                  <span className="mt-0.5 block text-xs font-normal text-stone-400">
                    {hint}
                  </span>
                </th>
                {rows.map((r) => (
                  <td
                    key={r.game}
                    className="border-b border-stone-100 px-4 py-4 text-sm leading-relaxed text-stone-700"
                  >
                    {(r[key] as string) || FALLBACK}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="align-top">
              <th className="border-b border-stone-100 py-4 pr-4 text-sm font-semibold text-stone-700">
                最适合
                <span className="mt-0.5 block text-xs font-normal text-stone-400">
                  一句话对号入座
                </span>
              </th>
              {rows.map((r) => (
                <td
                  key={r.game}
                  className="border-b border-stone-100 px-4 py-4 text-sm font-medium leading-relaxed"
                  style={{ color: r.meta!.accent }}
                >
                  {r.bestFor}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* 移动端：卡片堆叠 */}
      <div className="space-y-5 md:hidden">
        {rows.map((r) => (
          <section
            key={r.game}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200"
          >
            <h2 className="text-lg font-bold" style={{ color: r.meta!.accent }}>
              {r.meta!.name}
            </h2>
            <p className="mt-0.5 text-xs text-stone-400">
              {r.meta!.releaseDate} · {r.guideCount} 篇攻略
            </p>
            <dl className="mt-4 space-y-2">
              {ROW_LABELS.map(([key, label]) => (
                <div key={key} className="text-sm">
                  <dt className="font-semibold text-stone-700">{label}</dt>
                  <dd className="text-stone-600">{(r[key] as string) || FALLBACK}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 rounded-lg bg-stone-50 p-3 text-sm font-medium">
              {r.bestFor}
            </p>
            <Link
              href={`/games/${r.game}`}
              className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline"
            >
              看这款的全部攻略 →
            </Link>
          </section>
        ))}
      </div>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <h2 className="text-lg font-bold">还是选不出来？</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-stone-700">
          <li>
            <b>只有碎片时间、想每天上线十来分钟</b> → 选终末地，日常清单约 15 分钟能收工。
          </li>
          <li>
            <b>想要一次通关的剧情体验、不接受长期打卡</b> → 选黎明行者之血，30 天倒计时内通关即可。
          </li>
          <li>
            <b>买游戏就是为了打 Boss、享受动作手感</b> → 选影之刃零，但做好被卡关的心理准备。
          </li>
        </ul>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <h2 className="text-lg font-bold">各游戏攻略入口</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {rows.map((r) => (
            <Link
              key={r.game}
              href={`/games/${r.game}`}
              className="rounded-xl border border-stone-200 p-4 transition hover:border-stone-300 hover:shadow-sm"
            >
              <p className="font-semibold" style={{ color: r.meta!.accent }}>
                {r.meta!.name}
              </p>
              <p className="mt-1 text-xs text-stone-500">
                {r.meta!.genre} · {r.guideCount} 篇
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
