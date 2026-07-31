"use client";

import { useMemo } from "react";
import { getKeywordMovers } from "@/lib/insights";
import { formatCompact } from "@/lib/utils";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";

export function KeywordMovers() {
  const { winners, losers } = useMemo(() => getKeywordMovers(5), []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} className="text-emerald-400" />
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Yükselen Kelimeler</span>
        </div>
        <div className="space-y-1.5">
          {winners.map((w, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-zinc-800/30 border-b border-zinc-800/30 last:border-0">
              <div className="min-w-0 flex-1 mr-2">
                <div className="text-xs text-zinc-200 truncate">{w.keyword}</div>
                <div className="text-[10px] text-zinc-600">{w.siteName} · #{w.position} · {formatCompact(w.volume)} araması</div>
              </div>
              <span className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-400 shrink-0">
                <ArrowUp size={11} /> +{w.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown size={14} className="text-red-400" />
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Düşen Kelimeler</span>
        </div>
        <div className="space-y-1.5">
          {losers.map((w, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-zinc-800/30 border-b border-zinc-800/30 last:border-0">
              <div className="min-w-0 flex-1 mr-2">
                <div className="text-xs text-zinc-200 truncate">{w.keyword}</div>
                <div className="text-[10px] text-zinc-600">{w.siteName} · #{w.position} · {formatCompact(w.volume)} araması</div>
              </div>
              <span className="flex items-center gap-0.5 text-[11px] font-bold text-red-400 shrink-0">
                <ArrowDown size={11} /> {w.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
