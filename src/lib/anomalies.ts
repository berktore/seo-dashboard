import { SITES } from "@/lib/data";
import { getWeeklyData } from "@/lib/weekly-data";

export interface Anomaly {
  siteId: string;
  siteName: string;
  type: "traffic_drop" | "traffic_spike" | "high_bounce" | "backlink_drop" | "organic_loss";
  severity: "kritik" | "orta" | "düşük";
  title: string;
  description: string;
  metric: string;
  currentValue: number;
  previousValue: number;
  changePercent: number;
}

export function detectAnomalies(): Anomaly[] {
  const anomalies: Anomaly[] = [];

  for (const site of SITES) {
    const weekly = getWeeklyData(site.id);
    if (weekly.length < 2) continue;

    const recent = weekly[weekly.length - 1];
    const prev = weekly[weekly.length - 2];

    const trafficChange = ((recent.visits - prev.visits) / prev.visits) * 100;
    if (trafficChange <= -10) {
      anomalies.push({
        siteId: site.id, siteName: site.name,
        type: "traffic_drop", severity: trafficChange <= -20 ? "kritik" : "orta",
        title: "Haftalık Trafik Düşüşü",
        description: `${site.name} geçen haftaya göre %${Math.abs(trafficChange).toFixed(1)} trafik kaybetti.`,
        metric: "Haftalık Ziyaret", currentValue: recent.visits, previousValue: prev.visits, changePercent: trafficChange,
      });
    } else if (trafficChange >= 20) {
      anomalies.push({
        siteId: site.id, siteName: site.name,
        type: "traffic_spike", severity: "düşük",
        title: "Ani Trafik Artışı",
        description: `${site.name} haftalık trafiği %${trafficChange.toFixed(1)} arttı. Kaynak analizi önerilir.`,
        metric: "Haftalık Ziyaret", currentValue: recent.visits, previousValue: prev.visits, changePercent: trafficChange,
      });
    }

    if (site.bounceRate >= 85) {
      anomalies.push({
        siteId: site.id, siteName: site.name,
        type: "high_bounce", severity: "kritik",
        title: "Kritik Hemen Çıkma Oranı",
        description: `${site.name} %${site.bounceRate} hemen çıkma oranıyla çok yüksek seviyede. Sayfa içi iyileştirme şart.`,
        metric: "Hemen Çıkma", currentValue: site.bounceRate, previousValue: 0, changePercent: 0,
      });
    }

    const backlinkChange = ((recent.backlinks - prev.backlinks) / prev.backlinks) * 100;
    if (backlinkChange <= -20) {
      anomalies.push({
        siteId: site.id, siteName: site.name,
        type: "backlink_drop", severity: backlinkChange <= -40 ? "kritik" : "orta",
        title: "Backlink Kaybı",
        description: `${site.name} toplam backlink sayısında %${Math.abs(backlinkChange).toFixed(1)} düşüş. Kaynak analizi yapılmalı.`,
        metric: "Backlink", currentValue: recent.backlinks, previousValue: prev.backlinks, changePercent: backlinkChange,
      });
    }

    if (site.organicChange <= -15) {
      anomalies.push({
        siteId: site.id, siteName: site.name,
        type: "organic_loss", severity: site.organicChange <= -25 ? "kritik" : "orta",
        title: "Organik Trafik Kaybı",
        description: `${site.name} organik trafiği aylık %${Math.abs(site.organicChange)} daraldı. Algoritma güncellemesi veya içerik sorunu olabilir.`,
        metric: "Organik Trafik Değişimi", currentValue: site.organicChange, previousValue: 0, changePercent: site.organicChange,
      });
    }
  }

  const severityOrder: Record<string, number> = { kritik: 0, orta: 1, düşük: 2 };
  anomalies.sort((a, b) => (severityOrder[a.severity] ?? 99) - (severityOrder[b.severity] ?? 99));
  return anomalies;
}

export function getShareOfVoice() {
  const total = SITES.reduce((a, s) => a + s.visits, 0);
  return SITES.map(s => ({
    id: s.id,
    name: s.name,
    color: s.color,
    visits: s.visits,
    share: (s.visits / total) * 100,
  })).sort((a, b) => b.visits - a.visits);
}

export function getShareTrend() {
  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz"];
  return months.map((month, mi) => {
    const row: Record<string, string | number> = { month };
    const total = SITES.reduce((a, s) => a + s.monthlyVisits[mi].value, 0);
    for (const s of SITES) {
      row[s.id] = total > 0 ? parseFloat(((s.monthlyVisits[mi].value / total) * 100).toFixed(1)) : 0;
    }
    return row;
  });
}
