"use client";

import { useMemo, useState } from "react";

interface Req {
  id: string;
  label: string;
  hint?: string;
}

const REQS: Req[] = [
  {
    id: "aisme",
    label: "序章救活母亲艾斯梅",
    hint: "结局判定总开关，没救活会锁大量结局",
  },
  {
    id: "boyars",
    label: "30 天内击败三大博雅尔（安布鲁斯 / 巴基尔 / 克桑特）",
    hint: "超时直接进入坏结局「时限耗尽」",
  },
  {
    id: "notoriety",
    label: "恶名拉满 → 次日法令 → 收到布伦西斯谈判，最终任务「与魔鬼的交易」已开启",
  },
  {
    id: "save",
    label: "已在最终任务处手动存档",
    hint: "之后打完一个结局读档即可刷下一个",
  },
  {
    id: "lacla",
    label: "拉克拉支线已做到「午夜清算」",
    hint: "如此挚友 → 山之歌 → 蜂群搜寻 → 腐朽根源 →（恐怖之夜·可选）→ 午夜清算，全部在夜晚",
  },
  {
    id: "krecek",
    label: "克雷克支线已做到「黎明崛起」",
    hint: "煽动者 → 林中暗影 → 忠诚何在 → 暗夜猎手 → 亡者异动 → 幕后操盘手 →（遥远暗影 / 细查真相·可选）→ 黎明崛起",
  },
  {
    id: "krecek3",
    label: "已完成《煽动者》《林中暗影》《忠诚何在》三任务",
    hint: "叛徒结局需要解放者藏身处的准入资格",
  },
  {
    id: "shadowstep",
    label: "已解锁暗影步（夜晚可攀爬）",
  },
  {
    id: "sweet-home",
    label: "已进入克桑特宫廷活动《甜蜜之家》",
    hint: "淤泥塔顶层，藏在赞西区域",
  },
  {
    id: "florin",
    label: "速通线：与弗洛林神父合作（《以父之名》完成）或已取得城堡侧门钥匙",
    hint: "仅「序章后直闯城堡」的速通玩法需要",
  },
];

const REQ_LABEL: Record<string, string> = Object.fromEntries(
  REQS.map((r) => [r.id, r.label])
);

interface Ending {
  id: string;
  name: string;
  kind: "主线好结局" | "主线背叛结局" | "早期结局" | "坏结局";
  trophy: string;
  route: string;
  /** 完成本结局除勾选项外还需满足的需求 id；needAll = 全部满足即可达 */
  needs: string[];
  finalStep: string;
}

const ENDINGS: Ending[] = [
  {
    id: "hero",
    name: "万民英雄",
    kind: "主线好结局",
    trophy: "万民英雄",
    route: "最终任务选择「够了，该结束这一切了」→ 单人挑战布伦西斯",
    needs: ["aisme", "boyars", "notoriety"],
    finalStep: "最终任务对话选择：够了，该结束这一切了",
  },
  {
    id: "kinslayer",
    name: "弑亲者",
    kind: "主线好结局",
    trophy: "弑亲者",
    route: "拉克拉线「午夜清算」中选择合作",
    needs: ["aisme", "boyars", "notoriety", "lacla"],
    finalStep: "在午夜清算中与拉克拉对话选择合作路线",
  },
  {
    id: "grandduke",
    name: "拥立大公者",
    kind: "主线好结局",
    trophy: "拥立大公者",
    route: "克雷克线「黎明崛起」中选择合作",
    needs: ["aisme", "boyars", "notoriety", "krecek"],
    finalStep: "在黎明崛起中选择合作（拒绝会转入「杀出个黄昏」）",
  },
  {
    id: "traitor",
    name: "叛徒",
    kind: "主线背叛结局",
    trophy: "叛徒 / 千钧一发",
    route: "最终任务接受布伦西斯的条件（需解放者藏身处准入）",
    needs: ["aisme", "boyars", "notoriety", "krecek3"],
    finalStep:
      '对话「我只想换回我的家人」→ 确认「我愿意」（不要选拔剑进攻）；夜晚与藏身点大门交互',
  },
  {
    id: "deserved",
    name: "应得的归宿",
    kind: "早期结局",
    trophy: "应得的归宿",
    route: "序章后夜晚逃离山谷（荆棘沼泽断桥大门）",
    needs: ["aisme", "shadowstep"],
    finalStep: "位面跃迁 + 暗影步攀上峡谷岩壁走到大门，选择「永远离开山谷」",
  },
  {
    id: "dream",
    name: "永世相伴",
    kind: "早期结局",
    trophy: "永世相伴",
    route: "《甜蜜之家》梦境连续完成 4 轮循环",
    needs: ["aisme", "sweet-home"],
    finalStep: "无视水井，第 5 轮开始时与家人对话 → 永远留在梦中",
  },
  {
    id: "timeout",
    name: "时限耗尽",
    kind: "坏结局",
    trophy: "无奖杯",
    route: "累计超过 30 游戏日自动触发（避坑项，列出仅供识别）",
    needs: [],
    finalStep: "⚠️ 这是坏结局：注意控制天数，不要反复「等待」消耗时间",
  },
];

