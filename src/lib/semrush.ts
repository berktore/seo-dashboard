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
    throw new Error("Semrush yanıtı JSON değil");
  }
  const arr = Array.isArray(json) ? json : [];
  return arr.map((r: Record<string, unknown>) => {
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
  organicTraffic: number;
  topKeywords: SemrushKeyword[];
  endpointsOk: string[];
  fetchedAt: string;
}

export async function fetchSemrushOverview(database: string = TR): Promise<SemrushOverview> {
  const endpointsOk: string[] = [];
  let rank = 0;
  let topKeywords: SemrushKeyword[] = [];

  try {
    const rows = await semrushRequest("domain_organic", {
      domain: DOMAIN,
      database,
      display_limit: "12",
      export_columns: "Ph,Po,Nq,Vu,Tr,Ur",
    });
    if (rows.length > 0) endpointsOk.push("domain_organic");
    topKeywords = rows.map(r => ({
      keyword: pickText(r, ["ph", "keyword"]),
      position: pickNum(r, ["po", "position", "pos"]),
      volume: pickNum(r, ["nq", "volume", "searchvolume", "kwvolume"]),
      traffic: pickNum(r, ["vu", "traffic", "tr"]),
      url: pickText(r, ["ur", "url"]),
    })).filter(k => k.keyword).map((k, i) => ({ ...k, position: k.position || i + 1 }));
  } catch { /* opsiyonel */ }

  try {
    const rows = await semrushRequest("domain_rank", { domain: DOMAIN, database });
    if (rows.length > 0) endpointsOk.push("domain_rank");
    rank = pickNum(rows[0] || {}, ["rank", "organicrank", "rk"]);
  } catch {
    // domain_ranks (tüm DB) denemesi
    try {
      const rows = await semrushRequest("domain_ranks", { domain: DOMAIN });
      const hit = rows.find(r => {
        const db = pickText(r, ["database", "databasecode"]);
        return db.toLowerCase().startsWith(database) || db === "tr";
      }) || rows[0];
      if (hit) {
        endpointsOk.push("domain_ranks");
        rank = pickNum(hit, ["rank", "organicrank", "rk"]);
      }
    } catch { /* opsiyonel */ }
  }

  const organicTraffic = topKeywords.reduce((a, k) => a + k.traffic, 0);

  return {
    real: Boolean(endpointsOk.length),
    domain: DOMAIN,
    database,
    rank,
    organicTraffic,
    topKeywords,
    endpointsOk,
    fetchedAt: new Date().toISOString(),
  };
}