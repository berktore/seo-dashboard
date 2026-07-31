"use client";

import { useState } from "react";
import { MARKET_QUOTES, MARKET_UPDATED_AT, marketSummary } from "@/lib/market-data";
import { cn } from "@/lib/utils";
import { Activity, RefreshCw } from "lucide-react";

export function LiveMarket() {
  const [filter, setFilter] = useState<"all" | "hisse" | "endeks" | "fx">("all");

  const items = MARKET_QUOTES.filter(q => {
    if (filter === "all") return true;
    if (filter === "hisse") return !["XU100", "USDTRY", "XAUUSD"].includes(q.symbol);
    if (filter === "endeks") return q.symbol === "XU100";
    return ["USDTRY", "XAUUSD"].includes(q.symbol);
  });

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-500/10">
            <Activity size={14} className="text-emerald-400" />
          </div>
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Canlı Piyasa</span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-500">
            <RefreshCw size={10} />
            Güncel
          </span>
        </div>
        <div className="flex gap-1">
          {([["all", "Tümü"], ["hisse", "Hisse"], ["endeks", "Endeks"], ["fx", "Döviz/Altın"]] as const).map(([id, label]) => (
            <button key={id} onClick={() => setFilter(id)}
              className={cn("px-2 py-1 text-[10px] font-medium rounded-md transition-all",
                filter === id ? "bg-zinc-700 text-zinc-100" : "text-zinc-600 hover:text-zinc-400")}
            >{label}</button>
          ))}
        </div>
      </div>
      <p className="text-[10px] text-zinc-600 mb-3">Son güncelleme: {MARKET_UPDATED_AT} · 52 hafta bandı içinde konum</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
        {items.map(q => {
          const up = q.changePct >= 0;
          const pos = Math.min(100, Math.max(0, ((q.price - q.low52w) / (q.high52w - q.low52w)) * 100));
          return (
            <div key={q.symbol} className="rounded-lg border border-zinc-800/60 bg-zinc-800/30 p-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-zinc-400">{q.symbol}</span>
                <span className={cn("text-[11px] font-semibold", up ? "text-emerald-400" : "text-red-400")}>
                  {up ? "+" : ""}{q.changePct.toFixed(2)}%
                </span>
              </div>
              <div className="text-sm font-bold text-white">
                {q.price.toLocaleString("tr-TR", { maximumFractionDigits: 2 })}
                <span className="text-[10px] text-zinc-600 ml-1">{q.currency}</span>
              </div>
              <div className="text-[10px] text-zinc-600 truncate">{q.name}</div>
              <div className="relative h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                <div className={cn("h-full rounded-full", up ? "bg-emerald-500" : "bg-red-500")} style={{ width: `${pos}%` }} />
              </div>
              <div className="text-[9px] text-zinc-700 mt-0.5">{q.low52w.toLocaleString("tr-TR")} — {q.high52w.toLocaleString("tr-TR")}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-start gap-1.5">
        <Activity size={12} className="text-emerald-400 mt-0.5 shrink-0" />
        <span>{marketSummary()}</span>
      </div>
    </div>
  );
}
