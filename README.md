# King攻略 · 游戏攻略站

深度图文游戏攻略站（Next.js 15 + TypeScript + Tailwind CSS，全静态生成）。

- **站点名**：King攻略
- **主域名**：kinggonglue.cn（kinggonglue.com 作跳转/防御域名）
- **内容规模**：3 款首发游戏 · 42 篇攻略 · 50+ 静态页
- **已上线功能**：站内搜索（构建时索引）、相关攻略内链（标签打分自动推荐）、RSS（`/rss.xml`）、Article + BreadcrumbList 结构化数据、sitemap / robots

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
  lib/content.ts        # 内容管线：读取 game.json + guides/*.md，类型分组与相关推荐
  app/                  # 页面：首页 / 游戏页 / 攻略页 / 搜索 / sitemap / robots / rss
  content/games/
    <游戏slug>/
      game.json         # 游戏元数据
      guides/*.md       # 攻略文章（frontmatter 规范见模板）
    _templates/         # 攻略写作模板（不会生成页面）
```

## 新增一篇攻略

1. 复制 `src/content/_templates/guide-template.md` 到对应游戏的 `guides/` 目录
2. **文件名用 ASCII slug**（如 `beginner-guide-30-days.md`，Windows 下非 ASCII 路由会 404），中文标题写在 frontmatter `title`
3. 填写 frontmatter：`type` 使用既有类型（新手指南/流程攻略/Boss打法/Build配装/收集指南/版本解读/机制解析/进阶指南/速查表），未收录的新类型会在游戏页末尾自动成组，不会丢
4. 数值不确定的先标 `{{待验证:xxx}}`；实测验证后替换占位符，`status` 改为 `verified`
5. 重新构建即可——页面、游戏页列表、相关推荐、sitemap、RSS 自动更新

## 部署

连 Git 仓库到 Vercel（push 即发布），域名绑定与 DNS 步骤见仓库外《King攻略-注册与上线手册.md》。
