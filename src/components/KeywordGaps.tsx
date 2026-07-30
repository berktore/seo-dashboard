"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { findKeywordGaps, generateContentSuggestions } from "@/lib/keyword-gaps";
import { formatNumber } from "@/lib/utils";
import { Search, FileText, Sparkles, TrendingUp, ExternalLink } from "lucide-react";

const PRIORITY_STYLE: Record<string, { border: string; bg: string; text: string; badge: "danger" | "warning" | "info" }> = {
  yüksek: { border: "border-red-500/20", bg: "bg-red-500/10", text: "text-red-400", badge: "danger" },
  orta: { border: "border-amber-500/20", bg: "bg-amber-500/10", text: "text-amber-400", badge: "warning" },
  düşük: { border: "border-blue-500/20", bg: "bg-blue-500/10", text: "text-blue-400", badge: "info" },
};

export function KeywordGaps() {
  const gaps = findKeywordGaps();
  const suggestions = generateContentSuggestions();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-md bg-blue-500/10"><Search size={16} className="text-blue-400" /></div>
          <CardTitle>Anahtar Kelime Boşluğu</CardTitle>
          <Badge variant="info">{gaps.length} fırsat</Badge>
        </div>
        <p className="text-xs text-zinc-600 mb-3">Rakiplerin sıraladığı ancak infoyatirim.com'da olmayan kelimeler</p>
        <div className="space-y-2 max-h-[420px] overflow-y-auto">
          {gaps.map((gap, i) => {
            const ps = PRIORITY_STYLE[gap.relevance] || PRIORITY_STYLE.düşük;
            return (
              <div key={`${gap.competitorId}-${gap.keyword}`} className={cn("rounded-lg border p-3", ps.border, "bg-zinc-900/40")}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-semibold text-zinc-200">{gap.keyword}</span>
                      <Badge variant={ps.badge}>{gap.relevance}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-600">
                      <span>Rakip: {gap.competitorName}</span>
                      <span>·</span>
                      <span>Pozisyon: #{gap.competitorPosition}</span>
                      <span>·</span>
                      <span>Hacim: {formatNumber(gap.competitorVolume)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-md bg-emerald-500/10"><FileText size={16} className="text-emerald-400" /></div>
          <CardTitle>İçerik Önerileri</CardTitle>
          <Badge variant="success">{suggestions.length} öneri</Badge>
        </div>
        <p className="text-xs text-zinc-600 mb-3">Boşluktaki kelimelere göre AI tarafından üretilen sayfa önerileri</p>
        <div className="space-y-2 max-h-[420px] overflow-y-auto">
          {suggestions.map((s, i) => {
            const ps = PRIORITY_STYLE[s.priority] || PRIORITY_STYLE.düşük;
            return (
              <div key={i} className={cn("rounded-lg border p-3", ps.border, "bg-zinc-900/40")}>
                <div className="flex items-start gap-2">
                  <div className={cn("p-1.5 rounded-lg shrink-0", ps.bg)}>
                    <Sparkles size={14} className={ps.text} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-semibold text-zinc-200">{s.title}</span>
                      <Badge variant={ps.badge}>{s.priority}</Badge>
                    </div>
                    <div className="text-[10px] text-zinc-500 mb-1">
                      Hedef kelime: <span className="text-zinc-300">{s.targetKeyword}</span> · Hacim: {formatNumber(s.volume)}
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">{s.reason}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
