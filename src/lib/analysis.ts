import { SITES, PageDetail } from "@/lib/data";
import { getPeriodData, PeriodId } from "@/lib/weekly-data";

export interface Insight {
  type: "positive" | "negative" | "neutral";
  icon: string;
  title: string;
  description: string;
  siteId?: string;
}

export interface PageAnalysis {
  page: PageDetail;
  type: "high_traffic_high_bounce" | "low_traffic_low_bounce" | "top_performer" | "opportunity" | "average";
  title: string;
  description: string;
  recommendation: string;
}

export interface CompetitorSummary {
  site: typeof SITES[0];
  totalPageTraffic: number;
  avgBounce: number;
  topPage: PageDetail;
  worstPage: PageDetail;
  bestPage: PageDetail;
  categoryBreakdown: Record<string, number>;
  insight: string;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

export function analyzePages(siteId?: string): PageAnalysis[] {
  const site = siteId ? SITES.find(s => s.id === siteId) || SITES[0] : SITES[0];
  if (!site.pageDetails.length) return [];
  const results: PageAnalysis[] = [];

  for (const page of site.pageDetails) {
    if (page.traffic >= 5000 && page.bounceRate >= 65) {
      results.push({
        page, type: "high_traffic_high_bounce",
        title: "Uyarı: Yüksek Trafik × Yüksek Hemen Çıkma",
        description: `${page.path} sayfası ${fmt(page.traffic)} ziyaret alıyor ancak hemen çıkma oranı %${page.bounceRate}. Ortalama kalış süresi sadece ${page.avgDuration}.`,
        recommendation: "Sayfaya yönlendirme linkleri, ilgili içerik önerileri veya CTA butonları ekleyerek kullanıcıları diğer sayfalara yönlendirin.",
      });
    } else if (page.traffic < 5000 && page.bounceRate <= 45 && page.avgDurationSec >= 240) {
      results.push({
        page, type: "low_traffic_low_bounce",
        title: "Gizli Hazine: Düşük Trafik × Yüksek Etkileşim",
        description: `${page.path} sayfası sadece ${fmt(page.traffic)} ziyaret alıyor ancak hemen çıkma %${page.bounceRate}, ortalama süre ${page.avgDuration} ile en kaliteli trafik burada.`,
        recommendation: "Bu sayfayı sosyal medyada, e-posta bültenlerinde ve ana sayfada öne çıkararak trafiği artırın.",
      });
    } else if (page.bounceRate <= 40 && page.avgDurationSec >= 300) {
      results.push({
        page, type: "top_performer",
        title: "En İyi Performans",
        description: `${page.path} sayfası %${page.bounceRate} hemen çıkma ve ${page.avgDuration} ortalama süre ile en iyi performans gösteren sayfa.`,
        recommendation: "Bu sayfanın başarılı yapısını diğer sayfalara da uygulayın.",
      });
    } else if (page.traffic < 3000 && page.bounceRate > 55) {
      results.push({
        page, type: "opportunity",
        title: "İyileştirme Fırsatı",
        description: `${page.path} sayfası düşük trafik (${fmt(page.traffic)}) ve yüksek hemen çıkma (%${page.bounceRate}) ile potansiyelin altında.`,
        recommendation: "Sayfa içeriğini güncelleyin, meta açıklamaları optimize edin.",
      });
    } else {
      results.push({
        page, type: "average",
        title: "Standart Performans",
        description: `${page.path} sayfası ${fmt(page.traffic)} ziyaret, %${page.bounceRate} hemen çıkma ile dengeli performans sergiliyor.`,
        recommendation: "Mevcut performansı koruyarak küçük iyileştirmelerle trafiği artırın.",
      });
    }
  }

  const order: Record<string, number> = {
    high_traffic_high_bounce: 0, low_traffic_low_bounce: 1,
    top_performer: 2, opportunity: 3, average: 4,
  };
  results.sort((a, b) => (order[a.type] ?? 99) - (order[b.type] ?? 99));
  return results;
}

export function generateCompetitorSummaries(): CompetitorSummary[] {
  return SITES.slice(1).filter(s => s.pageDetails.length > 0).map(site => {
    const pages = site.pageDetails;
    const totalPageTraffic = pages.reduce((a, p) => a + p.traffic, 0);
    const avgBounce = Math.round(pages.reduce((a, p) => a + p.bounceRate, 0) / pages.length);
    const topPage = [...pages].sort((a, b) => b.traffic - a.traffic)[0];
    const worstPage = [...pages].sort((a, b) => b.bounceRate - a.bounceRate)[0];
    const bestPage = [...pages].sort((a, b) => a.bounceRate - b.bounceRate)[0];

    const catBreak: Record<string, number> = {};
    let catTraffic = 0;
    for (const p of pages) {
      catBreak[p.category] = (catBreak[p.category] || 0) + p.traffic;
      catTraffic += p.traffic;
    }
    const topCat = Object.entries(catBreak).sort((a, b) => b[1] - a[1])[0];
    const insight = `${site.name} en çok "${topCat?.[0]}" kategorisinden trafik alıyor (${fmt(topCat?.[1] || 0)}). En popüler sayfa: ${topPage.path} (${fmt(topPage.traffic)}). Hemen çıkma ortalaması %${avgBounce}.`;

    return { site, totalPageTraffic, avgBounce, topPage, worstPage, bestPage, categoryBreakdown: catBreak, insight };
  });
}

export function generateInsights(period: PeriodId): Insight[] {
  const insights: Insight[] = [];
  const site = SITES[0];

  const totalPageTraffic = site.pageDetails.reduce((a, p) => a + p.traffic, 0);
  const avgBounce = Math.round(site.pageDetails.reduce((a, p) => a + p.bounceRate, 0) / site.pageDetails.length);
  const highBouncePages = site.pageDetails.filter(p => p.bounceRate >= 65);
  const lowBouncePages = site.pageDetails.filter(p => p.bounceRate <= 40 && p.avgDurationSec >= 240);
  const shortDurationPages = site.pageDetails.filter(p => p.avgDurationSec < 120);

  insights.push({
    type: "neutral", icon: "BarChart3",
    title: "Sayfa Trafik Dağılımı",
    description: `infoyatirim.com'da analiz edilen ${site.pageDetails.length} sayfanın toplam trafiği ${fmt(totalPageTraffic)}. Ortalama hemen çıkma %${avgBounce}.`,
  });

  const topPage = [...site.pageDetails].sort((a, b) => b.traffic - a.traffic)[0];
  const bestPage = [...site.pageDetails].sort((a, b) => a.bounceRate - b.bounceRate)[0];

  insights.push({
    type: "positive", icon: "Zap",
    title: "En Çok Ziyaret Edilen Sayfa",
    description: `${topPage.path} — ${fmt(topPage.traffic)} ziyaret (%${topPage.bounceRate} hemen çıkma, ${topPage.avgDuration} süre).`,
  });

  insights.push({
    type: "positive", icon: "Award",
    title: "En Düşük Hemen Çıkma",
    description: `${bestPage.path} — sadece %${bestPage.bounceRate} hemen çıkma, ${bestPage.avgDuration} kalış süresi.`,
    siteId: "info",
  });

  if (highBouncePages.length > 0) {
    insights.push({
      type: "negative", icon: "TrendingDown",
      title: "Yüksek Hemen Çıkma Uyarısı",
      description: `${highBouncePages.length} sayfada hemen çıkma oranı %65 üzerinde: ${highBouncePages.map(p => `${p.path} (%${p.bounceRate})`).join(", ")}.`,
    });
  }

  if (shortDurationPages.length > 0) {
    insights.push({
      type: "negative", icon: "MousePointerClick",
      title: "Kısa Kalış Süresi",
      description: `${shortDurationPages.length} sayfada ortalama kalış 2 dakikanın altında — içerik derinliği artırılmalı.`,
    });
  }

  if (lowBouncePages.length > 0) {
    insights.push({
      type: "neutral", icon: "Lightbulb",
      title: "Gizli Potansiyel",
      description: `${lowBouncePages.length} sayfa düşük trafik almasına rağmen yüksek etkileşim sağlıyor. Trafik artırılırsa önemli kazanç elde edilebilir.`,
    });
  }

  if (period === "month") {
    const total = SITES.reduce((a, s) => a + s.visits, 0);
    const avgAS = Math.round(SITES.reduce((a, s) => a + s.authorityScore, 0) / SITES.length);
    const topGainer = [...SITES].sort((a, b) => (b.organicChange || 0) - (a.organicChange || 0))[0];
    const topDecliner = [...SITES].sort((a, b) => (a.organicChange || 0) - (b.organicChange || 0))[0];
    const highestAS = [...SITES].sort((a, b) => b.authorityScore - a.authorityScore)[0];
    const mostBacklinks = [...SITES].sort((a, b) => b.totalBacklinks - a.totalBacklinks)[0];

    insights.push({
      type: "positive", icon: "TrendingUp",
      title: "Pazar Büyüklüğü",
      description: `${SITES.length} aracı kurumun toplam aylık ziyareti ${fmt(total)}. Ortalama AS ${avgAS}/100.`,
    });
    insights.push({
      type: "positive", icon: "Zap",
      title: "En Hızlı Büyüyen",
      description: `${topGainer.name} organik trafiğini %${topGainer.organicChange} artırdı.`,
      siteId: topGainer.id,
    });
    insights.push({
      type: "negative", icon: "TrendingDown",
      title: "En Çok Gerileyen",
      description: `${topDecliner.name} organik trafikte %${Math.abs(topDecliner.organicChange)} kaybetti.`,
      siteId: topDecliner.id,
    });
    insights.push({
      type: "positive", icon: "Award",
      title: "Otorite Lideri",
      description: `${highestAS.name} AS ${highestAS.authorityScore} ile sektörün en otoriter sitesi.`,
      siteId: highestAS.id,
    });
    insights.push({
      type: "neutral", icon: "Link2",
      title: "Backlink Lideri",
      description: `${mostBacklinks.name} ${fmt(mostBacklinks.totalBacklinks)} backlink ile en geniş bağlantı ağına sahip.`,
      siteId: mostBacklinks.id,
    });
  } else {
    const weekData = SITES.map(s => ({
      site: s,
      current: getPeriodData(s.id, period),
      prev: getPeriodData(s.id, ({ week1: "week1", week2: "week1", week3: "week2", week4: "week3" })[period] as PeriodId || "week3"),
    }));
    const gainers = weekData.filter(d => d.current && d.prev).map(d => ({
      site: d.site,
      change: ((d.current!.visits - d.prev!.visits) / d.prev!.visits) * 100,
    })).filter(d => d.change > 0).sort((a, b) => b.change - a.change);
    const decliners = weekData.filter(d => d.current && d.prev).map(d => ({
      site: d.site,
      change: ((d.current!.visits - d.prev!.visits) / d.prev!.visits) * 100,
    })).filter(d => d.change < 0).sort((a, b) => a.change - b.change);

    if (gainers.length) insights.push({ type: "positive", icon: "TrendingUp", title: "Haftanın Yıldızı", description: `${gainers[0].site.name} trafiğini %${gainers[0].change.toFixed(1)} artırdı.`, siteId: gainers[0].site.id });
    if (decliners.length) insights.push({ type: "negative", icon: "TrendingDown", title: "Haftanın Düşüşü", description: `${decliners[0].site.name} trafiğinde %${Math.abs(decliners[0].change).toFixed(1)} düşüş.`, siteId: decliners[0].site.id });
    const tw = weekData.reduce((a, w) => a + (w.current?.visits || 0), 0);
    insights.push({ type: "neutral", icon: "Globe", title: "Haftalık Pazar", description: `Seçili haftada ${SITES.length} sitenin toplam trafiği ${fmt(tw)}.` });
    const hb = weekData.filter(w => w.current).sort((a, b) => b.site.bounceRate - a.site.bounceRate)[0];
    if (hb) insights.push({ type: "negative", icon: "MousePointerClick", title: "Yüksek Hemen Çıkma", description: `${hb.site.name} %${hb.site.bounceRate} ile en yüksek hemen çıkma oranına sahip.`, siteId: hb.site.id });
  }

  return insights;
}
