import "server-only";

const BASE = "https://api.semrush.com/";

export function hasSemrushKey(): boolean {
  return Boolean(process.env.SEMRUSH_API_KEY);
}

function normalizeKey(k: string): string {
  return String(k).toLowerCase().replace(/[^a-z0-9_]/g, "");
}

export async function semrushRequest(type: string, params: Record<string, string>): Promise<Record<string, unknown>[]> {
  const key = process.env.SEMRUSH_API_KEY!;
  const p = new URLSearchParams({ key, type, export: "json", ...params });
  const res = await fetch(`${BASE}?${p}`, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`Semrush HTTP ${res.status}: ${await res.text()}`);
  const text = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Semrush yanıtı JSON değil (type=${type}): ${text.slice(0, 200)}`);
  }
  if (!Array.isArray(json)) {
    const rec = (json || {}) as Record<string, unknown>;
    const errCode = rec.error ?? rec.error_code;
    const msg = rec.message ?? rec.message_text ?? JSON.stringify(rec).slice(0, 200);
    throw new Error(`Semrush hata (type=${type})${errCode ? ` [${errCode}]` : ""}: ${msg}`);
  }
  return json.map((r: Record<string, unknown>) => {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(r)) out[normalizeKey(k)] = v;
    return out;
  });
}

function pickText(row: Record<string, unknown>, candidates: string[]): string {
  for (const c of candidates) {
    const hit = Object.entries(row).find(([k]) => k.startsWith(c));
    if (hit && hit[1] !== undefined && hit[1] !== null) return String(hit[1]);
  }
  return "";
}

function pickNum(row: Record<string, unknown>, candidates: string[]): number {
  for (const c of candidates) {
    const hit = Object.entries(row).find(([k]) => k.startsWith(c));
    if (hit) {
      const n = Number(hit[1]);
      if (Number.isFinite(n)) return n;
    }
  }
  return 0;
}

export const TR = "tr";
export const DOMAIN = "infoyatirim.com";

export interface SemrushKeyword {
  keyword: string;
  position: number;
  volume: number;
  traffic: number;
  url: string;
}

export interface SemrushOverview {
  real: boolean;
  domain: string;
  database: string;
  rank: number;
  organicKeywords: number;
  organicTraffic: number;
  topKeywords: SemrushKeyword[];
  endpointsOk: string[];
  fetchedAt: string;
}

export async function fetchSemrushOverview(database: string = TR): Promise<SemrushOverview> {
  const endpointsOk: string[] = [];
  let rank = 0;
  let organicKeywords = 0;
  let organicTraffic = 0;
  let topKeywords: SemrushKeyword[] = [];

  // domain_overview: tek veritabanında özet (Rk=rank, Or=organik kelime, Ot=organik trafik)
  try {
    const rows = await semrushRequest("domain_overview", {
      domain: DOMAIN,
      database,
      display_limit: "1",
      export_columns: "Rk,Or,Ot",
    });
    if (rows.length > 0) endpointsOk.push("domain_overview");
    const row = rows[0] || {};
    rank = pickNum(row, ["rk", "rank"]);
    organicKeywords = pickNum(row, ["or", "organickeywords"]);
    organicTraffic = pickNum(row, ["ot", "organictraffic"]);
  } catch (e) {
    console.error("domain_overview hatası:", e instanceof Error ? e.message : e);
  }

  try {
    const rows = await semrushRequest("domain_organic", {
      domain: DOMAIN,
      database,
      display_limit: "12",
      export_columns: "Ph,Po,Nq,Ur,Tg",
    });
    if (rows.length > 0) endpointsOk.push("domain_organic");
    const kws = rows.map(r => ({
      keyword: pickText(r, ["ph", "keyword"]),
      position: pickNum(r, ["po", "position", "pos"]),
      volume: pickNum(r, ["nq", "volume", "searchvolume", "kwvolume"]),
      traffic: pickNum(r, ["tg", "traffic"]),
      url: pickText(r, ["ur", "url"]),
    })).filter(k => k.keyword);
    if (kws.length > 0) {
      topKeywords = kws.map((k, i) => ({ ...k, position: k.position || i + 1 }));
      if (!organicTraffic) organicTraffic = topKeywords.reduce((a, k) => a + k.traffic, 0);
    }
  } catch (e) {
    console.error("domain_organic hatası:", e instanceof Error ? e.message : e);
  }

  return {
    real: Boolean(endpointsOk.length),
    domain: DOMAIN,
    database,
    rank,
    organicKeywords,
    organicTraffic,
    topKeywords,
    endpointsOk,
    fetchedAt: new Date().toISOString(),
  };
}