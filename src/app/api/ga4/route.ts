import { NextRequest } from "next/server";
import { fetchGa4Overview, hasGa4Config } from "@/lib/ga4";
import { PeriodId } from "@/lib/weekly-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TTL_MS = 5 * 60 * 1000;
let cache: { key: string; ts: number; payload: unknown } | null = null;

export async function GET(req: NextRequest) {
  const period = (req.nextUrl.searchParams.get("period") || "month") as PeriodId;

  if (!hasGa4Config()) {
    return Response.json({ ok: true, real: false, reason: "GA4 yapılandırması eklenmemiş" });
  }

  if (cache && cache.key === period && Date.now() - cache.ts < TTL_MS) {
    return Response.json(cache.payload);
  }

  try {
    const data = await fetchGa4Overview(period);
    const payload = { ok: true, real: true, data };
    cache = { key: period, ts: Date.now(), payload };
    return Response.json(payload);
  } catch (e) {
    console.error("GA4 sorgu hatası:", e);
    return Response.json(
      { ok: false, real: false, error: e instanceof Error ? e.message : "GA4 sorgu hatası" },
      { status: 500 }
    );
  }
}
