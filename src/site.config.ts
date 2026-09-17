/**
 * 站点全局配置：改这里一处生效全站。
 * 站点名与域名为占位，确定后替换即可。
 */
export const siteConfig = {
  name: "攻略工坊",
  tagline: "深度游戏攻略 · 互动工具 · 玩家社区",
  description:
    "深度图文游戏攻略站：全流程、Boss 打法、Build 配装、收集指南与版本解读，标注适用版本与验证时间，拒绝过时攻略。",
  /** 占位域名，部署后替换 */
  url: "https://example.com",
  /** 首发游戏 slug 列表，顺序即首页展示顺序 */
  featuredGames: ["dawnwalker", "endfield", "phantom-blade-zero"],
};

export type SiteConfig = typeof siteConfig;
