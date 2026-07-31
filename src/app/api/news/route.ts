import { NextResponse } from "next/server";
import { NEWS_SOURCES, parseRss, FALLBACK_NEWS, NewsItem } from "@/lib/news";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_ITEMS_PER_SOURCE = 8;

export async function GET() {
  const results = await Promise.allSettled(
    NEWS_SOURCES.map(async (s) => {
      const res = await fetch(s.url, {
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
          accept: "application/rss+xml, application/xml, text/xml, */*",
        },
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error(`${s.id}: ${res.status}`);
      return parseRss(await res.text(), s.id);
    })
  );

  const items: NewsItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") items.push(...r.value);
  }

  items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const deduped = [...new Map(items.map(i => [i.title, i])).values()]
    .slice(0, NEWS_SOURCES.length * MAX_ITEMS_PER_SOURCE);

  return NextResponse.json({
    ok: true,
    fetched: items.length > 0,
    updatedAt: new Date().toISOString(),
    sources: NEWS_SOURCES.map(s => s.name),
    news: deduped.length > 0 ? deduped : FALLBACK_NEWS,
  });
}
