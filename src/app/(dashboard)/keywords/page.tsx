"use client";

import { useEffect, useState } from "react";
import { formatCompact } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { findKeywordGaps, generateContentSuggestions } from "@/lib/keyword-gaps";
import { Search, Sparkles, FileText } from "lucide-react";
import { KeywordMovers } from "@/components/KeywordMovers";
import { OpportunityMatrix } from "@/components/OpportunityMatrix";

export default function KeywordsPage() {
  const [gaps, setGaps] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    setGaps(findKeywordGaps());
    setSuggestions(generateContentSuggestions());
  }, []);

  return (
    <div className="space-y-5">
      <KeywordMovers />
      <OpportunityMatrix />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Search size={14} className="text-blue-400" />
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Anahtar Kelime Boşluğu</span>
            <Badge variant="info">{gaps.length} fırsat</Badge>
          </div>
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {gaps.slice(0, 15).map((g, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-zinc-800/30 text-xs border-b border-zinc-800/30 last:border-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-zinc-300 font-medium truncate">{g.keyword}</span>
                  <span className="text-[10px] text-zinc-600 shrink-0">#{g.competitorPosition}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-zinc-500">{g.competitorName.split(".")[0]}</span>
                  <span className="text-zinc-400">{formatCompact(g.competitorVolume)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-emerald-400" />
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">İçerik Önerileri</span>
            <Badge variant="success">{suggestions.length} öneri</Badge>
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {suggestions.map((s, i) => (
              <div key={i} className="rounded-lg border border-zinc-800/50 bg-zinc-800/20 p-3">
                <div className="flex items-start gap-2">
                  <FileText size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-zinc-200">{s.title}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Hedef: {s.targetKeyword} · Hacim: {formatCompact(s.volume)}</div>
                    <div className="text-[10px] text-zinc-600 mt-0.5">{s.reason}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
