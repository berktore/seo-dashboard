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

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

export function analyzePages(): PageAnalysis[] {
  const site = SITES[0];
  const results: PageAnalysis[] = [];

  for (const page of site.pageDetails) {
    if (page.traffic >= 10000 && page.bounceRate >= 65) {
      results.push({
        page, type: "high_traffic_high_bounce",
        title: "Uyarı: Yüksek Trafik × Yüksek Hemen Çıkma",
        description: `${page.path} sayfası ${fmt(page.traffic)} ziyaret alıyor ancak hemen çıkma oranı %${page.bounceRate}. Ortalama kalış süresi sadece ${page.avgDuration}. Kullanıcılar ${page.pagesPerVisit} sayfa görüntüleyip çıkıyor.`,
        recommendation: "Sayfaya yönlendirme linkleri, ilgili içerik önerileri veya CTA butonları ekleyerek kullanıcıları diğer sayfalara yönlendirin.",
      });
    } else if (page.traffic < 8000 && page.bounceRate <= 40 && page.avgDurationSec >= 240) {
      results.push({
        page, type: "low_traffic_low_bounce",
        title: "Gizli Hazine: Düşük Trafik × Yüksek Etkileşim",
        description: `${page.path} sayfası sadece ${fmt(page.traffic)} ziyaret alıyor ancak hemen çıkma %${page.bounceRate}, ortalama süre ${page.avgDuration}, sayfa başı ${page.pagesPerVisit} görüntüleme ile en kaliteli trafik burada.`,
        recommendation: "Bu sayfayı sosyal medyada, e-posta bültenlerinde ve ana sayfada öne çıkararak trafiği artırın. İçerik kalitesi korunarak SEO iyileştirmeleri yapın.",
      });
    } else if (page.bounceRate <= 40 && page.avgDurationSec >= 360) {
      results.push({
        page, type: "top_performer",
        title: "En İyi Performans: Düşük Hemen Çıkma",
        description: `${page.path} sayfası %${page.bounceRate} hemen çıkma ve ${page.avgDuration} ortalama süre ile en iyi performans gösteren sayfa. Kullanıcılar ${page.pagesPerVisit} sayfa geziyor.`,
        recommendation: "Bu sayfanın başarılı yapısını diğer sayfalara da uygulayın. Şablon olarak kullanılabilir.",
      });
    } else if (page.traffic < 5000 && page.bounceRate > 55) {
      results.push({
        page, type: "opportunity",
        title: "İyileştirme Fırsatı",
        description: `${page.path} sayfası düşük trafik (${fmt(page.traffic)}) ve yüksek hemen çıkma (%${page.bounceRate}) ile potansiyelin altında performans gösteriyor.`,
        recommendation: "Sayfa içeriğini güncelleyin, meta açıklamaları optimize edin ve kullanıcı niyetiyle uyumlu başlıklar kullanın.",
      });
    } else {
      results.push({
        page, type: "average",
        title: "Standart Performans",
        description: `${page.path} sayfası ${fmt(page.traffic)} ziyaret, %${page.bounceRate} hemen çıkma, ${page.avgDuration} süre ile dengeli performans sergiliyor.`,
        recommendation: "Mevcut performansı koruyarak küçük iyileştirmelerle trafiği artırmaya odaklanın.",
      });
    }
  }

  results.sort((a, b) => {
    const order: Record<string, number> = {
      high_traffic_high_bounce: 0,
      low_traffic_low_bounce: 1,
      top_performer: 2,
      opportunity: 3,
      average: 4,
    };
    return (order[a.type] ?? 99) - (order[b.type] ?? 99);
  });

  return results;
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
  const worstPage = [...site.pageDetails].sort((a, b) => b.bounceRate - a.bounceRate)[0];

  insights.push({
    type: "positive", icon: "Zap",
    title: "En Çok Ziyaret Edilen Sayfa",
    description: `${topPage.path} — ${fmt(topPage.traffic)} ziyaret (%${topPage.bounceRate} hemen çıkma, ${topPage.avgDuration} süre). Kategori: ${topPage.category}.`,
  });

  insights.push({
    type: "positive", icon: "Award",
    title: "En Düşük Hemen Çıkma",
    description: `${bestPage.path} — sadece %${bestPage.bounceRate} hemen çıkma, ${bestPage.avgDuration} kalış süresi. Kullanıcılar ${bestPage.pagesPerVisit} sayfa geziyor.`,
    siteId: "info",
  });

  if (highBouncePages.length > 0) {
    insights.push({
      type: "negative", icon: "TrendingDown",
      title: "Yüksek Hemen Çıkma Uyarısı",
      description: `${highBouncePages.length} sayfada hemen çıkma oranı %65 üzerinde: ${highBouncePages.map(p => `${p.path} (%${p.bounceRate})`).join(", ")}. Bu sayfalara iç link ve CTA eklenmeli.`,
    });
  }

  if (shortDurationPages.length > 0) {
    insights.push({
      type: "negative", icon: "MousePointerClick",
      title: "Kısa Kalış Süresi",
      description: `${shortDurationPages.length} sayfada ortalama kalış 2 dakikanın altında. Kullanıcılar hızlıca çıkıyor — içerik derinliği artırılmalı.`,
    });
  }

  if (lowBouncePages.length > 0) {
    insights.push({
      type: "neutral", icon: "Lightbulb",
      title: "Gizli Potansiyel",
      description: `${lowBouncePages.length} sayfa düşük trafik almasına rağmen yüksek etkileşim sağlıyor. Bu sayfaların trafiği artırılırsa önemli kazanç elde edilebilir.`,
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
      description: `${SITES.length} aracı kurumun toplam aylık ziyareti ${fmt(total)}. Ortalama Authority Score ${avgAS}/100.`,
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
  } else {
    const weekData = SITES.map((s) => ({
      site: s,
      current: getPeriodData(s.id, period),
      prev: getPeriodData(s.id, {
        week1: "week1", week2: "week1", week3: "week2", week4: "week3",
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
        description: `${top.site.name} geçen haftaya göre trafiğini %${top.change.toFixed(1)} artırdı.`,
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
      description: `Seçili haftada ${SITES.length} sitenin toplam trafiği ${fmt(totalWeekly)}.`,
    });

    const highBounce = [...weekData].filter(w => w.current).sort((a, b) => (b.site.bounceRate || 0) - (a.site.bounceRate || 0))[0];
    if (highBounce) {
      insights.push({
        type: "negative", icon: "MousePointerClick",
        title: "Yüksek Hemen Çıkma",
        description: `${highBounce.site.name} %${highBounce.site.bounceRate} hemen çıkma oranıyla en yüksek seviyede.`,
        siteId: highBounce.site.id,
      });
    }
  }

  return insights;
}
