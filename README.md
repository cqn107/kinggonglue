# GuideHub · 游戏攻略站

深度图文游戏攻略站 MVP（Next.js 15 + TypeScript + Tailwind CSS，全静态生成）。

## 本地开发

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 生产构建（校验所有内容页）
npm run start    # 运行生产构建
```

## 目录结构

```
src/
  site.config.ts        # 站点名/域名/首发游戏配置（改这里一处生效）
  lib/content.ts        # 内容管线：读取 game.json + guides/*.md
  app/                  # 页面：首页 / 游戏页 / 攻略页 / sitemap / robots
  content/games/
    <游戏slug>/
      game.json         # 游戏元数据
      guides/*.md       # 攻略文章（frontmatter 规范见模板）
    _templates/         # 攻略写作模板（不会生成页面）
```

## 新增一篇攻略

1. 复制 `src/content/_templates/guide-template.md` 到对应游戏的 `guides/` 目录
2. **文件名用 ASCII slug**（如 `beginner-guide-30-days.md`，Windows 下非 ASCII 路由会 404），中文标题写在 frontmatter `title`
3. 填写 frontmatter（标题用长尾词格式，数值先标 `{{待验证:xxx}}`）
4. 实测验证后替换占位符，把 `status` 改为 `verified`
5. 重新构建即可——页面、游戏页列表、sitemap 自动更新

## 部署

连 Git 仓库到 Vercel 或 Cloudflare Pages，push 即发布。部署后把 `src/site.config.ts` 的 `url` 换成真实域名。
