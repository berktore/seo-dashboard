"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { SITES } from "@/lib/data";
import { formatCompact } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { detectAnomalies } from "@/lib/anomalies";
import { getForecastInsight } from "@/lib/forecast";
import { usePeriod } from "@/lib/period";
import { getPeriodData, getWeekLabel } from "@/lib/weekly-data";
import { useGa4 } from "@/hooks/useGa4";
import { Sparkles, Copy, Check, RefreshCw, Database } from "lucide-react";

export function ExecutiveSummary() {
  const { period } = usePeriod();
  const { data: ga, real } = useGa4(period);
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [nonce, setNonce] = useState(0);

  const summary = useMemo(() => {
    const info = SITES[0];
    const wd = getPeriodData("info", period);
    const isWeekly = period !== "month";
    const visits = ga && real ? ga.sessions : wd ? wd.visits : info.visits;
    const organic = ga && real ? ga.organicSessions : wd ? wd.organic : info.visits;
    const marketShare = ga && real
      ? (ga.sessions / (ga.sessions + (wd ? 0 : SITES.slice(1).reduce((a, s) => a + s.visits, 0) * 0.01))) * 100
      : SITES.reduce((a, s) => a + (getPeriodData(s.id, period)?.visits || 0), 0) > 0
        ? ((visits / SITES.reduce((a, s) => a + (getPeriodData(s.id, period)?.visits || 0), 0)) * 100).toFixed(1)
        : "0.0";
    const leader = [...SITES].sort((a, b) => b.visits - a.visits)[0];
    const gainer = [...SITES].sort((a, b) => (b.organicChange || 0) - (a.organicChange || 0))[0];
    const anomalies = detectAnomalies().filter(a => a.severity === "kritik");
    const fc = getForecastInsight("info");
    const topPage = [...info.pageDetails].sort((a, b) => b.traffic - a.traffic)[0];
    const avgBounce = Math.round(info.pageDetails.reduce((a, p) => a + p.bounceRate, 0) / info.pageDetails.length);
    const periodLabel = isWeekly ? getWeekLabel(period) : "Haziran 2026";

    return [
      `# ${isWeekly ? "Haftalık" : "Aylık"} SEO Özeti — infoyatirim.com`,
      `*Dönem: ${periodLabel}${ga && real ? ` · Kaynak: GA4 (${ga.rangeLabel})` : " · Kaynak: örnek veri"}*`,
      ``,
      `## Performans`,
      `• infoyatirim.com ${formatCompact(visits)} ziyaret${ga && real ? ` (${formatCompact(ga.users)} kullanıcı, önceki döneme göre %${ga.sessionsDelta >= 0 ? "+" : ""}${ga.sessionsDelta})` : ""} ile pazarın %${marketShare}'ine sahip. Lider: ${leader.name} (${leader.visitsDisplay}).`,
      `• Organik trafik: ${formatCompact(organic)} ziyaret${ga && real ? ` (toplamın %${ga.sessions > 0 ? Math.round((ga.organicSessions / ga.sessions) * 100) : 0}'i, hemen çıkma %${ga.bounceRate})` : `. Authority Score ${info.authorityScore}/100; ortalama hemen çıkma %${avgBounce}`}. En iyi sayfa ${ga && real ? (ga.topPages[0]?.path || "/") : topPage.path} (${formatCompact(ga && real ? (ga.topPages[0]?.sessions || 0) : topPage.traffic)} ziyaret).`,
      `• Organik trafik aylık %${Math.abs(info.organicChange)} değişim gösterdi. En hızlı büyüyen rakip: ${gainer.name} (%${gainer.organicChange}).`,
      `• Tahmin: ${fc.text}`,
      ``,
      `## Dikkat Gerektirenler`,
      anomalies.length > 0
        ? anomalies.slice(0, 3).map(a => `• [Kritik] ${a.siteName}: ${a.title}`).join("\n")
        : "• Kritik anomali yok. Veriler düzenli.",
      ``,
      `## Öncelikli Aksiyonlar`,
      `1. Hemen çıkma oranı %65 üzeri sayfaları iyileştir (iç bağlantı + CTA).`,
      `2. Rakiplerin sıraladığı boşluktaki kelimelere içerik üret.`,
      `3. Backlink profiline odaklan — yetkili finans sitelerinden bağlantılar al.`,
      ``,
      `*Otomatik oluşturuldu — {tarih}*`,
    ].join("\n").replace("{tarih}", new Date().toLocaleDateString("tr-TR"));
  }, [period, nonce, ga, real]);

  useEffect(() => { setText(summary); }, [summary]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { }
  };

  const regenerate = useCallback(() => setNonce(n => n + 1), []);

  return (
    <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-zinc-900/60 backdrop-blur-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-purple-500/10">
            <Sparkles size={14} className="text-purple-400" />
          </div>
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Executive Summary</span>
          <Badge variant="purple">AI Özet</Badge>
          <span className="text-[10px] text-zinc-600">{period === "month" ? "Haziran 2026" : getWeekLabel(period)}</span>
          {real && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-medium">
              <Database size={10} /> GA4
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={copy} className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium rounded-lg border border-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all">
            {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
            {copied ? "Kopyalandı" : "Kopyala"}
          </button>
          <button onClick={regenerate} className="p-1.5 rounded-lg border border-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all" title="Özeti yeniden oluştur">
            <RefreshCw size={11} />
          </button>
        </div>
      </div>
      <div className="rounded-lg border border-zinc-800/50 bg-black/30 p-4 max-h-96 overflow-y-auto">
        <pre className="whitespace-pre-wrap font-sans text-[11px] leading-relaxed text-zinc-300">{text}</pre>
      </div>
    </div>
  );
}
