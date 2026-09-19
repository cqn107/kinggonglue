import type { Metadata } from "next";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "隐私政策",
  description: `${siteConfig.name}的隐私政策：我们收集什么、不收集什么，以及本地存储的使用说明。`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="prose prose-stone max-w-none">
      <h1>隐私政策</h1>
      <p>最后更新：2026-09-19</p>

      <h2>我们收集什么</h2>
      <p>
        {siteConfig.name}
        致力于最小化数据收集：本站不要求注册账号，不主动收集你的姓名、邮箱等个人信息。
      </p>

      <h2>本地存储（localStorage）</h2>
      <p>
        互动工具（清单追踪器、结局路线规划器等）会把你的勾选进度保存在<b>
          你自己浏览器的本地存储
        </b>
        中，用于下次访问时恢复进度。这些数据<b>不会上传到我们的服务器</b>
        ，也不会与任何第三方共享。清除浏览器数据即可彻底删除。
      </p>

      <h2>统计与第三方服务</h2>
      <p>
        本站托管于 Vercel，其基础设施日志可能包含标准 HTTP
        请求信息（如 IP、User-Agent），用于安全与可用性维护，详见{" "}
        <a href="https://vercel.com/legal/privacy-policy" rel="noopener noreferrer">
          Vercel 隐私政策
        </a>
        。若未来启用访问统计或广告服务（如 Google AdSense），我们将在本页更新说明，并在法律要求时提供退出选项。
      </p>

      <h2>Cookie</h2>
      <p>本站当前不使用追踪型 Cookie。</p>

      <h2>未成年人</h2>
      <p>本站内容面向一般玩家群体，不针对未成年人进行个性化推荐或广告定向。</p>

      <h2>联系</h2>
      <p>
        对本政策有疑问请联系：<code>contact@kinggonglue.cn</code>。
      </p>
    </div>
  );
}
