/**
 * 扫描全部攻略内容中的 {{待验证:xxx}} 占位符，生成人工实测清单。
 * 用法：npm run audit  （报告输出到 仓库外 的 待验证清单.md）
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "content",
  "games"
);
const outPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "待验证清单.md"
);

const games = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
  .map((d) => d.name);

let total = 0;
const sections = [];

for (const game of games) {
  const guidesDir = path.join(root, game, "guides");
  if (!fs.existsSync(guidesDir)) continue;
  const rows = [];
  for (const file of fs.readdirSync(guidesDir)) {
    if (!file.endsWith(".md")) continue;
    const text = fs.readFileSync(path.join(guidesDir, file), "utf8");
    const titleMatch = text.match(/^title:\s*(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : file;
    const markers = [...text.matchAll(/\{\{待验证[:：]?([^}]*)\}\}/g)].map(
      (m) => m[1].trim() || "（未注明内容）"
    );
    if (markers.length === 0) continue;
    const slug = file.replace(/\.md$/, "");
    const rel = `src/content/games/${game}/guides/${file}`;
    rows.push(
      `### ${title}\n\n` +
        `- 文件：\`guidehub/${rel}\`\n` +
        `- 页面：/games/${game}/guides/${slug}\n` +
        `- 待验证项 ${markers.length} 处：\n` +
        markers.map((m) => `  - [ ] ${m}`).join("\n") +
        `\n- 验证完成后：删除占位符，frontmatter 改 \`status: verified\`\n`
    );
    total += markers.length;
  }
  if (rows.length > 0) {
    sections.push(`## ${game}\n\n${rows.join("\n")}`);
  }
}

const report =
  `# 待验证清单（自动生成）\n\n` +
  `> 由 \`npm run audit\` 生成于 ${new Date().toLocaleString("zh-CN")}。\n` +
  `> 共 **${total}** 处待验证项。实测后删除占位符并把 frontmatter 的 \`status\` 改为 \`verified\`，重新运行本脚本清单会自动更新。\n\n` +
  (total === 0
    ? `🎉 当前没有待验证项，全部内容均已实测标注。`
    : sections.join("\n\n---\n\n"));

fs.writeFileSync(outPath, report, "utf8");
console.log(`扫描完成：${total} 处待验证项 → ${outPath}`);
