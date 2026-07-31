"use client";

import { useMemo, useState } from "react";
import { getOpportunityMatrix } from "@/lib/insights";
import { formatCompact, cn } from "@/lib/utils";
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import { Target } from "lucide-react";

export function OpportunityMatrix() {
  const points = useMemo(() => getOpportunityMatrix(), []);
  const [siteFilter, setSiteFilter] = useState("all");

  const data = siteFilter === "all" ? points : points.filter(p => p.siteId === siteFilter);
  const top = points.slice(0, 8);

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Target size={14} className="text-amber-400" />
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Fırsat Matrisi</span>
          <span className="text-[10px] text-zinc-600">Hacim × Zorluk</span>
        </div>
        <div className="flex gap-1">
          {["all", "info", "gcm", "isy", "midas"].map(id => (
            <button key={id} onClick={() => setSiteFilter(id)}
              className={cn("px-2 py-1 text-[10px] font-medium rounded-md transition-all",
                siteFilter === id ? "bg-zinc-700 text-zinc-100" : "text-zinc-600 hover:text-zinc-400")}>
              {id === "all" ? "Tümü" : id.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ top: 10, right: 10, bottom: 5, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis type="number" dataKey="difficulty" name="Zorluk" unit="" domain={[0, 100]}
            tick={{ fill: "#a1a1aa", fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: "Zorluk →", position: "insideBottom", offset: -2, fill: "#52525b", fontSize: 10 }} />
          <YAxis type="number" dataKey="volume" name="Hacim" domain={[0, 4200000]}
            tick={{ fill: "#a1a1aa", fontSize: 10 }} axisLine={false} tickLine={false}
            tickFormatter={(v) => v >= 1000 ? `${Math.round(v / 1000)}K` : String(v)} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3", stroke: "#3f3f46" }}
            contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, fontSize: 11 }}
            formatter={(v: any, name: any) => name === "Hacim" ? [`${Number(v).toLocaleString("tr-TR")}`, "Hacim"] : [v, name]}
            labelFormatter={(_, payload) => payload && payload[0] ? `${payload[0].payload.keyword} (${payload[0].payload.siteName})` : ""}
          />
          <Scatter data={data}>
            {data.map((p, i) => (
              <Cell key={i} fill={p.difficulty <= 40 ? "#22c55e" : p.difficulty <= 65 ? "#f59e0b" : "#ef4444"} fillOpacity={0.7} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap items-center gap-3 mt-2">
        <span className="flex items-center gap-1 text-[9px] text-zinc-600"><span className="w-2 h-2 rounded-full bg-green-500" /> Kolay (≤40)</span>
        <span className="flex items-center gap-1 text-[9px] text-zinc-600"><span className="w-2 h-2 rounded-full bg-amber-500" /> Orta (41-65)</span>
        <span className="flex items-center gap-1 text-[9px] text-zinc-600"><span className="w-2 h-2 rounded-full bg-red-500" /> Zor (&gt;65)</span>
      </div>

      <div className="mt-3 border-t border-zinc-800/60 pt-3">
        <div className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider mb-2">En Yüksek Fırsat Skoru</div>
        <div className="space-y-1.5">
          {top.map((p, i) => (
            <div key={i} className="flex items-center justify-between py-1 text-[11px] border-b border-zinc-800/30 last:border-0">
              <div className="min-w-0 flex-1 mr-2">
                <span className="text-zinc-300 font-medium truncate">{p.keyword}</span>
                <span className="text-zinc-600 ml-1.5">({p.siteName})</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-zinc-500">{formatCompact(p.volume)}</span>
                <span className={cn("font-semibold w-8 text-right", p.difficulty <= 40 ? "text-emerald-400" : p.difficulty <= 65 ? "text-amber-400" : "text-red-400")}>
                  Z{p.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
