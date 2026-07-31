import { SITES } from "./data";

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seeded(seed: string): () => number {
  let t = hash(seed) || 1;
  return () => {
    t = (Math.imul(t, 1664525) + 1013904223) >>> 0;
    return t / 4294967296;
  };
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function keywordChange(keyword: string): number {
  const r = seeded(`kw:${keyword}`);
  return Math.round(r() * 16) - 7;
}

export function keywordDifficulty(keyword: string, volume: number): number {
  const r = seeded(`kd:${keyword}`);
  const base = 16 + Math.log10(volume + 1) * 13;
  return Math.max(5, Math.min(95, Math.round(base + (r() - 0.5) * 20)));
}

export interface KeywordMover {
  keyword: string;
  siteId: string;
  siteName: string;
  position: number;
  change: number;
  volume: number;
}

export function getKeywordMovers(limit = 5): { winners: KeywordMover[]; losers: KeywordMover[] } {
  const all: KeywordMover[] = [];
  for (const s of SITES) {
    for (const kw of s.keywords) {
      all.push({
        keyword: kw.keyword,
        siteId: s.id,
        siteName: s.name.split(".")[0],
        position: kw.position,
        change: keywordChange(kw.keyword),
        volume: kw.volume,
      });
    }
  }
  const winners = [...all].sort((a, b) => b.change - a.change).slice(0, limit);
  const losers = [...all].sort((a, b) => a.change - b.change).slice(0, limit);
  return { winners, losers };
}

export interface OpportunityPoint {
  keyword: string;
  siteId: string;
  siteName: string;
  volume: number;
  difficulty: number;
  position: number;
  score: number;
}

export function getOpportunityMatrix(): OpportunityPoint[] {
  return SITES.flatMap(s =>
    s.keywords.map(kw => {
      const difficulty = keywordDifficulty(kw.keyword, kw.volume);
      const volume = kw.volume;
      const score = Math.round((volume / 1000) * (100 - difficulty) / 100);
      return {
        keyword: kw.keyword,
        siteId: s.id,
        siteName: s.name.split(".")[0],
        volume,
        difficulty,
        position: kw.position,
        score,
      };
    })
  ).sort((a, b) => b.score - a.score);
}

export interface PageMover {
  path: string;
  traffic: number;
  change: number;
  category: string;
}

export function pageChange(path: string): number {
  const r = seeded(`pg:${path}`);
  return Math.round(r() * 46) - 21;
}

export function getPageMovers(siteId = "info", limit = 5): { gainers: PageMover[]; losers: PageMover[] } {
  const site = SITES.find(s => s.id === siteId) || SITES[0];
  const all = site.pageDetails.map(p => ({
    path: p.path,
    traffic: p.traffic,
    change: pageChange(p.path),
    category: p.category,
  }));
  const gainers = [...all].sort((a, b) => b.change - a.change).slice(0, limit);
  const losers = [...all].sort((a, b) => a.change - b.change).slice(0, limit);
  return { gainers, losers };
}

export interface BacklinkRef {
  domain: string;
  links: number;
  authority: number;
  trend: number;
}

const REFERENCE_DOMAINS = [
  "hurriyet.com.tr", "milliyet.com.tr", "sozcu.com.tr", "haberturk.com",
  "cnnturk.com", "ntv.com.tr", "bigpara.hurriyet.com.tr", "webtekno.com",
  "shiftdelete.net", "donanimhaber.com", "paraanaliz.com", "yatirimciyiz.com",
  "blogspot.com", "medium.com", "wikipedia.org", "linkedin.com",
  "ekonomim.com", "dunya.com", "fortuneturkey.com", "bloomberght.com",
];

export function getBacklinkProfile(siteId = "info"): {
  refs: BacklinkRef[];
  newLinks: number;
  lostLinks: number;
  anchorBreakdown: { label: string; pct: number }[];
  domainAS: number;
} {
  const site = SITES.find(s => s.id === siteId) || SITES[0];
  const refs: BacklinkRef[] = REFERENCE_DOMAINS.map((d, i) => {
    const r = seeded(`bl:${siteId}:${d}`);
    const weight = 1 / (i + 1);
    const links = Math.max(2, Math.round(site.totalBacklinks * weight * (0.03 + r() * 0.06)));
    const authority = Math.max(12, Math.min(94, Math.round(30 + r() * 55)));
    const trend = Math.round(r() * 30) - 12;
    return { domain: d, links, authority, trend };
  }).sort((a, b) => b.links - a.links).slice(0, 6);

  const rNew = seeded(`blnew:${siteId}`);
  const newLinks = Math.max(0, Math.round(site.totalBacklinks * 0.04 * (0.6 + rNew() * 0.9)));
  const lostLinks = Math.max(0, Math.round(site.totalBacklinks * 0.03 * (0.5 + rNew() * 0.8)));

  const anchorBreakdown = [
    { label: "Markalı", pct: Math.round(34 + rNew() * 20) },
    { label: "Çıplak URL", pct: Math.round(18 + rNew() * 12) },
    { label: "Genel (tıkla, buraya)", pct: Math.round(12 + rNew() * 10) },
  ];
  const filled = 100 - anchorBreakdown.reduce((a, b) => a + b.pct, 0);
  anchorBreakdown.push({ label: "Uzun kuyruk / diğer", pct: Math.max(0, filled) });

  const domainAS = Math.max(5, Math.round(site.authorityScore * (0.75 + rNew() * 0.4)));

  return { refs, newLinks, lostLinks, anchorBreakdown, domainAS };
}

export function clampTrend(v: number): number {
  return clamp(v, -99, 99);
}
