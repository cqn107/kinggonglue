import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { getGames, getAllGuideMetas } from "@/lib/content";

export const metadata: Metadata = {
  title: "关于本站",
  description: `${siteConfig.name}的定位、内容原则（版本标注与验证制度）与联系方式。`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const games = getGames();
  const count = getAllGuideMetas().length;

  return (
    <div className="prose prose-stone max-w-none">
      <h1>关于{siteConfig.name}</h1>
      <p>
        {siteConfig.name}（kinggonglue.cn）是一个深度图文游戏攻略站：全流程、Boss
        打法、Build 配装、收集指南与版本解读，配套互动工具（结局路线规划器、清单追踪器等）。
      </p>

      <h2>正在覆盖的游戏</h2>
      <ul>
        {games.map((g) => (
          <li key={g.slug}>
            <a href={`/games/${g.slug}`}>{g.name}</a>
          </li>
        ))}
      </ul>
      <p>当前共 {count} 篇攻略，持续更新中。</p>

      <h2>内容原则</h2>
      <ul>
        <li>
          <b>标注适用版本</b>：每篇攻略注明适用的游戏版本，版本更新后过期内容会标记并修订。
        </li>
        <li>
          <b>验证制度</b>：数值与结论未经实测前会明确标注「待验证」，绝不把猜测包装成结论。
        </li>
        <li>
          <b>剧透分级</b>：每篇标注剧透风险等级，按需阅读。
        </li>
        <li>
          <b>拒绝水文</b>：不写凑字数的「攻略」，每篇围绕一个明确的问题。
        </li>
      </ul>

      <h2>联系方式与版权</h2>
      <p>
        内容纠错、合作或转载请求可通过邮箱联系：<code>contact@kinggonglue.cn</code>
        （邮箱随域名注册后启用）。
      </p>
      <p>
        本站攻略内容为原创作品，欢迎少量引用并注明出处与链接；未经许可不得整篇转载。游戏名称与相关素材版权归各自厂商所有，本站为非官方粉丝攻略站。
      </p>
    </div>
  );
}
