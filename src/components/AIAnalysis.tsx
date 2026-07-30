"use client";

import { useState, useEffect } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatNumber } from "@/lib/utils";
import { SITES } from "@/lib/data";
import { PeriodId, getWeekLabel } from "@/lib/weekly-data";
import { generateInsights, analyzePages, generateCompetitorSummaries, Insight, PageAnalysis, CompetitorSummary } from "@/lib/analysis";
import {
  TrendingUp, TrendingDown, Award, Zap, Link2, Globe, MousePointerClick,
  Lightbulb, Activity, BarChart3, AlertTriangle, Target, Flame, Sparkles, Search,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp, TrendingDown, Award, Zap, Link2, Globe, MousePointerClick,
  Lightbulb, Activity, BarChart3, AlertTriangle, Target, Flame, Sparkles, Search,
};

const PAGE_STYLE: Record<string, { border: string; bg: string; text: string; badge: string; label: string }> = {
  high_traffic_high_bounce: {
    border: "border-red-500/20", bg: "bg-red-500/10", text: "text-red-400", badge: "danger", label: "Kritik",
  },
  low_traffic_low_bounce: {
    border: "border-emerald-500/20", bg: "bg-emerald-500/10", text: "text-emerald-400", badge: "success", label: "Fırsat",
  },
  top_performer: {
    border: "border-blue-500/20", bg: "bg-blue-500/10", text: "text-blue-400", badge: "info", label: "Mükemmel",
  },
  opportunity: {
    border: "border-amber-500/20", bg: "bg-amber-500/10", text: "text-amber-400", badge: "warning", label: "İyileştir",
  },
  average: {
    border: "border-zinc-700/50", bg: "bg-zinc-800/50", text: "text-zinc-400", badge: "default", label: "Standart",
  },
};

function InsightCard({ insight, index }: { insight: Insight; index: number }) {
  const Icon = ICON_MAP[insight.icon] || Lightbulb;
  const bc = insight.type === "positive" ? "border-emerald-500/20" : insight.type === "negative" ? "border-red-500/20" : "border-blue-500/20";
  const bgc = insight.type === "positive" ? "bg-emerald-500/10" : insight.type === "negative" ? "bg-red-500/10" : "bg-blue-500/10";
  const tc = insight.type === "positive" ? "text-emerald-400" : insight.type === "negative" ? "text-red-400" : "text-blue-400";
  const bv = insight.type === "positive" ? "success" as const : insight.type === "negative" ? "danger" as const : "info" as const;

  return (
    <div className={cn("animate-fade-in rounded-lg border p-4 transition-all hover:bg-zinc-800/40", bc, "bg-zinc-900/40")} style={{ animationDelay: `${index * 80}ms` }}>
      <div className="flex gap-3">
        <div className={cn("p-2 rounded-lg shrink-0 self-start", bgc)}><Icon size={16} className={tc} /></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-zinc-200">{insight.title}</span>
            <Badge variant={bv}>{insight.type === "positive" ? "Pozitif" : insight.type === "negative" ? "Negatif" : "Nötr"}</Badge>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">{insight.description}</p>
        </div>
      </div>
    </div>
  );
}

function PageCard({ analysis, index }: { analysis: PageAnalysis; index: number }) {
  const style = PAGE_STYLE[analysis.type] || PAGE_STYLE.average;
  const Icon = analysis.type === "high_traffic_high_bounce" ? AlertTriangle
    : analysis.type === "low_traffic_low_bounce" ? Sparkles
    : analysis.type === "top_performer" ? Target
    : analysis.type === "opportunity" ? Flame : Activity;
  const bounceColor = analysis.page.bounceRate >= 65 ? "text-red-400" : analysis.page.bounceRate <= 40 ? "text-emerald-400" : "text-zinc-300";

  return (
    <div className={cn("animate-fade-in rounded-lg border p-4 transition-all hover:bg-zinc-800/40", style.border, "bg-zinc-900/40")} style={{ animationDelay: `${index * 100}ms` }}>
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg shrink-0", style.bg)}><Icon size={16} className={style.text} /></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-mono font-medium text-zinc-200 truncate">{analysis.page.path}</span>
            <Badge variant={style.badge as any}>{style.label}</Badge>
          </div>
          <span className="text-[10px] text-zinc-600">{analysis.page.category}</span>
          <div className="grid grid-cols-4 gap-2 mt-2.5">
            <div><div className="text-[10px] text-zinc-600">Trafik</div><div className="text-xs font-semibold text-zinc-200">{formatNumber(analysis.page.traffic)}</div></div>
            <div><div className="text-[10px] text-zinc-600">Hemen Çıkma</div><div className={cn("text-xs font-semibold", bounceColor)}>%{analysis.page.bounceRate}</div></div>
            <div><div className="text-[10px] text-zinc-600">Süre</div><div className="text-xs font-semibold text-zinc-200">{analysis.page.avgDuration}</div></div>
            <div><div className="text-[10px] text-zinc-600">Sayfa/Ziyaret</div><div className="text-xs font-semibold text-zinc-200">{analysis.page.pagesPerVisit.toFixed(1)}</div></div>
          </div>
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full", analysis.type === "high_traffic_high_bounce" ? "bg-red-500" : analysis.type === "low_traffic_low_bounce" ? "bg-emerald-500" : "bg-blue-500")} style={{ width: `${analysis.page.bounceRate}%` }} />
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed mt-2">{analysis.recommendation}</p>
        </div>
      </div>
    </div>
  );
}

