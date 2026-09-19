import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const CONTENT_ROOT = path.join(process.cwd(), "src", "content", "games");

/* ---------- 类型 ---------- */

export interface Game {
  slug: string;
  name: string;
  nameEn?: string;
  developer?: string;
  publisher?: string;
  releaseDate?: string;
  platforms: string[];
  genre?: string;
  accent: string; // 主题色，如 #7c2d3e
  description: string;
  status?: string;
}

export type GuideType =
  | "新手指南"
  | "流程攻略"
  | "Boss打法"
  | "Build配装"
  | "收集指南"
  | "版本解读"
  | "机制解析"
  | "进阶指南"
  | "速查表";

export interface GuideMeta {
  slug: string;
  game: string;
  title: string;
  type: GuideType;
  version?: string;
  last_verified?: string;
  status?: "verified" | "unverified";
  platforms?: string[];
  spoiler?: "low" | "medium" | "high";
  description?: string;
  tags?: string[];
}

export interface Guide extends GuideMeta {
  contentHtml: string;
}

/* ---------- 游戏注册表 ---------- */

export function getGames(): Game[] {
  if (!fs.existsSync(CONTENT_ROOT)) return [];
  return fs
    .readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const file = path.join(CONTENT_ROOT, d.name, "game.json");
      if (!fs.existsSync(file)) return null;
      const raw = JSON.parse(fs.readFileSync(file, "utf8")) as Omit<Game, "slug">;
      return { ...raw, slug: d.name };
    })
    .filter((g): g is Game => g !== null)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getGame(slug: string): Game | undefined {
  return getGames().find((g) => g.slug === slug);
}

/* ---------- 攻略读取 ---------- */

function guidesDir(gameSlug: string) {
  return path.join(CONTENT_ROOT, gameSlug, "guides");
}

/** gray-matter 会把 YAML 日期解析成 Date，这里统一归一化为 ISO 字符串 */
function normalizeDate(v: unknown): string | undefined {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "string" && v.length > 0) return v;
  return undefined;
}

function readGuideMeta(gameSlug: string, file: string): GuideMeta | null {
  const full = path.join(guidesDir(gameSlug), file);
  const parsed = matter(fs.readFileSync(full, "utf8"));
  const data = parsed.data as Partial<GuideMeta>;
  if (!data.title || !data.type) return null;
  return {
    slug: file.replace(/\.md$/, ""),
    game: gameSlug,
    title: data.title,
    type: data.type,
    version: data.version != null ? String(data.version) : undefined,
    last_verified: normalizeDate(data.last_verified),
    status: data.status ?? "unverified",
    platforms: data.platforms,
    spoiler: data.spoiler,
    description: data.description,
    tags: data.tags,
  };
}

export function getGuideMetas(gameSlug: string): GuideMeta[] {
  const dir = guidesDir(gameSlug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readGuideMeta(gameSlug, f))
    .filter((g): g is GuideMeta => g !== null)
    .sort((a, b) => (a.last_verified ?? "").localeCompare(b.last_verified ?? ""));
}

export function getAllGuideMetas(): GuideMeta[] {
  return getGames().flatMap((g) => getGuideMetas(g.slug));
}

export async function getGuide(
  gameSlug: string,
  guideSlug: string
): Promise<Guide | null> {
  const full = path.join(guidesDir(gameSlug), `${guideSlug}.md`);
  if (!fs.existsSync(full)) return null;
  const meta = readGuideMeta(gameSlug, `${guideSlug}.md`);
  if (!meta) return null;
  const parsed = matter(fs.readFileSync(full, "utf8"));
  const processed = await remark().use(html).process(parsed.content);
  return { ...meta, contentHtml: processed.toString() };
}

/** 攻略按类型分组，保持固定展示顺序；未知类型追加在末尾，防止新增类型被静默丢弃 */
export function groupGuides(metas: GuideMeta[]): [GuideType, GuideMeta[]][] {
  const order: GuideType[] = [
    "新手指南",
    "流程攻略",
    "Boss打法",
    "Build配装",
    "收集指南",
    "版本解读",
    "机制解析",
    "进阶指南",
    "速查表",
  ];
  const map = new Map<GuideType, GuideMeta[]>();
  for (const m of metas) {
    const arr = map.get(m.type) ?? [];
    arr.push(m);
    map.set(m.type, arr);
  }
  const ordered = order
    .filter((t) => map.has(t))
    .map((t) => [t, map.get(t)!] as [GuideType, GuideMeta[]]);
  const extras = [...map.keys()]
    .filter((t) => !order.includes(t))
    .map((t) => [t, map.get(t)!] as [GuideType, GuideMeta[]]);
  return [...ordered, ...extras];
}

/** 同游戏内相关攻略：同类型 + 标签重合度打分，用于详情页内链 */
export function getRelatedGuides(
  gameSlug: string,
  currentSlug: string,
  limit = 4
): GuideMeta[] {
  const current = getGuideMetas(gameSlug).find((m) => m.slug === currentSlug);
  if (!current) return [];
  const curTags = new Set(current.tags ?? []);
  return getGuideMetas(gameSlug)
    .filter((m) => m.slug !== currentSlug)
    .map((m) => {
      let score = 0;
      if (m.type === current.type) score += 2;
      for (const t of m.tags ?? []) if (curTags.has(t)) score += 1;
      return { m, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.m);
}
