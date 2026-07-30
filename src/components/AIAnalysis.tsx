"use client";

import { useState, useEffect } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatNumber } from "@/lib/utils";
import { SITES } from "@/lib/data";
import { PeriodId, getWeekLabel } from "@/lib/weekly-data";
import { generateInsights, analyzePages, Insight, PageAnalysis } from "@/lib/analysis";
import {
  TrendingUp, TrendingDown, Award, Zap, Link2, Globe, MousePointerClick,
  Lightbulb, Activity, BarChart3, AlertTriangle, Target, Flame, Sparkles,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp, TrendingDown, Award, Zap, Link2, Globe, MousePointerClick,
  Lightbulb, Activity, BarChart3, AlertTriangle, Target, Flame, Sparkles,
};

const PAGE_TYPE_STYLES: Record<string, { border: string; bg: string; text: string; badge: string; label: string }> = {
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
  const borderColor = insight.type === "positive" ? "border-emerald-500/20"
    : insight.type === "negative" ? "border-red-500/20" : "border-blue-500/20";
  const bgColor = insight.type === "positive" ? "bg-emerald-500/10"
    : insight.type === "negative" ? "bg-red-500/10" : "bg-blue-500/10";
  const textColor = insight.type === "positive" ? "text-emerald-400"
    : insight.type === "negative" ? "text-red-400" : "text-blue-400";
  const badgeVar = insight.type === "positive" ? "success"
    : insight.type === "negative" ? "danger" : "info";

  return (
    <div
      className={cn("animate-fade-in rounded-lg border p-4 transition-all duration-200 hover:bg-zinc-800/40", borderColor, "bg-zinc-900/40")}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex gap-3">
        <div className={cn("p-2 rounded-lg shrink-0 self-start", bgColor)}>
          <Icon size={16} className={textColor} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-zinc-200">{insight.title}</span>
            <Badge variant={badgeVar as any}>{insight.type === "positive" ? "Pozitif" : insight.type === "negative" ? "Negatif" : "Nötr"}</Badge>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">{insight.description}</p>
        </div>
      </div>
    </div>
  );
}

function PageCard({ analysis, index }: { analysis: PageAnalysis; index: number }) {
  const style = PAGE_TYPE_STYLES[analysis.type] || PAGE_TYPE_STYLES.average;
  const Icon = analysis.type === "high_traffic_high_bounce" ? AlertTriangle
    : analysis.type === "low_traffic_low_bounce" ? Sparkles
    : analysis.type === "top_performer" ? Target
    : analysis.type === "opportunity" ? Flame
    : Activity;
  const bgBar = analysis.type === "high_traffic_high_bounce" ? "bg-red-500"
    : analysis.type === "low_traffic_low_bounce" ? "bg-emerald-500"
    : "bg-blue-500";

  const bounceColor = analysis.page.bounceRate >= 65 ? "text-red-400"
    : analysis.page.bounceRate <= 40 ? "text-emerald-400" : "text-zinc-300";

  return (
    <div
      className={cn("animate-fade-in rounded-lg border p-4 transition-all duration-200 hover:bg-zinc-800/40", style.border, "bg-zinc-900/40")}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg shrink-0", style.bg)}>
          <Icon size={16} className={style.text} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-mono font-medium text-zinc-200 truncate">{analysis.page.path}</span>
            <Badge variant={style.badge as any}>{style.label}</Badge>
          </div>
          <span className="text-[10px] text-zinc-600">{analysis.page.category}</span>

          <div className="grid grid-cols-4 gap-2 mt-2.5">
            <div>
              <div className="text-[10px] text-zinc-600">Trafik</div>
              <div className="text-xs font-semibold text-zinc-200">{formatNumber(analysis.page.traffic)}</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-600">Hemen Çıkma</div>
              <div className={cn("text-xs font-semibold", bounceColor)}>%{analysis.page.bounceRate}</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-600">Süre</div>
              <div className="text-xs font-semibold text-zinc-200">{analysis.page.avgDuration}</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-600">Sayfa/Ziyaret</div>
              <div className="text-xs font-semibold text-zinc-200">{analysis.page.pagesPerVisit.toFixed(1)}</div>
            </div>
          </div>

          <div className="mt-2.5 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full", bgBar)}
              style={{ width: `${analysis.page.bounceRate}%` }}
            />
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed mt-2">{analysis.recommendation}</p>
        </div>
      </div>
    </div>
  );
}

interface AIAnalysisProps {
  period: PeriodId;
}

export function AIAnalysis({ period }: AIAnalysisProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [pageAnalyses, setPageAnalyses] = useState<PageAnalysis[]>([]);
  const [tab, setTab] = useState<"insights" | "pages">("pages");

  useEffect(() => {
    setInsights(generateInsights(period));
    setPageAnalyses(analyzePages());
  }, [period]);

  const criticalCount = pageAnalyses.filter(p => p.type === "high_traffic_high_bounce").length;
  const opportunityCount = pageAnalyses.filter(p => p.type === "low_traffic_low_bounce").length;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-purple-500/10">
              <Lightbulb size={16} className="text-purple-400" />
            </div>
            <CardTitle>AI Analizi — infoyatirim.com</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <Badge variant="danger">{criticalCount} kritik</Badge>
            )}
            {opportunityCount > 0 && (
              <Badge variant="success">{opportunityCount} fırsat</Badge>
            )}
            <Badge variant="purple">
              {period === "month" ? getWeekLabel(period) : `${getWeekLabel(period)} · Haftalık`}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("pages")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all",
              tab === "pages" ? "border-purple-500/40 bg-purple-500/10 text-purple-300" : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
            )}
          >
            Sayfa Analizi
          </button>
          <button
            onClick={() => setTab("insights")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg border transition-all",
              tab === "insights" ? "border-purple-500/40 bg-purple-500/10 text-purple-300" : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
            )}
          >
            Genel İçgörüler
          </button>
        </div>

        {tab === "pages" ? (
          <div className="space-y-3">
            <p className="text-xs text-zinc-600">infoyatirim.com sayfalarının hemen çıkma, kalış süresi ve trafik verilerine göre derinlemesine analizi. Kritik sayfalar önceliklendirilmiştir.</p>
            <div className="grid grid-cols-1 gap-3">
              {pageAnalyses.map((pa, i) => (
                <PageCard key={pa.page.path} analysis={pa} index={i} />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.map((insight, i) => (
              <InsightCard key={`${insight.title}-${i}`} insight={insight} index={i} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
