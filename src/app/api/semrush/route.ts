import { hasSemrushKey, fetchSemrushOverview } from "@/lib/semrush";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TTL_MS = 30 * 60 * 1000;
let cache: { key: string; ts: number; payload: unknown } | null = null;

export async function GET() {
  if (!hasSemrushKey()) {
    return Response.json({ ok: true, real: false, reason: "SEMRUSH_API_KEY eklenmemiş" });
  }

  const key = "overview";
  if (cache && cache.key === key && Date.now() - cache.ts < TTL_MS) {
    return Response.json(cache.payload);
  }

  try {
    const data = await fetchSemrushOverview();
    const payload = { ok: true, real: true, data };
    cache = { key, ts: Date.now(), payload };
    return Response.json(payload);
  } catch (e) {
    console.error("Semrush sorgu hatası:", e);
    return Response.json(
      { ok: false, real: false, error: e instanceof Error ? e.message : "Semrush sorgu hatası" },
      { status: 500 }
    );
  }
}