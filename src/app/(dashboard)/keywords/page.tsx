"use client";

import { useEffect, useState } from "react";
import { formatCompact } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { findKeywordGaps, generateContentSuggestions } from "@/lib/keyword-gaps";
import { Search, Sparkles, FileText, Globe, ExternalLink } from "lucide-react";
import { KeywordMovers } from "@/components/KeywordMovers";
import { OpportunityMatrix } from "@/components/OpportunityMatrix";
import { useSemrush } from "@/hooks/useSemrush";

export default function KeywordsPage() {
  const [gaps, setGaps] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const { data: sem, real: semreal } = useSemrush();

  useEffect(() => {
    setGaps(findKeywordGaps());
    setSuggestions(generateContentSuggestions());
  }, []);

  return (
    <div className="space-y-5">
      {semreal && sem && (
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={14} className="text-blue-400" />
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Semrush Canlı Veri · {sem.domain}</span>
            <Badge variant="success">GERÇEK</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-[11px] text-zinc-500">Sıralama (TR)</div>
              <div className="text-xl font-bold text-zinc-100">#{sem.rank || "—"}</div>
            </div>
            <div>
              <div className="text-[11px] text-zinc-500">Organik Trafik (Top 12 kelimenin tahmini)</div>
              <div className="text-xl font-bold text-zinc-100">{formatCompact(sem.organicTraffic)}</div>
            </div>
            <div>
              <div className="text-[11px] text-zinc-500">Veri Zamanı</div>
              <div className="text-xs text-zinc-400 mt-1">{new Date(sem.fetchedAt).toLocaleString("tr-TR")}</div>
            </div>
          </div>
          <div className="space-y-1.5">
            {sem.topKeywords.slice(0, 10).map((k, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-zinc-800/30 border-b border-zinc-800/30 last:border-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-[10px] text-zinc-600 w-5 shrink-0">#{k.position}</span>
                  <span className="text-xs text-zinc-200 truncate">{k.keyword}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-zinc-400">{formatCompact(k.volume)} arama</span>
                  <span className="text-[11px] text-blue-400">{formatCompact(k.traffic)} trafik</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!semreal && (
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-4 flex items-center gap-2 text-xs text-zinc-500">
          <ExternalLink size={13} className="text-zinc-600" />
          Semrush canlı verisi için <code className="text-zinc-400">SEMRUSH_API_KEY</code> gerekli — anahtar eklenince gerçek kelime sıraları burada görünür.
        </div>
      )}
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
