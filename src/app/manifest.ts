import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "King攻略 · 深度游戏攻略",
    short_name: "King攻略",
    description:
      "深度图文游戏攻略站：全流程、Boss 打法、Build 配装、结局规划与互动工具，标注适用版本与验证时间。",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#18181b",
    lang: "zh-CN",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
