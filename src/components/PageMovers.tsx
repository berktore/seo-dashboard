"use client";

import { useMemo } from "react";
import { getPageMovers } from "@/lib/insights";
import { formatCompact, cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, FileText } from "lucide-react";

export function PageMovers() {
  const { gainers, losers } = useMemo(() => getPageMovers("info", 4), []);

  const Row = ({ p, up }: { p: { path: string; traffic: number; change: number; category: string }; up: boolean }) => (
    <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/30 last:border-0">
      <div className="min-w-0 flex-1 mr-2">
        <div className="text-xs font-mono text-zinc-200 truncate">{p.path}</div>
        <div className="text-[10px] text-zinc-600">{p.category} · {formatCompact(p.traffic)} ziyaret</div>
      </div>
      <span className={cn("flex items-center gap-0.5 text-[11px] font-bold shrink-0", up ? "text-emerald-400" : "text-red-400")}>
        {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
        %{Math.abs(p.change)}
      </span>
    </div>
  );

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
      <div className="flex items-center gap-2 mb-3">
        <FileText size={14} className="text-blue-400" />
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sayfa Performansı · infoyatirim.com</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">En Çok Büyüyen</div>
          {gainers.map((p, i) => <Row key={i} p={p} up />)}
        </div>
        <div>
          <div className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mb-1">En Çok Kaybeden</div>
          {losers.map((p, i) => <Row key={i} p={p} up={false} />)}
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center gap-1.5 text-[10px] text-zinc-600">
        <ArrowUpRight size={10} className="text-emerald-400" />
        Son döneme göre trafik değişimi. Kaybeden sayfalar "içerik çürümesi" sinyali olabilir.
      </div>
    </div>
  );
}
