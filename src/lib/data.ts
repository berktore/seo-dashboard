export interface SiteData {
  id: string;
  name: string;
  domain: string;
  color: string;
  visits: number;
  visitsDisplay: string;
  globalRank: number;
  countryRank: number;
  authorityScore: number;
  bounceRate: number;
  pagesPerVisit: number;
  avgDuration: string;
  organicTraffic: string;
  organicChange: number;
  paidTraffic: string;
  paidChange: number;
  refDomains: number;
  refDomainsChange: number;
  totalBacklinks: number;
  backlinksChange: number;
  aiTraffic: number;
  channels: Record<string, number>;
  keywords: { rank: number; keyword: string; position: number; volume: number; trafficShare: string }[];
  monthlyVisits: { month: string; value: number }[];
  topPages: { path: string; traffic: number; share: string }[];
}

export const SITES: SiteData[] = [
  {
    id: "info",
    name: "infoyatirim.com",
    domain: "infoyatirim.com",
    color: "#f59e0b",
    visits: 471350,
    visitsDisplay: "471.4K",
    globalRank: 86118,
    countryRank: 1981,
    authorityScore: 45,
    bounceRate: 66.65,
    pagesPerVisit: 6.98,
    avgDuration: "8dk 13sn",
    organicTraffic: "210.9K",
    organicChange: -9,
    paidTraffic: "2.13K",
    paidChange: -44,
    refDomains: 1840,
    refDomainsChange: 7,
    totalBacklinks: 27290,
    backlinksChange: -23,
    aiTraffic: 223,
    channels: { direct: 70.23, organic: 24.58, referral: 2, social: 1, paid: 1, mail: 1 },
    keywords: [
      { rank: 1, keyword: "halka arz takvimi", position: 2, volume: 1000, trafficShare: "%12.43" },
      { rank: 2, keyword: "canlı borsa", position: 10, volume: 368000, trafficShare: "%5.25" },
      { rank: 3, keyword: "sermaye artırımı", position: 2, volume: 1000, trafficShare: "%2.87" },
      { rank: 4, keyword: "sasa hisse", position: 3, volume: 4090000, trafficShare: "%1.36" },
      { rank: 5, keyword: "ist: kchol", position: 8, volume: 60500, trafficShare: "%0.86" },
    ],
    monthlyVisits: [
      { month: "Oca", value: 180 }, { month: "Şub", value: 210 }, { month: "Mar", value: 260 },
      { month: "Nis", value: 310 }, { month: "May", value: 380 }, { month: "Haz", value: 471 },
    ],
    topPages: [
      { path: "/halka-arz-takvimi", traffic: 58568, share: "%12.43" },
      { path: "/canli-borsa", traffic: 24734, share: "%5.25" },
      { path: "/sermaye-artirimi", traffic: 13524, share: "%2.87" },
    ],
  },
  {
    id: "gcm",
    name: "gcmyatirim.com.tr",
    domain: "gcmyatirim.com.tr",
    color: "#3b82f6",
    visits: 2010000,
    visitsDisplay: "2.01M",
    globalRank: 25044,
    countryRank: 504,
    authorityScore: 54,
    bounceRate: 91.84,
    pagesPerVisit: 1.30,
    avgDuration: "10dk 47sn",
    organicTraffic: "2.41M",
    organicChange: -4,
    paidTraffic: "2.72M",
    paidChange: -27,
    refDomains: 2500,
    refDomainsChange: 3,
    totalBacklinks: 974770,
    backlinksChange: -9,
    aiTraffic: 448,
    channels: { direct: 63.7, organic: 17.56, referral: 8, social: 4, paid: 5, mail: 1.74 },
    keywords: [
      { rank: 1, keyword: "tam altın fiyatı", position: 1, volume: 450000, trafficShare: "%8.82" },
      { rank: 2, keyword: "ceyrek altin fiyati", position: 12, volume: 246000, trafficShare: "%4.82" },
      { rank: 3, keyword: "çeyrek altın fiyatı", position: 3, volume: 2240000, trafficShare: "%3.73" },
      { rank: 4, keyword: "çeyrek altın ne kadar", position: 5, volume: 1830000, trafficShare: "%2.28" },
      { rank: 5, keyword: "sasa hisse", position: 9, volume: 4090000, trafficShare: "%2.21" },
    ],
    monthlyVisits: [
      { month: "Oca", value: 1850 }, { month: "Şub", value: 1920 }, { month: "Mar", value: 1880 },
      { month: "Nis", value: 1950 }, { month: "May", value: 2010 }, { month: "Haz", value: 2010 },
    ],
    topPages: [
      { path: "/altin/tam-altin-fiyati", traffic: 177282, share: "%8.82" },
      { path: "/altin/ceyrek-altin", traffic: 96882, share: "%4.82" },
      { path: "/altin", traffic: 74973, share: "%3.73" },
    ],
  },
  {
    id: "isy",
    name: "isyatirim.com.tr",
    domain: "isyatirim.com.tr",
    color: "#a855f7",
    visits: 346460,
    visitsDisplay: "346.5K",
    globalRank: 110338,
    countryRank: 2748,
    authorityScore: 59,
    bounceRate: 63.49,
    pagesPerVisit: 2.25,
    avgDuration: "6dk 22sn",
    organicTraffic: "2.80M",
    organicChange: -1,
    paidTraffic: "0",
    paidChange: 0,
    refDomains: 3140,
    refDomainsChange: -13,
    totalBacklinks: 69540,
    backlinksChange: -10,
    aiTraffic: 996,
    channels: { direct: 52.87, organic: 36.4, referral: 5, social: 3, paid: 0, mail: 2.73 },
    keywords: [
      { rank: 1, keyword: "sasa hisse", position: 3, volume: 4090000, trafficShare: "%7.38" },
      { rank: 2, keyword: "bist 100", position: 7, volume: 1830000, trafficShare: "%1.98" },
      { rank: 3, keyword: "aselsan hisse", position: 3, volume: 1220000, trafficShare: "%1.76" },
      { rank: 4, keyword: "tüpraş hisse", position: 3, volume: 673000, trafficShare: "%1.21" },
      { rank: 5, keyword: "hisse", position: 11, volume: 35000, trafficShare: "%2.29" },
    ],
    monthlyVisits: [
      { month: "Oca", value: 320 }, { month: "Şub", value: 335 }, { month: "Mar", value: 340 },
      { month: "Nis", value: 342 }, { month: "May", value: 345 }, { month: "Haz", value: 346 },
    ],
    topPages: [
      { path: "/hisse/sasa", traffic: 25568, share: "%7.38" },
      { path: "/endeks/bist-100", traffic: 6858, share: "%1.98" },
      { path: "/hisse/aselsan", traffic: 6098, share: "%1.76" },
    ],
  },
  {
    id: "ged",
    name: "gedik.com",
    domain: "gedik.com",
    color: "#22c55e",
    visits: 306850,
    visitsDisplay: "306.9K",
    globalRank: 121621,
    countryRank: 3054,
    authorityScore: 50,
    bounceRate: 53.86,
    pagesPerVisit: 2.70,
    avgDuration: "6dk 50sn",
    organicTraffic: "439.9K",
    organicChange: -2,
    paidTraffic: "4.71K",
    paidChange: 2,
    refDomains: 2260,
    refDomainsChange: 1,
    totalBacklinks: 98030,
    backlinksChange: 0,
    aiTraffic: 61,
    channels: { direct: 69.11, organic: 24.66, referral: 3, social: 2, paid: 1, mail: 0.23 },
    keywords: [
      { rank: 1, keyword: "ons altın", position: 6, volume: 1220000, trafficShare: "%13.97" },
      { rank: 2, keyword: "gedik yatırım", position: 1, volume: 12100, trafficShare: "%2.21" },
      { rank: 3, keyword: "altın ons", position: 7, volume: 165000, trafficShare: "%1.51" },
      { rank: 4, keyword: "faiz", position: 3, volume: 246000, trafficShare: "%1.40" },
      { rank: 5, keyword: "gedik", position: 1, volume: 9900, trafficShare: "%1.81" },
    ],
    monthlyVisits: [
      { month: "Oca", value: 290 }, { month: "Şub", value: 295 }, { month: "Mar", value: 300 },
      { month: "Nis", value: 302 }, { month: "May", value: 305 }, { month: "Haz", value: 307 },
    ],
    topPages: [
      { path: "/yatirim/altin/ons-altin", traffic: 42866, share: "%13.97" },
      { path: "/kurumsal", traffic: 6778, share: "%2.21" },
      { path: "/yatirim/altin", traffic: 4633, share: "%1.51" },
    ],
  },
];

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Genel Bakış", icon: "LayoutDashboard", description: "Temel metrikler ve özet" },
  { href: "/compare", label: "Domain Karşılaştırma", icon: "GitCompare", description: "Rakip analizi ve karşılaştırma" },
  { href: "/keywords", label: "Anahtar Kelimeler", icon: "Search", description: "Sıralama ve kelime performansı" },
  { href: "/traffic", label: "Trafik Analizi", icon: "BarChart3", description: "Kanal ve kaynak analizi" },
  { href: "/backlinks", label: "Backlink Analizi", icon: "Link2", description: "Backlink ve otorite analizi" },
];