function CompetitorCard({ summary }: { summary: CompetitorSummary }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: summary.site.color }} />
        <span className="text-sm font-semibold text-zinc-200">{summary.site.name}</span>
        <Badge variant="info">{summary.totalPageTraffic >= 100000 ? "Büyük" : "Orta"}</Badge>
      </div>
      <p className="text-xs text-zinc-400 leading-relaxed mb-3">{summary.insight}</p>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-zinc-800/40 rounded-lg p-2 text-center">
          <div className="text-[10px] text-zinc-600">Toplam Sayfa Trafiği</div>
          <div className="text-xs font-bold text-zinc-200">{formatNumber(summary.totalPageTraffic)}</div>
        </div>
        <div className="bg-zinc-800/40 rounded-lg p-2 text-center">
          <div className="text-[10px] text-zinc-600">Ort. Hemen Çıkma</div>
          <div className="text-xs font-bold" style={{ color: summary.avgBounce >= 65 ? "#f87171" : summary.avgBounce <= 45 ? "#34d399" : "#e4e4e7" }}>%{summary.avgBounce}</div>
        </div>
        <div className="bg-zinc-800/40 rounded-lg p-2 text-center">
          <div className="text-[10px] text-zinc-600">En İyi Sayfa</div>
          <div className="text-[10px] font-mono text-zinc-300 truncate">{summary.bestPage.path}</div>
          <div className="text-[9px] text-emerald-400">%{summary.bestPage.bounceRate}</div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-[10px] text-zinc-600 font-semibold uppercase">En Çok Ziyaret Edilen Sayfalar</div>
        {summary.site.pageDetails.slice(0, 3).map(p => (
          <div key={p.path} className="flex items-center justify-between text-xs">
            <span className="font-mono text-zinc-400 truncate mr-2">{p.path}</span>
            <span className="text-zinc-300 font-medium shrink-0">{formatNumber(p.traffic)}</span>
          </div>
        ))}
      </div>

      {Object.keys(summary.categoryBreakdown).length > 0 && (
        <div className="mt-3 pt-3 border-t border-zinc-800">
          <div className="text-[10px] text-zinc-600 font-semibold uppercase mb-1.5">Kategori Dağılımı</div>
          <div className="flex gap-1.5 flex-wrap">
            {Object.entries(summary.categoryBreakdown).sort((a, b) => b[1] - a[1]).map(([cat, val]) => (
              <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{cat}: {formatNumber(val)}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface AIAnalysisProps {
  period: PeriodId;
}

export function AIAnalysis({ period }: AIAnalysisProps) {
  const [tab, setTab] = useState<string>("sitem");
  const [insights, setInsights] = useState<Insight[]>([]);
  const [pageAnalyses, setPageAnalyses] = useState<PageAnalysis[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorSummary[]>([]);
  const [selectedSites, setSelectedSites] = useState<string[]>(["info", "gcm"]);

  useEffect(() => {
    setInsights(generateInsights(period));
    setPageAnalyses(analyzePages());
    setCompetitors(generateCompetitorSummaries());
  }, [period]);

  const site = SITES[0];
  const criticalCount = pageAnalyses.filter(p => p.type === "high_traffic_high_bounce").length;
  const opportunityCount = pageAnalyses.filter(p => p.type === "low_traffic_low_bounce").length;

  const toggleSite = (id: string) => {
    setSelectedSites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-purple-500/10">
            <Lightbulb size={16} className="text-purple-400" />
          </div>
          <CardTitle>AI Analizi</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && tab === "sitem" && <Badge variant="danger">{criticalCount} kritik</Badge>}
          {opportunityCount > 0 && tab === "sitem" && <Badge variant="success">{opportunityCount} fırsat</Badge>}
          <Badge variant="purple">{period === "month" ? getWeekLabel(period) : `${getWeekLabel(period)} · Haftalık`}</Badge>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {[
          { id: "sitem", label: "Sitem", count: site.pageDetails.length },
          { id: "rakipler", label: "Rakipler", count: competitors.length },
          { id: "karsilastir", label: "Karşılaştırma", count: selectedSites.length },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all",
              tab === t.id
                ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
                : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
            )}
          >
            {t.label}{t.count > 0 ? ` (${t.count})` : ""}
          </button>
        ))}
      </div>

      {tab === "sitem" && (
        <div className="space-y-3">
          <p className="text-xs text-zinc-600">{site.name} sayfalarının hemen çıkma, kalış süresi ve trafik verilerine göre analizi.</p>
          <div className="grid grid-cols-1 gap-3">
            {pageAnalyses.map((pa, i) => <PageCard key={pa.page.path} analysis={pa} index={i} />)}
          </div>
        </div>
      )}

      {tab === "rakipler" && (
        <div className="space-y-3">
          <p className="text-xs text-zinc-600">{competitors.length} rakibin sayfa bazlı trafik analizi ve AI yorumları.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {competitors.map(c => <CompetitorCard key={c.site.id} summary={c} />)}
          </div>
        </div>
      )}

      {tab === "karsilastir" && (
        <div className="space-y-3">
          <p className="text-xs text-zinc-600">Karşılaştırmak istediğiniz siteleri seçin (en az 2).</p>

          <div className="flex gap-2 flex-wrap">
            {SITES.map(s => (
              <button key={s.id} onClick={() => toggleSite(s.id)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all",
                  selectedSites.includes(s.id)
                    ? "border-zinc-600 bg-zinc-800 text-zinc-100"
                    : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
                )}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: s.color }} />
                {s.id.toUpperCase()}
              </button>
            ))}
          </div>

          {selectedSites.length >= 2 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-800/50">
                    <th className="text-left px-3 py-2 text-[10px] font-semibold text-zinc-500 uppercase">Metrik</th>
                    {selectedSites.map(id => {
                      const s = SITES.find(x => x.id === id)!;
                      return <th key={id} className="text-right px-3 py-2"><span className="text-[10px] font-semibold uppercase" style={{ color: s.color }}>{s.id}</span></th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Ziyaret", fn: (id: string) => SITES.find(s => s.id === id)!.visitsDisplay },
                    { label: "Authority Score", fn: (id: string) => String(SITES.find(s => s.id === id)!.authorityScore) },
                    { label: "Hemen Çıkma", fn: (id: string) => `%${SITES.find(s => s.id === id)!.bounceRate}` },
                    { label: "Sayfa/Ziyaret", fn: (id: string) => SITES.find(s => s.id === id)!.pagesPerVisit.toFixed(2) },
                    { label: "Ort. Süre", fn: (id: string) => SITES.find(s => s.id === id)!.avgDuration },
                    { label: "Organik Trafik", fn: (id: string) => SITES.find(s => s.id === id)!.organicTraffic },
                    { label: "Ref Domain", fn: (id: string) => formatNumber(SITES.find(s => s.id === id)!.refDomains) },
                    { label: "Backlink", fn: (id: string) => formatNumber(SITES.find(s => s.id === id)!.totalBacklinks) },
                    { label: "AI Trafik", fn: (id: string) => String(SITES.find(s => s.id === id)!.aiTraffic) },
                  ].map(row => (
                    <tr key={row.label} className="border-t border-zinc-800">
                      <td className="px-3 py-2 text-xs text-zinc-400">{row.label}</td>
                      {selectedSites.map(id => (
                        <td key={id} className="px-3 py-2 text-right text-xs font-medium text-zinc-200">{row.fn(id)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedSites.length < 2 && (
            <p className="text-xs text-zinc-500 text-center py-4">Karşılaştırma için en az 2 site seçin.</p>
          )}
        </div>
      )}
    </Card>
  );
}