const KIND_STYLE: Record<Ending["kind"], string> = {
  主线好结局: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  主线背叛结局: "bg-amber-50 text-amber-800 ring-amber-200",
  早期结局: "bg-sky-50 text-sky-800 ring-sky-200",
  坏结局: "bg-red-50 text-red-800 ring-red-200",
};

export default function EndingsPlanner() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setDone((d) => ({ ...d, [id]: !d[id] }));

  const results = useMemo(
    () =>
      ENDINGS.map((e) => {
        const missing = e.needs.filter((n) => !done[n]);
        return { ...e, missing, ready: e.needs.length > 0 && missing.length === 0 };
      }),
    [done]
  );

  const readyCount = results.filter((r) => r.ready).length;
  const doneCount = REQS.filter((r) => done[r.id]).length;

  return (
    <div className="space-y-8">
      {/* 进度勾选 */}
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <h2 className="text-lg font-bold">① 勾选你的游戏进度</h2>
        <p className="mt-1 text-sm text-stone-500">
          对照下方进度逐项勾选，右侧结局卡会实时更新「可达 / 还差什么」。
        </p>
        <div className="mt-4 space-y-2">
          {REQS.map((r) => (
            <label
              key={r.id}
              className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-stone-50"
            >
              <input
                type="checkbox"
                checked={!!done[r.id]}
                onChange={() => toggle(r.id)}
                className="mt-1 h-4 w-4 accent-stone-800"
              />
              <span>
                <span
                  className={
                    done[r.id] ? "text-sm text-stone-400 line-through" : "text-sm"
                  }
                >
                  {r.label}
                </span>
                {r.hint && (
                  <span className="block text-xs text-stone-400">{r.hint}</span>
                )}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3 text-sm text-stone-500">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${(doneCount / REQS.length) * 100}%` }}
            />
          </div>
          <span>
            {doneCount}/{REQS.length} 项 · 当前可达结局 {readyCount}/6
          </span>
        </div>
      </section>

      {/* 结局卡 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">② 结局达成状态</h2>
        {results.map((e) => (
          <div
            key={e.id}
            className={`rounded-xl p-4 ring-1 ${
              e.ready
                ? "bg-emerald-50/60 ring-emerald-300"
                : "bg-white ring-stone-200"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold">{e.name}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ring-1 ${KIND_STYLE[e.kind]}`}
              >
                {e.kind}
              </span>
              <span className="text-xs text-stone-400">🏆 {e.trophy}</span>
              <span className="ml-auto text-xs font-medium">
                {e.ready ? (
                  <span className="text-emerald-700">✅ 可达成 — 去打结局吧</span>
                ) : e.missing.length > 0 ? (
                  <span className="text-stone-500">还差 {e.missing.length} 步</span>
                ) : (
                  <span className="text-red-500">避坑项</span>
                )}
              </span>
            </div>
            <p className="mt-2 text-sm text-stone-600">
              <span className="text-stone-400">路线：</span>
              {e.route}
            </p>
            {e.missing.length > 0 && (
              <ul className="mt-2 space-y-1">
                {e.missing.map((m) => (
                  <li key={m} className="text-sm text-amber-700">
                    ⬜ {REQ_LABEL[m]}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-xs text-stone-400">关键一步：{e.finalStep}</p>
          </div>
        ))}
      </section>

      {/* 一周目建议 */}
      <section className="rounded-2xl bg-stone-900 p-6 text-stone-100">
        <h2 className="text-lg font-bold">③ 一周目刷全结局路线（静态建议）</h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-stone-300">
          <li>序章救活艾斯梅（结局总开关）</li>
          <li>前 20 天：发育 + 做完拉克拉、克雷克两条支线（互相独立）</li>
          <li>第 13–22 天：击败三博雅尔</li>
          <li>最终任务处<b className="text-white">手动存档</b></li>
          <li>依次触发 4 个主线结局：每次读档换对话选项即可</li>
          <li>早期结局 5、6 随时可补做</li>
        </ol>
        <p className="mt-3 text-xs text-stone-500">
          提示：对话选项原文以游戏内实际显示为准（不同来源译名有差异），详见
          <a
            href="/games/dawnwalker/guides/endings-guide"
            className="ml-1 underline hover:text-stone-300"
          >
            全结局图文攻略
          </a>
          。
        </p>
      </section>
    </div>
  );
}
