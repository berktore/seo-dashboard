"use client";

import { useState, useEffect } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PeriodId, getWeekLabel } from "@/lib/weekly-data";
import { generateInsights, Insight } from "@/lib/analysis";
import {
  TrendingUp, TrendingDown, Award, Zap, Link2, Globe, MousePointerClick,
  Lightbulb, Activity, BarChart3,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp, TrendingDown, Award, Zap, Link2, Globe, MousePointerClick,
  Lightbulb, Activity, BarChart3,
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
      className={cn(
        "animate-fade-in rounded-lg border p-4 transition-all duration-200 hover:bg-zinc-800/40",
        borderColor, "bg-zinc-900/40"
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex gap-3">
        <div className={cn("p-2 rounded-lg shrink-0 self-start", bgColor)}>
          <Icon size={16} className={textColor} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-zinc-200">{insight.title}</span>
            <Badge variant={badgeVar}>{insight.type === "positive" ? "Pozitif" : insight.type === "negative" ? "Negatif" : "Nötr"}</Badge>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">{insight.description}</p>
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

  useEffect(() => {
    setInsights(generateInsights(period));
  }, [period]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-purple-500/10">
            <Lightbulb size={16} className="text-purple-400" />
          </div>
          <CardTitle>AI Analizi</CardTitle>
        </div>
        <Badge variant="purple">
          {period === "month" ? getWeekLabel(period) : `${getWeekLabel(period)} · Haftalık`}
        </Badge>
      </div>
      <p className="text-xs text-zinc-600 mb-4">
        {period === "month"
          ? "Aylık verilere göre otomatik oluşturulan içgörüler"
          : "Seçili haftanın verilerine göre karşılaştırmalı analiz"}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insight, i) => (
          <InsightCard key={`${insight.title}-${i}`} insight={insight} index={i} />
        ))}
      </div>
    </Card>
  );
}
