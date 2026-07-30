import { SITES } from "@/lib/data";
import { getPeriodData, getWeeklyData, PeriodId } from "@/lib/weekly-data";

export interface Insight {
  type: "positive" | "negative" | "neutral";
  icon: string;
  title: string;
  description: string;
  siteId?: string;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

export function generateInsights(period: PeriodId): Insight[] {
  const insights: Insight[] = [];

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
      description: `11 aracı kurumun toplam aylık ziyareti ${fmt(total)}. Ortalama Authority Score ${avgAS}/100.`,
    });

    insights.push({
      type: "positive", icon: "Zap",
      title: "En Hızlı Büyüyen",
      description: `${topGainer.name} organik trafiğini %${topGainer.organicChange} artırdı. En yüksek büyüme performansı.`,
      siteId: topGainer.id,
    });

    insights.push({
      type: "negative", icon: "TrendingDown",
      title: "En Çok Gerileyen",
      description: `${topDecliner.name} organik trafikte %${Math.abs(topDecliner.organicChange)} kaybetti. Sebep analizi önerilir.`,
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

    return insights;
  }

  const weekData = SITES.map((s) => ({
    site: s,
    current: getPeriodData(s.id, period),
    prev: getPeriodData(s.id, period === "week1" ? "week1" : {
      week2: "week1", week3: "week2", week4: "week3",
    }[period] as PeriodId || "week3"),
  }));

  const gainers: { site: typeof SITES[0]; change: number }[] = [];
  const decliners: { site: typeof SITES[0]; change: number }[] = [];

  for (const { site, current, prev } of weekData) {
    if (!current || !prev) continue;
    const change = ((current.visits - prev.visits) / prev.visits) * 100;
    if (change > 0) gainers.push({ site, change });
    else if (change < 0) decliners.push({ site, change });
  }

  gainers.sort((a, b) => b.change - a.change);
  decliners.sort((a, b) => a.change - b.change);

  if (gainers.length > 0) {
    const top = gainers[0];
    insights.push({
      type: "positive", icon: "TrendingUp",
      title: "Haftanın Yıldızı",
      description: `${top.site.name} geçen haftaya göre trafiğini %${top.change.toFixed(1)} artırdı (${fmt(top.site.visits)} ziyaret).`,
      siteId: top.site.id,
    });
  }

  if (decliners.length > 0) {
    const worst = decliners[0];
    insights.push({
      type: "negative", icon: "TrendingDown",
      title: "Haftanın Düşüşü",
      description: `${worst.site.name} haftalık trafiğinde %${Math.abs(worst.change).toFixed(1)} düşüş görüldü.`,
      siteId: worst.site.id,
    });
  }

  const totalWeekly = weekData.reduce((a, w) => a + (w.current?.visits || 0), 0);
  insights.push({
    type: "neutral", icon: "Globe",
    title: "Haftalık Pazar",
    description: `Seçili haftada 11 sitenin toplam trafiği ${fmt(totalWeekly)}.`,
  });

  const highBounce = [...weekData].filter(w => w.current).sort((a, b) => (b.site.bounceRate || 0) - (a.site.bounceRate || 0))[0];
  if (highBounce) {
    insights.push({
      type: "negative", icon: "MousePointerClick",
      title: "Yüksek Hemen Çıkma",
      description: `${highBounce.site.name} %${highBounce.site.bounceRate} hemen çıkma oranıyla en yüksek seviyede. İyileştirme önerilir.`,
      siteId: highBounce.site.id,
    });
  }

  return insights;
}
