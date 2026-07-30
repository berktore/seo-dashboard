export type Site = "infoyatirim.com" | "gcmyatirim.com.tr" | "isyatirim.com.tr" | "gedik.com";

export interface SiteData {
  name: Site;
  short: string;
  color: string;
  visits: number;
  visitsLabel: string;
  globalRank: number;
  trRank: number;
  authorityScore: number;
  bounceRate: number;
  pagesPerVisit: number;
  avgTime: string;
  organicTraffic: string;
  paidTraffic: string;
  refDomains: string;
  backlinks: string;
  aiTraffic: number;
  channels: { direct: number; organic: number; referral: number; social: number; paid: number; mail: number };
  keywords: { rank: number; keyword: string; position: number; volume: number; trafficPct: string }[];
}

export const sites: SiteData[] = [
  {
    name: "infoyatirim.com",
    short: "INFO",
    color: "#f59e0b",
    visits: 471350,
    visitsLabel: "471.35K",
    globalRank: 86118,
    trRank: 1981,
    authorityScore: 45,
    bounceRate: 66.65,
    pagesPerVisit: 6.98,
    avgTime: "8dk 13sn",
    organicTraffic: "210.9K (-%9)",
    paidTraffic: "2.13K (-%44)",
    refDomains: "1.84K (+%7)",
    backlinks: "27.29K (-%23)",
    aiTraffic: 223,
    channels: { direct: 70.23, organic: 24.58, referral: 2, social: 1, paid: 1, mail: 1 },
    keywords: [
      { rank: 1, keyword: "halka arz takvimi", position: 2, volume: 1000, trafficPct: "%12.43" },
      { rank: 2, keyword: "canlı borsa", position: 10, volume: 368000, trafficPct: "%5.25" },
      { rank: 3, keyword: "sermaye artırımı", position: 2, volume: 1000, trafficPct: "%2.87" },
      { rank: 4, keyword: "sasa hisse", position: 3, volume: 4090000, trafficPct: "%1.36" },
      { rank: 5, keyword: "ist: kchol", position: 8, volume: 60500, trafficPct: "%0.86" },
    ],
  },
  {
    name: "gcmyatirim.com.tr",
    short: "GCM",
    color: "#3b82f6",
    visits: 2010000,
    visitsLabel: "2.01M",
    globalRank: 25044,
    trRank: 504,
    authorityScore: 54,
    bounceRate: 91.84,
    pagesPerVisit: 1.30,
    avgTime: "10dk 47sn",
    organicTraffic: "2.41M (-%4)",
    paidTraffic: "2.72M (-%27)",
    refDomains: "2.5K (+%3)",
    backlinks: "974.77K (-%9)",
    aiTraffic: 448,
    channels: { direct: 63.7, organic: 17.56, referral: 8, social: 4, paid: 5, mail: 1.74 },
    keywords: [
      { rank: 1, keyword: "tam altın fiyatı", position: 1, volume: 450000, trafficPct: "%8.82" },
      { rank: 2, keyword: "ceyrek altin fiyati", position: 12, volume: 246000, trafficPct: "%4.82" },
      { rank: 3, keyword: "çeyrek altın fiyatı", position: 3, volume: 2240000, trafficPct: "%3.73" },
      { rank: 4, keyword: "çeyrek altın ne kadar", position: 5, volume: 1830000, trafficPct: "%2.28" },
      { rank: 5, keyword: "sasa hisse", position: 9, volume: 4090000, trafficPct: "%2.21" },
    ],
  },
  {
    name: "isyatirim.com.tr",
    short: "ISY",
    color: "#a855f7",
    visits: 346460,
    visitsLabel: "346.46K",
    globalRank: 110338,
    trRank: 2748,
    authorityScore: 59,
    bounceRate: 63.49,
    pagesPerVisit: 2.25,
    avgTime: "6dk 22sn",
    organicTraffic: "2.80M (-%1)",
    paidTraffic: "0",
    refDomains: "3.14K (-%13)",
    backlinks: "69.54K (-%10)",
    aiTraffic: 996,
    channels: { direct: 52.87, organic: 36.4, referral: 5, social: 3, paid: 0, mail: 2.73 },
    keywords: [
      { rank: 1, keyword: "sasa hisse", position: 3, volume: 4090000, trafficPct: "%7.38" },
      { rank: 2, keyword: "bist 100", position: 7, volume: 1830000, trafficPct: "%1.98" },
      { rank: 3, keyword: "aselsan hisse", position: 3, volume: 1220000, trafficPct: "%1.76" },
      { rank: 4, keyword: "tüpraş hisse", position: 3, volume: 673000, trafficPct: "%1.21" },
      { rank: 5, keyword: "hisse", position: 11, volume: 35000, trafficPct: "%2.29" },
    ],
  },
  {
    name: "gedik.com",
    short: "GED",
    color: "#22c55e",
    visits: 306850,
    visitsLabel: "306.85K",
    globalRank: 121621,
    trRank: 3054,
    authorityScore: 50,
    bounceRate: 53.86,
    pagesPerVisit: 2.70,
    avgTime: "6dk 50sn",
    organicTraffic: "439.93K (-%2)",
    paidTraffic: "4.71K (+%2)",
    refDomains: "2.26K (+%1)",
    backlinks: "98.03K (-%0)",
    aiTraffic: 61,
    channels: { direct: 69.11, organic: 24.66, referral: 3, social: 2, paid: 1, mail: 0.23 },
    keywords: [
      { rank: 1, keyword: "ons altın", position: 6, volume: 1220000, trafficPct: "%13.97" },
      { rank: 2, keyword: "gedik yatırım", position: 1, volume: 12100, trafficPct: "%2.21" },
      { rank: 3, keyword: "altın ons", position: 7, volume: 165000, trafficPct: "%1.51" },
      { rank: 4, keyword: "faiz", position: 3, volume: 246000, trafficPct: "%1.40" },
      { rank: 5, keyword: "gedik", position: 1, volume: 9900, trafficPct: "%1.81" },
    ],
  },
];

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export function getPositionColor(pos: number): string {
  if (pos === 1) return "text-emerald-400";
  if (pos === 2) return "text-blue-400";
  if (pos === 3) return "text-purple-400";
  return "text-zinc-400";
}
