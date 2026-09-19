import { getAllGuideMetas, getGames } from "@/lib/content";
import { siteConfig } from "@/site.config";

export const dynamic = "force-static";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET(): Promise<Response> {
  const gameNames = new Map(getGames().map((g) => [g.slug, g.name]));
  const metas = getAllGuideMetas().sort((a, b) =>
    (b.last_verified ?? "").localeCompare(a.last_verified ?? "")
  );

  const items = metas
    .map((m) => {
      const url = `${siteConfig.url}/games/${m.game}/guides/${m.slug}`;
      const pubDate = m.last_verified
        ? new Date(`${m.last_verified}T00:00:00Z`).toUTCString()
        : new Date().toUTCString();
      const category = gameNames.get(m.game) ?? m.game;
      return `    <item>
      <title>${esc(m.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <category>${esc(category)}</category>
      <pubDate>${pubDate}</pubDate>
      <description>${esc(m.description ?? "")}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(siteConfig.name)}</title>
    <link>${siteConfig.url}</link>
    <description>${esc(siteConfig.description)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
